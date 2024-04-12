/*******************************************************/
// Diggin' With Dug
// A Minesweeper Type Game
// Written by Miles Baldwin
/*******************************************************/
console.log("%c Diggin' With Dug - A Game", "color: blue;");
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

// Sprite groups for each screen - used for the hding of sprites at different screens
var startSprites;
var gamesprites;
var endSprites;
var instructionSprites;

// Timer varibales
var timeSec = 0;
var timeMin = 0;
var timerInterval;

var screenSelector = "start";
var scoreMessage;
var minesAround = 0;

//Score holds how many tiles were left to be uncovered
var score;
//Score 2 holds time taken
var score2;

//Function loads the images before the game runs
function preload() {
  startImg = loadImage('Assets/start_screen.png');
  instructionsImg = loadImage('Assets/instructions_screen.png');
  endGood = loadImage('Assets/end_screen_good.png');
  endBad = loadImage('Assets/end_screen_bad.png');
  tileImg = loadImage('Assets/tile.png');
  roseImg = loadImage('Assets/rose_tile.png');
  uncovered0 = loadImage('Assets/uncovered0.png');
  uncovered1 = loadImage('Assets/uncovered1.png');
  uncovered2 = loadImage('Assets/uncovered2.png');
  uncovered3 = loadImage('Assets/uncovered3.png');
  uncovered4 = loadImage('Assets/uncovered4.png');
  uncovered5 = loadImage('Assets/uncovered5.png');
  uncovered6 = loadImage('Assets/uncovered6.png');
}

/******************************************************/
// setup()
/******************************************************/
// Sets up the program
function setup() {
    cnv = new Canvas(SCREENWIDTH, SCREENHEIGHT);
    //Creating the groups
    tiles = new Group();
    mines = new Group();
    startSprites = new Group();
    gameSprites = new Group();
    endSprites = new Group();
    instructionSprites = new Group();
    uncovered = new Group();
    //Set up the buttons
    textSize(17);
    createButtons();
}

/******************************************************/
// draw()
/******************************************************/
// Runs 60 times a second
function draw() {
    //Set text to an appropriate size
    textSize(40)
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
    background(startImg);
    
    //If Buttons pressed
    if(startButton.mouse.presses()) { //Start Button Pressed
        screenSelector = "game";
        restart();
    }
    else if(instructionsButton.mouse.presses()) { //Instructions Button Pressed
        screenSelector = "instructions";
    }
}
//Game screen
function gameScreen() {
    var totalTime; //Used for final score
    
    startSprites.visible = false;
    gameSprites.visible = true;
    endSprites.visible = false;
    background("lightgrey");

    // Displaying changing score
    text(timeMin + ":" + timeSec, 100, 60);
    text(uncovered.length + "/ 216", SCREENWIDTH - 200, 60);
    //if all safe tiles are uncovered you win
    if(uncovered.length == SAFETILESNUM) {
        screenSelector = "end";
        //Convert minutes to seconds(X by 60) and add to the seconds to get toal time
        totalTime = (timeMin * 60) + timeSec;
        score = totalTime;
        scoreMessage = "You won in a time of " + timeMin + ":" + timeSec;
    }
}
//End screen
function endScreen() {
    //Deletes tiles
    gameSprites.removeAll();
    startSprites.visible = false;
    gameSprites.visible = false;
    endSprites.visible = true;
    //If player wins and gets a score(score doesn't equal 0) good end screen displayed
    if(score != 0) {
        background(endGood);
    } else {
        background(endBad);
    }
    
    var textW = textWidth(scoreMessage);
    //Display end message
    textSize(40); //Chosen because this creates a nice size for all end messages
    text(scoreMessage, SCREENWIDTH - textW - 10, SCREENHEIGHT/2);
    
    //Button restarts game
    if(restartButton.mouse.presses()) {
        restart();
    }
}
//Instructions screen
function instructionScreen() {
    startSprites.visible = false;
    gameSprites.visible = false;
    instructionSprites.visible = true;
    background(instructionsImg);
    
    //Button to go back to start screen
    if(backButton.mouse.presses()) {
        screenSelector = "start";        
    }
}

//Restarts the game by resetting variables and recreating tiles and mines
function restart() {
    //Reset Timer and score
    timeSec = 0;
    timeMin = 0;
    minesAround = 0;
    score = 0;
    //Create tiles, assign mines and start up timer
    createTileSprites();
    assignMines();
    timerInterval = setInterval(timer, 1000);
    screenSelector = "game";
}

//Creates the buttons that allow for movement between screens
function createButtons() {
    //Start Button - Start Screen
    startButton = new Sprite(SCREENWIDTH/2, (SCREENHEIGHT/6) * 5, BUTTONWIDTH, BUTTONHEIGHT, 's');
    startButton.color = "blue";
    startButton.text = "START";
    startSprites.add(startButton);
    
    //Instructions Button - Start Screen
    instructionsButton = new Sprite(SCREENWIDTH/2, (SCREENHEIGHT/6) * 5 + BUTTONHEIGHT, BUTTONWIDTH-25, BUTTONHEIGHT-25, 's');
    instructionsButton.color = "lightblue";
    instructionsButton.text = "INSTRUCTIONS";
    startSprites.add(instructionsButton);
    
    //Back Button - Instructions Screen
    backButton = new Sprite((SCREENWIDTH/6) * 5, (SCREENHEIGHT/6) * 5 + BUTTONHEIGHT, BUTTONWIDTH-25, BUTTONHEIGHT-25, 's');
    backButton.color = "green";
    backButton.text = "BACK";
    instructionSprites.add(backButton);
    
    //Restart Button - End Screen
    restartButton = new Sprite(SCREENWIDTH/2, (SCREENHEIGHT/4) * 3 + BUTTONHEIGHT, BUTTONWIDTH, BUTTONHEIGHT, 's');
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
        } 
        else if(rowCounter == 16) {
            // Start new row so rowCounter set back to 0
            rowCounter = 0;
            lineCounter += 1;
            //Y spawn move up. X spawn reverts to original
            tileYPos -= TILESIZE;
            tileXPos = 0 + TILESIZE/2;
        }
        //Creating the sprite and assigning to groups
        tile = new Sprite(tileXPos, tileYPos, TILESIZE, TILESIZE, 's');
        tile.addImage("tile", tileImg);
        //Add grid position to the sprite
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
        // Picks a random sprite from the tiles group\
        randTile = tiles[Math.round(random(0, tiles.length-1))];
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
    //Player didn't win so cannot have a score
    score = 0;
    scoreMessage = "You had " + (SAFETILESNUM - uncovered.length) + " tiles left to uncover.";
    clearInterval(timerInterval);
    screenSelector = "end";
}

//If player right clicks to marik a tile
function flagTile(_tile) {
    //If tile is already flagged then the flag is removed
    if(_tile.flagged == true) {
        _tile.flagged = false;
        _tile.addImage(tileImg);
    } else {
        //flag is created to mark a tile
        _tile.flagged = true;
        _tile.addImage(roseImg);
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
    _tile.addImage('Assets/uncovered' + minesAround + ".png");
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
