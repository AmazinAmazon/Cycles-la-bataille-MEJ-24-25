var cartes = []

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
    var cartes1 = []
    var cartes2 = []
    //console.log(cartes, cartes.length)
    for (let i = 0; i < cartes.length; i++) {
        const pOF = pileOuFace()
        //console.log(pOF)
        if (pOF == 0) {
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
    const rand = Math.floor(Math.random() * 2);
    return rand;
}

function jouerCartes() {

    if (cartes.length == 0) {
        alert("Veuillez d'abord tirer les cartes");
        return;
    } else if (cartes[0].length == 0 || cartes[1].length == 0) {
        alert("Les cartes sont déjà jouées");
        return;
    }

    const player1 = cartes[0];
    const player2 = cartes[1];

    while (player1.length > 0 && player2.length > 0) {
        if (player1[0] > player2[0]) { // si la premiere carte du joueur 1 est plus grande que celle du joueur 2
            player1.push(player1[0], player2[0]); // les cartes sont ajoutées à la fin du paquet du joueur 1
            player2.shift(); // la premiere carte du joueur 2 est retirée
            player1.shift(); // la premiere carte du joueur 1 est retirée
            console.log(player1, player2)
        } else if (player1[0] < player2[0]) { // si la premiere carte du joueur 2 est plus grande que celle du joueur 1
            player2.push(player2[0], player1[0]);
            player1.shift();
            player2.shift();
            console.log(player1, player2)
           
        }
    }

    document.getElementById("cartesJ1").textContent += " ..->" + cartes[0]
    document.getElementById("cartesJ2").textContent += " ..->" + cartes[1]
}
// Boucles:
// [5, 2, 3] [3, 4]
// [1, 4], [5, 2, 3]