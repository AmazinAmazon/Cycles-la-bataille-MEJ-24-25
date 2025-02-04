var cartes = []
var etapes = ""

function tirerLaSerie(n) {

    const errDiv = document.getElementById("divErreur");
    if (errDiv) {
        errDiv.remove();
    }
    
    const cartesDuJeu = [];
    const used = new Set();

    while (cartesDuJeu.length < n) {
        const rand = Math.floor(Math.random() * n) + 1; //numero au hazard pour le positionnement du chifre
        if (!used.has(rand)) { //verifie si le chifre est deja utilisé
            used.add(rand); 
            cartesDuJeu.push(rand);
        }
    }

    cartes = arrangerCartes(cartesDuJeu);
    document.getElementById("cartesJ1").textContent = cartes[0]
    document.getElementById("cartesJ2").textContent = cartes[1]
}

/**
 * ## Fonction pour tirer les cartes
 * ### Paramètres
 * - cartes: nombre de cartes à tirer
 * ### Retourne
 * - Une liste composé de deux listes, chaqune contenant les cartes d'un joueur
 */

function arrangerCartes(cartes) {
    let cartes1 = []
    let cartes2 = []
    //console.log(cartes, cartes.length)
    for (let i = 0; i < cartes.length; i++) {
        const pOF = pileOuFace()
        //console.log(pOF)
        if (pOF === 0) {
            cartes1.push(cartes[i]);
        } else {
            cartes2.push(cartes[i]);
        }
    }

    const cartesTXT = document.getElementById("cartesTXT");
    cartesTXT.textContent = `Cartes1: [${cartes1}], Cartes2: [${cartes2}]`

    const divGagneur = document.getElementById("divGagneur");
    if (divGagneur) {
        divGagneur.remove();
    }
    const etapesDiv = document.getElementById("divEtapes");
    if (etapesDiv) {
        etapesDiv.remove();
    }

    return [cartes1, cartes2];
}

function pileOuFace() {
    return Math.floor(Math.random() * 2);
}

function jouerCartes(dev = false) {

    if (!dev) {
        if (cartes.length == 0) {
            alert("Veuillez d'abord tirer les cartes");
            return;
        } else if (cartes[0].length == 0 || cartes[1].length == 0) {
            alert("Les cartes sont déjà jouées");
            return;
        }

        const divGagneur = document.getElementById("divGagneur");
        if (divGagneur) {
            divGagneur.remove();
        }
        const etapesDiv = document.getElementById("divEtapes");
        if (etapesDiv) {
            etapesDiv.remove();
        }
        const errDiv = document.getElementById("divErreur");
        if (errDiv) {
            errDiv.remove();
        }

    }

    const player1 = cartes[0];
    const player2 = cartes[1];
    etapes = `[${player1}][${player2}]`;

    const maxTurns = 1000; // Définir un seuil maximum pour le nombre de tours
    let turnCount = 0; // Initialiser le compteur de tours

    while (player1.length != 0 && player2.length != 0) {
        if (turnCount >= maxTurns) { // Vérifier si le compteur de tours a dépassé le seuil maximum
            if (dev == false) {
                console.log("Boucle détectée"); // Afficher un message indiquant qu'une boucle a été détectée
            
                if (document.getElementById("gagneur").childElementCount > 0) {
                    return;
                }
                const etapesDiv = document.getElementById("gagneur");
                const div = document.createElement("div");
                div.id = "divErreur";
                div.className = "mt-1 col-md bg-danger bg-gradient rounded-3 px-2 p-1 text-white font-monospace";
                div.textContent = "Une boucle a été détectée";
                etapesDiv.appendChild(div);
            
            } 
            return "boucle";
        }

        if (player1[0] > player2[0]) { // si la premiere carte du joueur 1 est plus grande que celle du joueur 2
            player1.push(player1[0], player2[0]); // les cartes sont ajoutées à la fin du paquet du joueur 1
            player2.shift(); // la premiere carte du joueur 2 est retirée
            player1.shift(); // la premiere carte du joueur 1 est retirée
            etapes += ` -> [${player1}][${player2}]`
            //console.log(player1, player2);
        } else if (player1[0] < player2[0]) { // si la premiere carte du joueur 2 est plus grande que celle du joueur 1
            player2.push(player2[0], player1[0]);
            player1.shift();
            player2.shift();
            etapes += ` -> [${player1}][${player2}]`
        }

        turnCount++; // Incrémenter le compteur de tours
    }

    if (dev === false) {
        document.getElementById("etapesButton").classList.remove("d-none");
        
        document.getElementById("cartesJ1").textContent += " ..->" + cartes[0];
        document.getElementById("cartesJ2").textContent += " ..->" + cartes[1];


        if (cartes[0].length == 0) {
            afficherGagneur(2);
        } else {
            afficherGagneur(1);
        }
    }
    
}

function afficherEtapes() {
    //check if this has already been done
    if (document.getElementById("etapes").childElementCount > 0) {
        return;
    }
    //add a div child to the "étapes" div
    const etapesDiv = document.getElementById("etapes");
    const div = document.createElement("div");
    div.id = "divEtapes";

    div.className = "mt-1 col-md bg-dark bg-gradient rounded-3 px-2 p-1 text-white";
    div.textContent = etapes;
    etapesDiv.appendChild(div);

}

function afficherGagneur(gagnant) {
    //check if this has already been done
    if (document.getElementById("gagneur").childElementCount > 0) {
        return;
    }
    //add a div child to the "étapes" div
    const etapesDiv = document.getElementById("gagneur");
    const div = document.createElement("div");
    div.id = "divGagneur";
    div.className = "mt-1 col-md bg-success bg-gradient rounded-3 px-2 p-1 text-white font-monospace";
    div.textContent = `Le joueur ${gagnant} a gagné!`;
    etapesDiv.appendChild(div);

}

function tousLesJeux(n, maxTurns = 5000) { // boucle qui tire la serie, joue les cartes et saufgarde les etapes pour verifier que il ne se repete pas
    const allGames = new Set();
    let winj1 = 0;
    let winj2 = 0;
    let i = 0;
    let skipped = 0;
    while (i < maxTurns) {
        tirerLaSerie(n);
        jouerCartes(true);
        if (etapes.includes("->")) {
            if (!allGames.has(etapes)) {
                allGames.add(etapes);
                if (etapes.slice(-2)[0] === "[") {
                    winj1++;
                } else {
                    winj2++;
                }
            } else {
                skipped++;
            }
            i++;
        }
    }
    console.log(`Total checked: ${i}, total skipped: ${skipped}. Joueur 1 gagne ${winj1} fois, joueur 2 gagne ${winj2} fois`); // Afficher le nombre total d'itérations
    console.log(allGames);
}


// Décris la fonction
// n: nombre de cartes dans le jeu
// maxCheck: nombre maximum d'itérations pour vérifier les boucles
// showBoucles: afficher toutes les configurations de cartes jouées
// Retourne: les configurations de cartes jouées et les étapes des boucles détectées
function checkBoucles(n, maxCheck = 50, showBoucles = false) {
    let i = 0;
    let playedSets = new Set();
    let bouclesDet = []; 
    let skipped = 0;

    while (i < maxCheck) { // Boucle jusqu'à atteindre le nombre maximum d'itérations
        tirerLaSerie(n);
        if (!playedSets.has(JSON.stringify(cartes))) { 
            playedSets.add(JSON.stringify(cartes)); 
            let jeu = jouerCartes(true); 
            if (jeu === "boucle") { 
                bouclesDet.push(etapes); 
            } 
        } else {
            skipped++;
        }
        i++; // Incrémenter le compteur d'itérations

    }

    console.log(`Total checked: ${i}, total skipped: ${skipped}, boucles: ${bouclesDet.length}`); // Afficher le nombre total d'itérations
    if (showBoucles) {
        console.log(bouclesDet); // Afficher toutes les configurations de cartes jouées
    }
    //if (showLogs) console.log(playedSets); // Afficher toutes les configurations de cartes jouées
}
// Boucles:
// [5, 2, 3] [3, 4]
// [1, 4], [5, 2, 3]

function parseTransitions(input) {
    // Split the input string on "->", allowing for extra whitespace.
    return input.split(/\s*->\s*/);

}
  
function premierePeriodeCheck(input) {
  const boucleArray = parseTransitions(input);
  const boucleDict = {};
  firstOccurenceRep = false;

  boucleArray.forEach((boucle) => {
    const boucleTrimmed = boucle.trim();
    if (boucleDict.hasOwnProperty(boucleTrimmed)) {
      boucleDict[boucleTrimmed] += 1;
      if (firstOccurenceRep === false) {
        console.log(`${boucleTrimmed} est le début de la période répétée.`);
        firstOccurenceRep = true;
      }
    } else {
      boucleDict[boucleTrimmed] = 1;
    }
  });

  for (const key in boucleDict) {
    console.log(`Jeu ${key} apparaît ${boucleDict[key]} fois.`);
  }

  //return boucleDict;
}

// let input = "[3,5][4,1,2] -> [5][1,2,4,3] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1] -> [5,3][1,4,2] -> [3,5,1][4,2] -> [5,1][2,4,3] -> [1,5,2][4,3] -> [5,2][3,4,1] -> [2,5,3][4,1]";
  
//   // Build the dictionary and check for recurring terms.
// let boucleDictionary = boucleArrayCount(input);
// console.log(boucleDictionary);
  