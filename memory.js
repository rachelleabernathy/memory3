
const DOWN = 'down';
const UP = 'up';
let startingX = 100;
let startingY = 100;
let cards = [];
const gameState = {
    totalPairs: 8,
    flippedCards: [],
    numMatched: 0,
    attempts: 0,
    waiting: false,
};

let cardfaceArray = [];
let cardBack;
function preload() {
    cardBack = loadImage('images/cardback.png');
    cardfaceArray = [
        loadImage('images/1.png'),
        loadImage('images/2.png'),
        loadImage('images/3.png'),
        loadImage('images/4.png'),
        loadImage('images/5.png'),
        loadImage('images/6.png'),
        loadImage('images/7.png'),
        loadImage('images/8.png'),
    ]
}

function setup() {
    createCanvas(800, 700);
    let selectedFaces = [];
    for (let z = 0; z < 8; z++) {
        const randomIdx = floor(random(cardfaceArray.length));
        const face = cardfaceArray[randomIdx];
        selectedFaces.push(face);
        selectedFaces.push(face);
        //remove the used cardface so it doesn't get radomly selected again
        cardfaceArray.splice(randomIdx, 1);
    }
    selectedFaces = shuffleArray(selectedFaces);
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++){
            const faceImage = selectedFaces.pop();
            cards.push(new Card(startingX, startingY, faceImage));
            //this is the space between the cards
            startingX += 120;
        } 
        startingY += 150
        startingX = 100;
    }
    
}

function draw () {
    background('#3d0f2b');
    if (gameState.numMatched === gameState.totalPairs) {
        fill('#daa520');
        textSize(50);
        //play around with this to get the placement correct
        text('You Win!', 600, 110);
        noLoop();
    }
    for (let k = 0; k < cards.length; k++) {
        if(!cards[k].isMatch) {
            cards[k].face = DOWN;
        }
        cards[k].show();
    }
    noLoop();
    gameState.flippedCards.length = 0;
    gameState.waiting = false;
    fill('#daa520');
    textSize(36);
    //again play with the placement of this text
    text('attempts' + gameState.attempts, 610, 500);
    text('matches' + gameState.numMatched, 610, 450);
}

function mousePressed () {
    if (gameState.waiting) {
        return;
    }
    for (let k = 0; k < cards.length; k++) {
        //first check flipped cards length, and then we can trigger the flip
        if (gameState.flippedCards.length < 2 && cards[k].didHit(mouseX, mouseY)) {
            console.log('flipped', cards[k]);
            gameState.flippedCards.push(cards[k]);
        }
    }
    if (gameState.flippedCards.length === 2) {
        gameState.attempts++;
        if (gameState.flippedCards[0].cardFaceImg === gameState.flippedCards[1].cardFaceImg) {
            //mark cards as matched so they don't flip back
            gameState.flippedCards[0].isMatch = true;
            gameState.flippedCards[1].isMatch = true;
            //empty the flipped cards array 
            gameState.flippedCards.length = 0;
            //increment the score
            gameState.numMatched++;
            loop();
        } else {
            gameState.waiting = true;
            const loopTimeout = window.setTimeout(() => {
                loop();
                window.clearTimeout(loopTimeout);
            }, 1000)
        }
    }
}

class Card {
    constructor (x, y, cardFaceImg) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.face = DOWN;
        this.cardFaceImg = cardFaceImg;
        this.isMatch = false;
        this.show();
    }
    show () {
        if (this.face === UP || this.isMatch) {
            fill('white');
            rect(this.x, this.y, this.width, this.height, 10);
            //remember you might need to adjust the size of the image
            image(this.cardFaceImg, this.x, this.y, 100, 100);
        } else {
            fill('lightyellow');
            noStroke();
            rect(this.x, this.y, this.width, this.height, 10);
            //under image, after this.y you may need to add a width and height if images are not the right size
            image(cardBack, this.x, this.y, 100, 100);
        }
        
    }
    didHit (mouseX, mouseY) {
        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
                this.flip();
                return true;
            } else {
                return false;
            }

    }
    flip () {
        if (this.face === DOWN) {
            this.face = UP;
        } else {
            this.face = DOWN;
        }
        this.show();
    }
}

function shuffleArray (array) {
    let counter = array.length;
    while (counter > 0) {
        //pick random index
        const idx = Math.floor(Math.random() * counter);
        //decrease coutner by 1 (decrement)
        counter--;
        //swap the last element with it
        const temp = array[counter];
        array[counter] = array[idx];
        array[idx] = temp;
    }
    return array;
}