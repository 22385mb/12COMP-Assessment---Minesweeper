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
const MINESNUM = 40;

var tiles;
var uncovered;
var mines;
var uncoveredTiles = 0;

/******************************************************/
// setup()
/******************************************************/
function setup() {
    console.log("setup: ");
    cnv = new Canvas(SCREENWIDTH, SCREENHEIGHT);
    tiles = new Group();
    mines = new Group();
    uncovered = new Group();
    createSprites();
    assignMines();
}

/******************************************************/
// draw()
/******************************************************/
function draw() {
    background("lightgrey");
    checkTileClicked();
    text(uncovered.length + "/ 216", 500, 30);
    //if all safe tiles are uncovered you win
    if(uncovered.length == 216) {
        console.log("You win!");
    }

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
    for(var i = 0; i < TILENUM; i++) {
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

        tile = new Sprite(tileXPos, tileYPos, TILESIZE, TILESIZE, 's');
        tile.color = "lightgreen";
        tiles.add(tile);
        // Log that another tile has been added to the row
        rowCounter += 1;
    }
}

function assignMines() {
    var randNum;
    // Loops 40 times to create 40 marked tiles
    for (var i = 0; i < MINESNUM; i++) {
        // Picks a random sprite from the tiles group
        randTile = tiles[Math.round(random(0, tiles.length - 1))];
        // adds random tile to mines and removes from tiles
        mines.add(randTile);
        tiles.remove(randTile);
        mines.color = "red";
    }
}

function checkTileClicked() {
    //This vraible is used to prevent loop running if a tile has already been found
    var clickedTileFound = false;
    
    if(mouseIsPressed == true) {
        //checks if the mosue is over a tile in the mines group
        if(mines.mouse.hovering()) {
            console.log("You died!");
            clickedTileFound = true;
        }
        if(!clickedTileFound) {
            // Goes through each tile and checks if the mouse is over it
            for(var i = 0; i < tiles.length; i++) {
                if(tiles[i].mouse.hovering()) {
                    // Depending which tile the mouse is over it gets "uncovered"
                    tiles[i].color = "brown";
                    //adds the tile to a new group and removes it from the old
                    uncovered.add(tiles[i]);
                    tiles.remove(tiles[i]);
                    break;
                }
            }
        }
    }
}

