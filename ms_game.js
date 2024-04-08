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
const BUTTONHEIGHT = 75;
const BUTTONWIDTH = 175;
// Total number of tiles in the 16 by 16 grid
const TILENUM = 256;
//Number of "safe" tiles
const SAFETILESNUM = 216;
//Number of Mines
const MINESNUM = 40;

// Groups
var tiles; //Group for tiles
var uncovered; //Group for safe tiles which have been clicked
var mines; //Group for the mines
var flags; //G5roup for markers player creates with right click

// Sprite groups for each screen
var startSprites;
var gamesprites;
var endSprites;
var instructionSprites;

var timeSec = 0;
var timeMin = 0;
var timerInterval;
var screenSelector = "start";
var scoreMessage;
var minesAround = 0;
/*Score holds an array that logs the specifics of what the player 
achived. It holds if they lost and the number of tile left and if 
they won and in what time. It then combines this into one variable
that will be passed to a databse and handled there*/
var score = [[], []];

/******************************************************/
// setup()
/******************************************************/
// Sets up the program
function setup() {
    console.log("setup: ");
    cnv = new Canvas(SCREENWIDTH, SCREENHEIGHT);
    //Creating the groups
    tiles = new Group();
    mines = new Group();
    startSprites = new Group();
    gameSprites = new Group();
    endSprites = new Group();
    instructionSprites = new Group();
    uncovered = new Group();
    flags = new Group();
    
    //Set up the buttons for functionality
    createButtons();
    textSize(40);
}

/******************************************************/
// draw()
/******************************************************/
// Runs 60 times a second
function draw() {
    //Game screen logic
    if(screenSelector == "start") {
        startScreen();
    } 
    else if(screenSelector == "game") {
        gameScreen();
        
    }
    else if(screenSelector == "end") {
        endScreen();
    }
    else if(screenSelector == "instructions") {
        instructionScreen();
    } else {
        text("SOMETHING WENT WRONG!", 10, 50);
        text("Please Reload or contact help", 10, 100);
    }
}

/******************************************************/
// FUNCTIONS
/******************************************************/
// GAME SCREENS
//Start Screen
function startScreen() {
    // Top of every screen function controls which sprites dispaly
    startSprites.visible = true;
    gameSprites.visible = false;
    endSprites.visible = false;
    instructionSprites.visible = false;
    background("#41980a");
    
    //If Buttons pressed
    if(startButton.mouse.presses()) {
        screenSelector = "game";
        restart();
    }
    else if(instructionsButton.mouse.presses()) {
        screenSelector = "instructions";
    }
}
//Game screen
function gameScreen() {
    var totalTime;
    startSprites.visible = false;
    gameSprites.visible = true;
    endSprites.visible = false;
    background("lightgrey");

    // Displaying changing score
    text(timeMin + ":" + timeSec, 100, 60);
    text(uncovered.length + "/ 216", SCREENHEIGHT - 300, 60);
    //if all safe tiles are uncovered you win
    if(uncovered.length == SAFETILESNUM) {
        screenSelector = "end";
        //Convert minutes to seconds(X by 60) and add to the seconds to get toal time
        totalTime = (timeMin * 60) + timeSec;
        score = [[false, (SAFETILESNUM - uncovered.length)], [true, totalTime]];
        scoreMessage = "You won in a time of " + timeMin + ":" + timeSec;
    }
}

//End screen
function endScreen() {
    gameSprites.removeAll();
    flags.removeAll();
    startSprites.visible = false;
    gameSprites.visible = false;
    endSprites.visible = true;
    background("tomato");
    
    //Display end message
    text(scoreMessage, 0, SCREENHEIGHT/2);
    
    //Buytton retsarts game
    if(restartButton.mouse.presses()) {
        restart();
    }
}
//Instructions screen
function instructionScreen() {
    startSprites.visible = false;
    gameSprites.visible = false;
    instructionSprites.visible = true;
    background("lightblue");
    //Button to go back
    if(backButton.mouse.presses()) {
        screenSelector = "start";        
    }
}

//Restart the game by resetting variables and recreating tiles and mines
function restart() {
    timeSec = 0;
    timeMin = 0;
    minesAround = 0;
    createTileSprites();
    assignMines();
    timerInterval = setInterval(timer, 1000);
    screenSelector = "game";
}

// Creates the buttons that allow for movement between screens
function createButtons() {
    startButton = new Sprite(SCREENWIDTH/2, (SCREENHEIGHT/3) * 2, BUTTONWIDTH, BUTTONHEIGHT, 's');
    startButton.color = "blue";
    startButton.text = "START";
    startSprites.add(startButton);
    
    instructionsButton = new Sprite(SCREENWIDTH/2, (SCREENHEIGHT/3) * 2 + BUTTONHEIGHT, BUTTONWIDTH-25, BUTTONHEIGHT-25, 's');
    instructionsButton.color = "lightblue";
    instructionsButton.text = "INSTRUCTIONS";
    startSprites.add(instructionsButton);
    
    backButton = new Sprite((SCREENWIDTH/6) * 5, (SCREENHEIGHT/6) * 5 + BUTTONHEIGHT, BUTTONWIDTH-25, BUTTONHEIGHT-25, 's');
    backButton.color = "green";
    backButton.text = "BACK";
    instructionSprites.add(backButton);
    
    restartButton = new Sprite(SCREENWIDTH/2, (SCREENHEIGHT/3) * 2 + BUTTONHEIGHT, BUTTONWIDTH-25, BUTTONHEIGHT-25, 's');
    restartButton.color = "red";
    restartButton.text = "RESTART";
    endSprites.add(restartButton);
}


// Creates the tiles
function createTileSprites() {
    //Variables which denote where the sprite should be placed
    var tileXPos = 0 + TILESIZE/2;
    var tileYPos = SCREENHEIGHT - TILESIZE/2;
    // Logs the grid position of the tile
    var rowCounter = 0;
    var lineCounter = 0;
    
    //Loop to spawn all tiles
    for(var i = 0; i < TILENUM; i++) {
        /*If the row is not filled then the next spawned tile will
        spawn to the right of the previous tile. If the row is filled
        then the next tile will move up and go back to the start 
        posiiton this continues until all 16 rows 
        are filled*/
        if(rowCounter > 0 && rowCounter < 16) {//16 is the number of tiles that fit in a row
            tileXPos += TILESIZE;
        } else if(rowCounter == 16) {
            // Start new row so rowCounter set back to 0
            rowCounter = 0;
            lineCounter += 1;
            //Y spawn move up. X spawn reverts to original
            tileYPos -= TILESIZE;
            tileXPos = 0 + TILESIZE/2;
        }
        //Creating the sprite and assigning to groups
        tile = new Sprite(tileXPos, tileYPos, TILESIZE, TILESIZE, 's');
        tile.color = "lightgreen";
        tile.columnNum = rowCounter;
        tile.rowNum = lineCounter;
        tile.flagged = false;
        tiles.add(tile);
        gameSprites.add(tile);
        // Log that another tile has been added to the row
        rowCounter += 1;
    }
}

// Assign some of the tiles to be mines
function assignMines() {
    var randTile;
    // Loops 40 times to create 40 marked tiles
    for (var i = 0; i < MINESNUM; i++) {
        // Picks a random sprite from the tiles group
        randTile = tiles[Math.round(random(0, tiles.length))];
        // adds random tile to mines and removes from tiles
        mines.add(randTile);
        tiles.remove(randTile);
    }
}

//Built in function that runs when the mouse is pressed
function mousePressed() {
    //only runs code if screen is game to prevent unnecessary running.
    if(screenSelector == "game") {
        //If left click the tile is "uncovered"
        if(mouseButton == LEFT) {
            checkTileClicked();
        }
        //If right the tile is marked
        else if(mouseButton == RIGHT) {
            //Checks mines to see if they were right clicked
            for(var i = 0; i < mines.length; i++) {
                if(mines[i].mouse.hovering()) {
                    flagTile(mines[i]);
                    break;
                } 
            }
            //checks tiles to see if they were right clicked
            for(var j = 0; j < tiles.length; j++) {
                if(tiles[j].mouse.hovering()) {
                    flagTile(tiles[j]);
                    break;
                }       
            }
        }
    }
}

// Checks if and what tile has been clicked
function checkTileClicked() {
    //This vraible is used to prevent loop running if a tile has already been found
    var clickedTileFound = false;
    //Check if mine clicked - cannot be clicked if it has been flagged
    for(var i = 0; i < mines.length; i++) {
        if(!mines[i].flagged) {
            if(mines[i].mouse.presses()) {
                //ends game
                mineClicked();
            }
        }
    }
    //If the tile clicked wasn't a mine this section is run
    if(!clickedTileFound) {
        // Goes through each tile and checks if the mouse clicks it
        for(var j = 0; j < tiles.length; j++) {
            if(!tiles[j].flagged) {
                if(tiles[j].mouse.presses()) {
                    // Depending which tile the mouse is over it gets "uncovered"
                    tiles[j].color = "brown";
                    //And the mines around it are checked and then displayed
                    checkMinesAround(tiles[j]);
                    minesAround = 0;
                    //adds the tile to a new group and removes it from the old
                    uncovered.add(tiles[j]);
                    tiles.remove(tiles[j]);
                    break;
                }
            }
        }
    }
}

// What happens if a mine is clicked
function mineClicked() {
    clickedTileFound = true;
    totalTime = (timeMin * 60) + timeSec;
    score = [[true, (SAFETILESNUM - uncovered.length)], [false, totalTime]];
    scoreMessage = "You had " + score[0][1] + " tiles left to uncover.";
    clearInterval(timerInterval);
    screenSelector = "end";
}

//If player right clicks to marik a tile
function flagTile(_tile) {
    //If tile is already flagged then the flag is removed
    if(_tile.flagged == true) {
        _tile.flagged = false;
        for(var i = 0; i < flags.length; i++) {
            if(flags[i].x == _tile.x && flags[i].y == _tile.y) {
                flags[i].remove();
                break;
            }
        }
    } else {
        //flag is created to mark a tile
        flag = new Sprite(_tile.x, _tile.y, TILESIZE-20, TILESIZE-20, 's');
        flags.add(flag);
        _tile.flagged = true;
    }
}

/*When the player clicks on a  tile, that tile is passed into checkMinesAround(_tile)
The function then goes through each mine in the mine group
For each mine it takes the current mine being looked at, mines[i] and passes it into
the function checkIfMineAdjacent. It also passes in the tile that was clicked and 
where to look for the mine*/
function checkMinesAround(_tile) {
    for(var i = 0; i < mines.length; i++) {
        checkIfMineAdjacent(mines[i], _tile, 1, 0);
        checkIfMineAdjacent(mines[i], _tile, 1, -1);
        checkIfMineAdjacent(mines[i], _tile, 0, -1);
        checkIfMineAdjacent(mines[i], _tile, -1, -1);
        checkIfMineAdjacent(mines[i], _tile, -1, 0);
        checkIfMineAdjacent(mines[i], _tile, -1, 1);
        checkIfMineAdjacent(mines[i], _tile, 0, 1);
        checkIfMineAdjacent(mines[i], _tile, 1, 1);
    }
    //after going through all the mines the number of mines around the tile is displayed
    _tile.text = minesAround;
}

//This function checks if a mine is at a speciifc location from a specific tile
/*_mine is the mine being looked at, _tile is the tile that it is being checked in relation too
_addx is the distnace on the x axis from the tile that we are checking if the mine is
-yadd is the same but for the y axis.*/
function checkIfMineAdjacent(_mine, _tile, _addX, _addY) {
    if(_mine.columnNum == _tile.columnNum + _addX && _mine.rowNum == _tile.rowNum + _addY) {
        minesAround += 1;
    }
}

// function which runs every second and controls the insturctions for the timer of the game
function timer() {
    timeSec += 1;
    if(timeSec == 60) {
        timeMin += 1;
        timeSec = 0;
    }
}
