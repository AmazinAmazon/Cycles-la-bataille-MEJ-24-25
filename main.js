var cartes = []
var etapes = ""

function tirerLaSerie(n) {
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
    return [cartes1, cartes2];
}

function pileOuFace() {
    return Math.floor(Math.random() * 2);
}

function jouerCartes() {

    // if (cartes.length == 0) {
    //     alert("Veuillez d'abord tirer les cartes");
    //     return;
    // } else if (cartes[0].length == 0 || cartes[1].length == 0) {
    //     alert("Les cartes sont déjà jouées");
    //     return;
    // }

    const player1 = cartes[0];
    const player2 = cartes[1];
    etapes = `[${player1}][${player2}]`;

    const maxTurns = 100; // Définir un seuil maximum pour le nombre de tours
    let turnCount = 0; // Initialiser le compteur de tours

    while (player1.length > 0 && player2.length > 0) {
        if (turnCount >= maxTurns) { // Vérifier si le compteur de tours a dépassé le seuil maximum
            return "boucle";
            break;
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

    //console.log(etapes)
    document.getElementById("etapesButton").classList.remove("d-none");
    
    document.getElementById("cartesJ1").textContent += " ..->" + cartes[0];
    document.getElementById("cartesJ2").textContent += " ..->" + cartes[1];
}

function afficherEtapes() {
    //check if this has already been done
    if (document.getElementById("etapes").childElementCount > 0) {
        return;
    }
    //add a div child to the "étapes" div
    const etapesDiv = document.getElementById("etapes");
    const div = document.createElement("div");
    div.className = "mt-1 col-md bg-dark bg-gradient rounded-3 px-2 p-1 text-white";
    div.textContent = etapes;
    etapesDiv.appendChild(div);

}

// function tousLesJeux(n) { // boucle qui tire la serie, joue les cartes et saufgarde les etapes pour verifier que il ne se repete pas
//     const maxTurns = 1000;
//     const allGames = new Set();
//     let i = 0;
//     while (i < maxTurns) {
//         tirerLaSerie(n);
//         jouerCartes();
//         if (etapes.includes("->")) {
//             if (!allGames.has(etapes)) {
//                 if (etapes[4] === "]") {
//                     allGames.add(etapes);
//                 }
//             }
//             i++;
//         }
//     }
//     console.log(allGames);
// }

function checkBoucles(n) { //n le nombre de cartes dans le jeu
    const maxCheck = 10000;
    let i = 0;
    let playedSets = new Set();
    let bouclesDet = [];
    while (i < maxCheck) {
        tirerLaSerie(n);
        if (!playedSets.has(JSON.stringify(cartes))) {
            playedSets.add(JSON.stringify(cartes))
            let jeu = jouerCartes()
            if (jeu === "boucle") {
                bouclesDet.push(etapes);
            }
        }
        i++
    }
    console.log(`Total iterations: ${i}`);
    console.log(bouclesDet);

}

// Boucles:
// [5, 2, 3] [3, 4]
// [1, 4], [5, 2, 3]