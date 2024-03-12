/*******************************************************/
// Mine Sweeper Type Game
// Written by Miles Baldwin
/*******************************************************/
console.log("%c Mine Sweeper Type Game", "color: blue;");

/******************************************************/
// VARIABLES AND CONSTANTS
/******************************************************/
const SCREENWIDTH = 600;
const SCREENHEIGHT = 700;
const BLOCKSIZE = 37.5;

/******************************************************/
// setup()
/******************************************************/
function setup() {
    console.log("setup: ");
    cnv = new Canvas(SCREENWIDTH, SCREENHEIGHT);
}

/******************************************************/
// draw()
/******************************************************/
function draw() {
    background("lightgrey");
    createSprites();
}

/******************************************************/
// FUNCTIONS
/******************************************************/
function createSprites() {
    block = new Sprite(0 + BLOCKSIZE/2, SCREENHEIGHT - BLOCKSIZE/2, BLOCKSIZE, BLOCKSIZE, 'n');
    block.color = "lightgreen";
}

