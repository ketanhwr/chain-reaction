var width = 420;
var height = 630;
var gapWidth = width / 6;
var gapHeight = height / 9;
var turnCount = 0;
var gameSpeed = 300;
var gameTimer;
var countMatrix = new Array(9);
var colorMatrix = new Array(9);
var undoCount = new Array(9);
var undoColor = new Array(9);
var isGameOver = false;
var counterAnimate = 0;
var flag = false;
var playerCount = 2;
var players = ["red", "green", "blue", "yellow", "orange", "pink", "aqua", "teal"];
var totalPlayers = 2;
var playerNotOut = [];
var gameStarted = false;

var canvas = document.getElementById("arena");
var button = document.getElementById("undo");
var sound = document.getElementById("sound");
var gameArena = canvas.getContext("2d");


function matrixDefault() {
    for (var i = 0; i < 9; i++)
    {
        for(var j = 0; j < 6; j++)
        {
            colorMatrix[i][j] = "";    //No color
            countMatrix[i][j] = 0;    //No value
            undoCount[i][j] = 0;    //No value
            undoColor[i][j] = "";    //No color
        }
    }
}

function initialise() {
    isGameOver = false;
    matrixDefault();
    drawArena();
    turnCount = 0;
    counterAnimate = 0;
    totalPlayers = 2;
    playerNotOut = [];
    gameStarted = false;
    $("#playersCount").removeAttr("disabled");
    $("#playersOut").text("");
    gameTimer = setInterval(updateMatrix, gameSpeed);
}

function initialiseMatrix() {
    for(var counter = 0; counter < 9; counter++)
    {
        countMatrix[counter] = new Array(6);
        colorMatrix[counter] = new Array(6);
        undoCount[counter] = new Array(6);
        undoColor[counter] = new Array(6);
    }
}

function drawArena() {
    gameArena.clearRect(0, 0, width, height);
    if (turnCount==0) {
        gameArena.strokeStyle = "red";
    }
    else
    {
        gameArena.strokeStyle = playerNotOut[turnCount % playerCount];
    }
    for (var counter = 1; counter < 6; counter++) {
        gameArena.beginPath();
        gameArena.moveTo(counter*gapWidth, 0);
        gameArena.lineTo(counter*gapWidth, height);
        gameArena.closePath();
        gameArena.stroke();
    }

    for (var counter = 1; counter < 9; counter++) {
        gameArena.beginPath();
        gameArena.moveTo(0 , counter*gapHeight);
        gameArena.lineTo(width , counter*gapHeight);
        gameArena.closePath();
        gameArena.stroke();
    }

    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 6; j++) {
            if(countMatrix[i][j] == 0)
                continue;
            if(countMatrix[i][j] == 1)
                oneCircle(i, j, colorMatrix[i][j]);
            else if(countMatrix[i][j] == 2)
                twoCircle(i, j, colorMatrix[i][j]);
            else
                threeCircle(i, j, colorMatrix[i][j]);
        }
    }
}

function undoGame() {
    if(turnCount > 0 && flag == false) {
        flag = true;
        turnCount--;
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 6; j++) {
                countMatrix[i][j] = undoCount[i][j];
                colorMatrix[i][j] = undoColor[i][j];
            }
        }
    } else {
         $(".undoMessage").stop().fadeIn(400).delay(2000).fadeOut(400); //fade out after 2 seconds
    }
}

function takeBackUp() {
    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 6; j++) {
            undoCount[i][j] = countMatrix[i][j];
            undoColor[i][j] = colorMatrix[i][j];
        }
    }
}

function gameLoop(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var row = Math.floor(x/gapWidth);
    var column = Math.floor(y/gapHeight);

    if (!gameStarted) {
        totalPlayers = parseInt($("#playersCount").val());
        playerCount = parseInt($("#playersCount").val());
        $("#playersCount").attr("disabled","true");
        for(var i=0;i<totalPlayers;i++) {
            playerNotOut.push(players[i]);
        }
        gameStarted=true;
    }
    if (!isGameOver) {
        takeBackUp();
        if(colorMatrix[column][row] == "" || colorMatrix[column][row] == playerNotOut[turnCount % playerCount]) {
            countMatrix[column][row]++;    //Weird graphic coordinate-system
            colorMatrix[column][row] = playerNotOut[turnCount % playerCount];
            turnCount++;
            flag = false;
        }
    }
}

function populateCornerCells(i, j) {
    countMatrix[i][j] -= 2;
    countMatrix[ i == 8 ? i-1 : i+1 ][j]++;
    countMatrix[i][ j==5 ? j-1 : j+1 ]++;
    colorMatrix[ i == 8 ? i-1 : i+1 ][j] = colorMatrix[i][j];
    colorMatrix[i][ j==5 ? j-1 : j+1 ] = colorMatrix[i][j];
    if(countMatrix[i][j] == 0) {
        colorMatrix[i][j] = "";
    }
    sound.play();
}

function populateSideHCells(i, j) {  // H = Height
    countMatrix[i][j] -= 3;
    countMatrix[i-1][j]++;
    countMatrix[i+1][j]++;
    countMatrix[i][ j==0 ? j+1 : j-1 ]++;
    colorMatrix[i][ j==0 ? j+1 : j-1 ] = colorMatrix[i][j];
    colorMatrix[i-1][j] = colorMatrix[i][j];
    colorMatrix[i+1][j] = colorMatrix[i][j];
    if(countMatrix[i][j] == 0) {
        colorMatrix[i][j] = "";
    }
    sound.play();
}

function populateSideWCells(i, j) {  // W = Width
    countMatrix[i][j] -= 3;
    countMatrix[ i==0 ? i+1 : i-1 ][j]++;
    countMatrix[i][j-1]++;
    countMatrix[i][j+1]++;
    colorMatrix[ i==0 ? i+1 : i-1 ][j] = colorMatrix[i][j];
    colorMatrix[i][j-1] = colorMatrix[i][j];
    colorMatrix[i][j+1] = colorMatrix[i][j];
    if(countMatrix[i][j] == 0) {
        colorMatrix[i][j] = "";
    }
    sound.play();
}

function updateMatrix() {
    counterAnimate++;
    drawArena();
    var cornerCord = [[0,0], [8,0], [8,5], [0,5]];

    while(notStable()) {
        for(var i = 0; i < 4;i++) {
            if(countMatrix[cornerCord[i][0]][cornerCord[i][1]] >= 2) {
                populateCornerCells(cornerCord[i][0], cornerCord[i][1]);
                break;
            }
        }

        for(var i = 1; i < 8; i++) {
            if(countMatrix[i][0] >= 3) {
                populateSideHCells(i, 0);
                break;
            }
            if(countMatrix[i][5] >= 3) {
                populateSideHCells(i, 5);
                break;
            }
        }

        for(var i = 1; i < 5; i++) {
            if(countMatrix[0][i] >= 3) {
                populateSideWCells(0, i);
                break;
            }
            if(countMatrix[8][i] >= 3) {
                populateSideWCells(8, i);
                break;
            }
        }

        for (var i = 1; i < 8; i++) {
            for (var j = 1; j < 5; j++) {
                if(countMatrix[i][j] >= 4) {
                    countMatrix[i][j] -= 4;
                    countMatrix[i-1][j]++;
                    countMatrix[i+1][j]++;
                    countMatrix[i][j-1]++;
                    countMatrix[i][j+1]++;
                    colorMatrix[i-1][j] = colorMatrix[i][j];
                    colorMatrix[i+1][j] = colorMatrix[i][j];
                    colorMatrix[i][j-1] = colorMatrix[i][j];
                    colorMatrix[i][j+1] = colorMatrix[i][j];
                    if(countMatrix[i][j] == 0) {
                        colorMatrix[i][j] = "";
                    }
                    sound.play();
                    break;
                }
            }
        }
        break;
    }
    checkGameOver();
}

function checkGameOver() {
    if (gameOver()) {
        isGameOver = true;
        gameOverScreen(gameOver());
        clearInterval(gameTimer);
        setTimeout(initialise, 4000);
    }
}



function notStable() {
    var ans = false;
    if (countMatrix[0][0] >= 2 || countMatrix[8][0] >= 2 || countMatrix[8][5] >= 2 || countMatrix[0][5] >= 2)
        ans = true;

    for (var i = 1; i < 8; i++)
        if (countMatrix[i][0] >= 3 || countMatrix[i][5] >= 3)
            ans = true;

    for(var i = 1; i < 5; i++)
        if(countMatrix[0][i] >= 3 || countMatrix[8][i] >= 3)
            ans = true;

    for(var i = 1; i < 8; i++)
        for(var j = 1; j < 8; j++)
            if(countMatrix[i][j] >= 4)
                ans = true;

    return ans;
}

function gameOver() {
    var countColors = new Array(playerCount);
    for (var i=0;i<playerCount;i++) {
        countColors[i]=0;
    }
    for (var i = 0; i < 9; i++) {
        for(var j = 0;j < 6; j++) {
            if(colorMatrix[i][j]) {
                countColors[playerNotOut.indexOf(colorMatrix[i][j])]++;
            }
        }
    }
    if (turnCount > (playerCount-1))
    {
        var playersOut = "";
        var loopLength=playerCount;
        for (var i=0;i<loopLength;i++) {
            if (countColors[i]==0) {
                playersOut += players[i]+" ";
                playerCount--;
                turnCount++;
                playerNotOut = playerNotOut.filter(item => item !== players[i]);
            }
        }
        if (playerCount<2) {
            return playerNotOut[0];
        }
        else {
            if (playersOut) {
                if($("#playersOut").text()!==(playersOut)) {
                    $("#playersOut").text(playersOut + ":: Out!!!");
                }
            }
        }
    }
}

function gameOverScreen(player) {
    gameArena.clearRect(0, 0, width, height);
    gameArena.fillStyle = "black";
    gameArena.fillRect(0, 0, width, height);
    gameArena.fillStyle = "white";
    gameArena.font = "40px Times New Roman";
    gameArena.fillText("Player "+player+" wins!", width/2 - 150, height/2 - 50);
}

function oneCircle(row, column, color) {
    gameArena.beginPath();
    gameArena.arc(column*gapWidth + 35, row*gapHeight + 35, 15, 0, Math.PI*2);
    gameArena.fillStyle = color;
    gameArena.fill();
    if((row == 0 && column == 0) || (row == 8 && column == 0) || (row == 0 && column == 5) || (row == 8 && column == 5)) {
        if(counterAnimate%2 == 0)
            gameArena.strokeStyle = "black";
        else
            gameArena.strokeStyle = color;
    }
    else {
        gameArena.strokeStyle = "black";
    }
    gameArena.lineWidth = 3;
    gameArena.stroke();
    gameArena.closePath();
    gameArena.lineWidth = 1;
}

function twoCircle(row, column, color) {
    gameArena.beginPath();
    gameArena.arc(column*gapWidth + 20, row*gapHeight + 35, 15, 0, Math.PI*2);
    gameArena.fillStyle = color;
    gameArena.fill();
    if(((row >= 1 && row < 8) && (column == 0 || column == 5)) || ((row == 0 || row == 8) && (column >= 1 && column < 5))) {
        if(counterAnimate%2 == 0)
            gameArena.strokeStyle = "black";
        else
            gameArena.strokeStyle = color;
    }
    else {
        gameArena.strokeStyle = "black";
    }
    gameArena.lineWidth = 3;
    gameArena.stroke();
    gameArena.closePath();
    gameArena.lineWidth = 1;

    gameArena.beginPath();
    gameArena.arc(column*gapWidth + 50, row*gapHeight + 35, 15, 0, Math.PI*2);
    gameArena.fillStyle = color;
    gameArena.fill();
    if(((row >= 1 && row < 8) && (column == 0 || column == 5)) || ((row == 0 || row == 8) && (column >= 1 && column < 5))) {
        if(counterAnimate%2 == 0)
            gameArena.strokeStyle = "black";
        else
            gameArena.strokeStyle = color;
    }
    else {
        gameArena.strokeStyle = "black";
    }
    gameArena.lineWidth = 3;
    gameArena.stroke();
    gameArena.closePath();
    gameArena.lineWidth = 1;
}

function threeCircle(row, column, color) {
    gameArena.beginPath();
    gameArena.arc(column*gapWidth + 20, row*gapHeight + 17, 15, 0, Math.PI*2);
    gameArena.fillStyle = color;
    gameArena.fill();
    if(counterAnimate%2 == 0)
        gameArena.strokeStyle = "black";
    else
        gameArena.strokeStyle = color;
    gameArena.lineWidth = 3;
    gameArena.stroke();
    gameArena.closePath();
    gameArena.lineWidth = 1;

    gameArena.beginPath();
    gameArena.arc(column*gapWidth + 20, row*gapHeight + 53, 15, 0, Math.PI*2);
    gameArena.fillStyle = color;
    gameArena.fill();
    if(counterAnimate%2 == 0)
        gameArena.strokeStyle = "black";
    else
        gameArena.strokeStyle = color;
    gameArena.lineWidth = 3;
    gameArena.stroke();
    gameArena.closePath();
    gameArena.lineWidth = 1;

    gameArena.beginPath();
    gameArena.arc(column*gapWidth + 50, row*gapHeight + 35, 15, 0, Math.PI*2);
    gameArena.fillStyle = color;
    gameArena.fill();
    if(counterAnimate%2 == 0)
        gameArena.strokeStyle = "black";
    else
        gameArena.strokeStyle = color;
    gameArena.lineWidth = 3;
    gameArena.stroke();
    gameArena.closePath();
    gameArena.lineWidth = 1;
}

canvas.addEventListener("click", gameLoop);
button.addEventListener("click", undoGame);

initialiseMatrix();
initialise();