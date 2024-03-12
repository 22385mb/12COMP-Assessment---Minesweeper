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
const TILESIZE = 37.5;
// Total number of tiles in the 16 by 16 grid
const TILENUM = 256; 

/******************************************************/
// setup()
/******************************************************/
function setup() {
    console.log("setup: ");
    cnv = new Canvas(SCREENWIDTH, SCREENHEIGHT);
    //Creates the tile sprites
    createSprites();
}

/******************************************************/
// draw()
/******************************************************/
function draw() {
    background("lightgrey");
}

/******************************************************/
// FUNCTIONS
/******************************************************/
function createSprites() {
    //Variables which denote where the sprite should be placed
    var tileXPos = 0 + TILESIZE/2;
    var tileYPos = SCREENHEIGHT - TILESIZE/2;
    // Logs how many tiles are in the current row
    var rowCounter = 0;
    
    //Loop to spawn all tiles
    for(var i=0; i < TILENUM; i++) {
        /*If the row is not filled then the next spawned tile will
        spawn to the right of the previous tile. If the row is filled
        then the next tile will move up and go back to the start 
        posiiton this continues until all 16 rows 
        are filled*/
        if(rowCounter > 0 && rowCounter < 16) {
            tileXPos += TILESIZE;
        } else if(rowCounter == 16) {
            // Start new row so rowCounter set back to 0
            rowCounter = 0;
            //Y spawn move up. X spawn reverts to original
            tileYPos -= TILESIZE;
            tileXPos = 0 + TILESIZE/2;
        }
        // Create a tile sprite
        tile = new Sprite(tileXPos, tileYPos, TILESIZE, TILESIZE, 'n');
        tile.color = "lightgreen";
        // Log that another tile has been added to the row
        rowCounter += 1;
    }
}
