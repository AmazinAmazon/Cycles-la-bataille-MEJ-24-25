// logic: deck of cards of N cards divided in 2 people 

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

    const cartes = arrangerCartes(cartesDuJeu);
    const pOF = pileOuFace();
    if (pOF == 1) { // Si pile, attribuer la premiere pile au joueur 1
        document.getElementById("cartesJ1").textContent = cartes[0]
        document.getElementById("cartesJ2").textContent = cartes[1]
    } else {
        document.getElementById("cartesJ1").textContent = cartes[1]
        document.getElementById("cartesJ2").textContent = cartes[0]

    }
}

function arrangerCartes(cartes) {
    if (cartes.length % 2 == 0) { //si le nombres de cartes est pair
        splitNbr = cartes.length / 2;
        cartes1 = [];
        cartes2 = [];
        cartes1 = cartes.slice(0, splitNbr) //première moitié des cartes
        cartes2 = cartes.slice(splitNbr, cartes.length) //deuxieme moitié des cartes

    } else {
        splitNbr = (cartes.length + 1) / 2;
        cartes1 = [];
        cartes2 = [];
        cartes1 = cartes.slice(0, splitNbr) //première moitié des cartes
        cartes2 = cartes.slice(splitNbr, cartes.length) //deuxieme moitié des cartes

    }
    cartesTXT = document.getElementById("cartesTXT");
    cartesTXT.textContent = `Cartes1: [${cartes1}], Cartes2: [${cartes2}]`
    return [cartes1, cartes2];
}

// Joueur 1 = Pile = 1
// Joueur 2 = Face = 0
function pileOuFace() {
    const rand = Math.floor(Math.random() * 2);
    console.log(rand)
    return rand;
}