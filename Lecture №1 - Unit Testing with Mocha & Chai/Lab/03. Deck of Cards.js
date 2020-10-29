function printDeckOfCards(cards) {

    let cardDeck = [];
    let isValidDeck = true;
    let invalidCard = '';
    
    cards.forEach(card => {
        let cardTokens = card.split('');
        let suitInput = cardTokens.pop();
        let faceInput = cardTokens.join('');
        let newCard = createCard(faceInput, suitInput);
        if (newCard.face && newCard.suit) {
            cardDeck.push(newCard.toString());
        }
    });

    function createCard(faceInput, suitInput) {
        let validCardFaces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let validCardSuits = ['S', 'H', 'D', 'C'];

        let face = isValidFace(faceInput, suitInput)
        let suit = isValidSuit(faceInput, suitInput);

        switch (suit) {
            case 'S':
                suit = '\u2660';
                break;
            case 'H':
                suit = '\u2665';
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

        function isValidFace(face, suit) {
            if (validCardFaces.includes(face.toUpperCase())) {
                return face;
            } else {
                invalidCard = face + suit;
                isValidDeck = false;
            }
        };

        function isValidSuit(face, suit) {
            if (validCardSuits.includes(suit.toUpperCase())) {
                return suit;
            } else {
                invalidCard = face + suit;
                isValidDeck = false;
            }
        };

        return cardObj;
    }
    
    if (isValidDeck) {
        console.log(cardDeck.join(' '));
    } else {
        console.log(`Invalid card: ${invalidCard}`);
    }
}  

printDeckOfCards(['AS', '10D', 'KH', '2C']);
printDeckOfCards(['5S', '3D', 'QD', '1C']);