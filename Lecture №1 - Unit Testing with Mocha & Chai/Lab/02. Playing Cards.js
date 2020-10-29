function Card(faceInput, suitInput) {
    let validCardFaces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let validCardSuits = ['S', 'H', 'D', 'C'];

    let face = isValidFace(faceInput)
    let suit = isValidSuit(suitInput);

    switch (suit) {
        case 'S':
            suit = '\u2660';
            break;
        case 'H':
            suit = '\u2665 ';
            break;
        case 'D':
            suit = '\u2666';
            break;
        case 'C':
            suit = '\u2663';
            break;
    }

    let cardObj = {
        face,
        suit,

        toString() {
            return `${this.face}${this.suit}`;
        }
    }

    function isValidFace(face) {
        if (validCardFaces.includes(face.toUpperCase())) {
            return face;
        } else {
            throw new Error('Card face is invalid!');
        }
    };

    function isValidSuit(suit) {
        if (validCardSuits.includes(suit.toUpperCase())) {
            return suit;
        } else {
            throw new Error('Card suit is invalid!');
        }
    };

    return cardObj;
}

let card = new Card('A', 'S');
console.log(card.toString());

