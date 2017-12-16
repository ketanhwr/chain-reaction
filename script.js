var width = 420;
var height = 630;
var gapWidth = width/6;
var gapHeight = height/9;
var turnCount = 0;
var turnCountBackup = 0;
var gameSpeed = 300;
var gameTimer;
var countMatrix = new Array(9);
var colorMatrix = new Array(9);
var undoCount = new Array(9)
var undoColor = new Array(9);
var isGameOver = false;
var counterAnimate = 0;
var gameStarted = false; // tracks if game has begun
var flag = false;
var maxPlayerCount = 2; // number of players in game
var playersEliminated = {red:false,green:false,blue:false,yellow:false};
var playersEliminatedUndo = {red:false,green:false,blue:false,yellow:false}; //backup copy for undo function
var round = 0; //number of turns taken collectively by players

var canvas = document.getElementById("arena");
var button = document.getElementById("undo");
var sound = document.getElementById("sound");
var gameArena = canvas.getContext("2d");
canvas.addEventListener("click", gameLoop);
button.addEventListener("click", undoGame);

initialiseMatrix();
initialise();

function initialise()
{
	isGameOver = false;
	matrixDefault();
	drawArena();
	turnCount = 0;
	turnCountBackup=0;
	gameStarted = false;
	round = 0;
	playersEliminated = {red:false,green:false,blue:false,yellow:false};
	playersEliminatedUndo = {red:false,green:false,blue:false,yellow:false};
	counterAnimate = 0;
	gameTimer = setInterval(updateMatrix, gameSpeed);
}

function initialiseMatrix()
{
	for(var counter = 0; counter < 9; counter++)
	{
		countMatrix[counter] = new Array(6);
		colorMatrix[counter] = new Array(6);
		undoCount[counter] = new Array(6);
		undoColor[counter] = new Array(6);
	}
}

function setNumberOfPlayers()
{
	if (!gameStarted)
	{
		maxPlayerCount = parseInt(document.getElementById("numOfPlayers").value);
	} else {
		 $('#changePlayerError').stop().fadeIn(400).delay(2000).fadeOut(400); //fade out after 2 seconds
	}

}
function matrixDefault()
{
	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 6; j++)
		{
			colorMatrix[i][j] = "";		//No color
			countMatrix[i][j] = 0;		//No value
			undoCount[i][j] = 0;		//No value
			undoColor[i][j] = "";		//No color
		}
	}
}

function drawArena()
{
	gameArena.clearRect(0, 0, width, height);

	if(turnCount === 0)
	{
		if (!playersEliminated['red'])
		{
			gameArena.strokeStyle = "red";
		}
		else
		{
			turnCount++;
			resetTurnCount();
			drawArena();
		}

	}
	else if (turnCount === 1)
	{
		if (!playersEliminated['green'])
		{
			gameArena.strokeStyle = "green";
		}
		else
		{
			turnCount++;
			resetTurnCount();
			drawArena();
		}

	}
	else if (turnCount === 2)
	{
		if (!playersEliminated['blue'])
		{
			gameArena.strokeStyle = "blue";
		}
		else
		{
			turnCount++;
			resetTurnCount();
			drawArena();
		}
	}
	else if (turnCount === 3)
	{
		if (!playersEliminated['yellow'])
		{
			gameArena.strokeStyle = "yellow";
		}
		else
		{
			turnCount++;
			resetTurnCount();
			drawArena();
		}
	}

	for(var counter = 1; counter < 6; counter++)
	{
		gameArena.beginPath();
		gameArena.moveTo(counter*gapWidth, 0);
		gameArena.lineTo(counter*gapWidth, height);
		gameArena.closePath();
		gameArena.stroke();
	}

	for(var counter = 1; counter < 9; counter++)
	{
		gameArena.beginPath();
		gameArena.moveTo(0 , counter*gapHeight);
		gameArena.lineTo(width , counter*gapHeight);
		gameArena.closePath();
		gameArena.stroke();
	}

	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 6; j++)
		{
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

// Next 2 Functions are used to undo board
function restoreTurnCountToBackup()
{
	turnCount = turnCountBackup;
}

function backUpTurnCount()
{
	turnCountBackup = turnCount;
}

function undoGame()
{
	if(round > 0 && flag == false)
	{
		restoreTurnCountToBackup();
		flag = true;
		restoreCopyofPlayersEliminated();
		for(var i = 0; i < 9; i++)
		{
			for(var j = 0; j < 6; j++)
			{
				countMatrix[i][j] = undoCount[i][j];
				colorMatrix[i][j] = undoColor[i][j];
			}
		}

	} else {
		 $('.undoMessage').stop().fadeIn(400).delay(2000).fadeOut(400); //fade out after 2 seconds
	}

}

function takeBackUp()
{
	backUpCopyofPlayersEliminated();

	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 6; j++)
		{
			undoCount[i][j] = countMatrix[i][j];
			undoColor[i][j] = colorMatrix[i][j];
		}
	}
}

function gameLoop(event)
{
	if (event) {
		backUpTurnCount();
		gameStarted = true; // can no longer change number of players
	}

	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	var row = Math.floor(x/gapWidth);
	var column = Math.floor(y/gapHeight);

	if(!isGameOver)
	{
		takeBackUp();
		if(turnCount == 0 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "red"))
		{
			if (!playersEliminated['red'])
			{
				countMatrix[column][row]++;		//Weird graphic coordinate-system
				colorMatrix[column][row] = "red";
				flag = false;
			}

			turnCount++;
			round++;
 		}

		if(turnCount == 1 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "green"))
		{
			if (!playersEliminated['green'] )
			{
				countMatrix[column][row]++;		//Weird graphic coordinate-system
				colorMatrix[column][row] = "green";
				flag = false;
			}

			turnCount++;
			round++;
			resetTurnCount();

		}
		if(turnCount == 2 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "blue"))
		{
			if (!playersEliminated['blue'])
			{
				countMatrix[column][row]++;		//Weird graphic coordinate-system
				colorMatrix[column][row] = "blue";
				flag = false;
			}

			turnCount++;
			round++;
			resetTurnCount();

		}
		if(turnCount == 3 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "yellow"))
		{
			if (!playersEliminated['yellow'])
			{
				countMatrix[column][row]++;		//Weird graphic coordinate-system
				colorMatrix[column][row] = "yellow";
				flag = false;
			}

			turnCount++;
			round++;
			resetTurnCount();
		}
	}
}

function resetTurnCount() {
	if (turnCount === maxPlayerCount)
	{
			turnCount = 0;
	}
}
function checkGameOver()
{
	if(gameOver() == 1 || gameOver() == 2 || gameOver() == 3 || gameOver() == 4)
	{
		isGameOver = true;
		gameOverScreen(gameOver());
		clearInterval(gameTimer);
		setTimeout(initialise, 4000);
	}
}

function populateCornerCells(i, j){
	countMatrix[i][j] -= 2;
	countMatrix[ i == 8 ? i-1 : i+1 ][j]++;
	countMatrix[i][ j==5 ? j-1 : j+1 ]++;
	colorMatrix[ i == 8 ? i-1 : i+1 ][j] = colorMatrix[i][j];
	colorMatrix[i][ j==5 ? j-1 : j+1 ] = colorMatrix[i][j];
	if(countMatrix[i][j] == 0)
		colorMatrix[i][j] = "";
	sound.play();
}

function populateSideHCells(i, j){  // H = Height
	countMatrix[i][j] -= 3;
	countMatrix[i-1][j]++;
	countMatrix[i+1][j]++;
	countMatrix[i][ j==0 ? j+1 : j-1 ]++;
	colorMatrix[i][ j==0 ? j+1 : j-1 ] = colorMatrix[i][j];
	colorMatrix[i-1][j] = colorMatrix[i][j];
	colorMatrix[i+1][j] = colorMatrix[i][j];
	if(countMatrix[i][j] == 0)
		colorMatrix[i][j] = "";
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
	if(countMatrix[i][j] == 0)
		colorMatrix[i][j] = "";
	sound.play();
}

function updateMatrix()
{
	counterAnimate++;
	drawArena();
	var cornerCord = [[0,0], [8,0], [8,5], [0,5]];

	while(notStable()){
		for(var i = 0; i < 4;i++)
			if(countMatrix[cornerCord[i][0]][cornerCord[i][1]] >= 2){ populateCornerCells(cornerCord[i][0], cornerCord[i][1]); break; }

		for(var i = 1; i < 8; i++){
			if(countMatrix[i][0] >= 3){ populateSideHCells(i, 0); break; }
			if(countMatrix[i][5] >= 3){ populateSideHCells(i, 5); break; }
		}

		for(var i = 1; i < 5; i++){
			if(countMatrix[0][i] >= 3){ populateSideWCells(0, i); break; }
			if(countMatrix[8][i] >= 3){ populateSideWCells(8, i); break; }
		}

		for(var i = 1; i < 8; i++){
			for(var j = 1; j < 5; j++){
				if(countMatrix[i][j] >= 4){
					countMatrix[i][j] -= 4;
					countMatrix[i-1][j]++;
					countMatrix[i+1][j]++;
					countMatrix[i][j-1]++;
					countMatrix[i][j+1]++;
					colorMatrix[i-1][j] = colorMatrix[i][j];
					colorMatrix[i+1][j] = colorMatrix[i][j];
					colorMatrix[i][j-1] = colorMatrix[i][j];
					colorMatrix[i][j+1] = colorMatrix[i][j];
					if(countMatrix[i][j] == 0)
						colorMatrix[i][j] = "";
					sound.play();
					break;
				}
			}
		}
		break;
	}
	checkGameOver();
}

function checkGameOver()
{
	if(gameOver() == 1 || gameOver() == 2 || gameOver() == 3 || gameOver() == 4)
	{
		isGameOver = true;
		gameOverScreen(gameOver());
		clearInterval(gameTimer);
		setTimeout(initialise, 4000);
	}
}

function notStable()
{
	var ans = false;
	if(countMatrix[0][0] >= 2 || countMatrix[8][0] >= 2 || countMatrix[8][5] >= 2 || countMatrix[0][5] >= 2)
		ans = true;

	for(var i = 1; i < 8; i++)
		if(countMatrix[i][0] >= 3 || countMatrix[i][5] >= 3)
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

// Next 2 Functions are used to undo elimination of players
function backUpCopyofPlayersEliminated() {
	playersEliminatedUndo = Object.assign({}, playersEliminated);
}

function restoreCopyofPlayersEliminated() {
	playersEliminated = Object.assign({}, playersEliminatedUndo);
}

function gameOver()
{
	var countRed = 0;
	var countGreen = 0;
	var countBlue = 0;
	var countYellow = 0;

	for(var i = 0; i < 9; i++)
	{
		for(var j = 0;j < 6; j++)
		{
			if(colorMatrix[i][j] == "red") countRed++;
			if(colorMatrix[i][j] == "green") countGreen++;
			if(colorMatrix[i][j] == "blue") countBlue++;
			if(colorMatrix[i][j] == "yellow") countYellow++;
		}
	}

	// checks if player has been eliminated
	// if so, they cannot have any more turns
	if(round > maxPlayerCount)
	{
		if (countRed === 0 && !playersEliminated['red'])
		{
			playersEliminated['red'] = true;
		}

		if (countGreen === 0 && !playersEliminated['green'])
		{
			playersEliminated['green'] = true;
		}

		if (countBlue === 0 && !playersEliminated['blue'])
		{
			playersEliminated['blue'] = true;
		}

		if (countYellow === 0 && !playersEliminated['yellow'])
		{
			playersEliminated['yellow'] = true;
		}

		// checks to see if all but one players have been eliminated
		if (countGreen === 0 && countBlue === 0 && countYellow === 0 )
		{
			return 1;
		}

		if (countRed === 0 && countBlue === 0 && countYellow === 0 )
		{
			return 2;
		}

		if (countRed === 0 && countGreen === 0 && countYellow === 0 )
		{
			return 3;
		}

		if (countRed === 0 && countGreen === 0 && countBlue === 0 )
		{
			return 4;
		}
	}
}

function gameOverScreen(player)
{
	if(player == 2)
	{
		gameArena.clearRect(0, 0, width, height);
		gameArena.fillStyle = "black";
		gameArena.fillRect(0, 0, width, height);
		gameArena.fillStyle = "white";
		gameArena.font = "40px Times New Roman";
		gameArena.fillText("Player 2 wins!", width/2 - 150, height/2 - 50);
	}
	else if (player == 1)
	{
		gameArena.clearRect(0, 0, width, height);
		gameArena.fillStyle = "black";
		gameArena.fillRect(0, 0, width, height);
		gameArena.fillStyle = "white";
		gameArena.font = "40px Times New Roman";
		gameArena.fillText("Player 1 wins!", width/2 - 150, height/2 - 50);
	}
	else if (player == 3)
	{
		gameArena.clearRect(0, 0, width, height);
		gameArena.fillStyle = "black";
		gameArena.fillRect(0, 0, width, height);
		gameArena.fillStyle = "white";
		gameArena.font = "40px Times New Roman";
		gameArena.fillText("Player 3 wins!", width/2 - 150, height/2 - 50);
	}
	else if (player == 4)
	{
		gameArena.clearRect(0, 0, width, height);
		gameArena.fillStyle = "black";
		gameArena.fillRect(0, 0, width, height);
		gameArena.fillStyle = "white";
		gameArena.font = "40px Times New Roman";
		gameArena.fillText("Player 4 wins!", width/2 - 150, height/2 - 50);
	}
}

function oneCircle(row, column, color)
{
	gameArena.beginPath();
	gameArena.arc(column*gapWidth + 35, row*gapHeight + 35, 15, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if((row == 0 && column == 0) || (row == 8 && column == 0) || (row == 0 && column == 5) || (row == 8 && column == 5))
	{
		if(counterAnimate%2 == 0)
			gameArena.strokeStyle = "black";
		else
			gameArena.strokeStyle = color;
	}
	else
	{
		gameArena.strokeStyle = "black";
	}
	gameArena.lineWidth = 3;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;
}

function twoCircle(row, column, color)
{
	gameArena.beginPath();
	gameArena.arc(column*gapWidth + 20, row*gapHeight + 35, 15, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if(((row >= 1 && row < 8) && (column == 0 || column == 5)) || ((row == 0 || row == 8) && (column >= 1 && column < 5)))
	{
		if(counterAnimate%2 == 0)
			gameArena.strokeStyle = "black";
		else
			gameArena.strokeStyle = color;
	}
	else
	{
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
	if(((row >= 1 && row < 8) && (column == 0 || column == 5)) || ((row == 0 || row == 8) && (column >= 1 && column < 5)))
	{
		if(counterAnimate%2 == 0)
			gameArena.strokeStyle = "black";
		else
			gameArena.strokeStyle = color;
	}
	else
	{
		gameArena.strokeStyle = "black";
	}
	gameArena.lineWidth = 3;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;
}

function threeCircle(row, column, color)
{
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
