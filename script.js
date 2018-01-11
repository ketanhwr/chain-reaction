var horizontalCells;
var verticalCells;

var width;
var height;
var gapWidth;
var gapHeight;
var ballRadius;
var ballBorderSize;
var turnCount = 0;
var gameSpeed = 300;
var gameTimer;
var countMatrix;
var colorMatrix;
var undoCount;
var undoColor;
var isGameOver = false;
var counterAnimate = 0;
var flag = false;

var canvas = document.getElementById("arena");
var button = document.getElementById("undo");
var startButton = document.getElementById("startGameButton");
var sound = document.getElementById("sound");
var gameArena = canvas.getContext("2d");
var horizontalCellsSlider = document.getElementById("horizontalCells");
var verticalCellsSlider = document.getElementById("verticalCells");


canvas.addEventListener("click", gameLoop);
button.addEventListener("click", undoGame);
startButton.addEventListener("click", startGame);
horizontalCellsSlider.addEventListener("change", updateSliderVals);
verticalCellsSlider.addEventListener("change", updateSliderVals);

startGame();

function startGame(){
	horizontalCells = horizontalCellsSlider.value;
	verticalCells = verticalCellsSlider.value;
	initialiseValues();
	initialiseMatrix();
	initialise();
}

function updateSliderVals(){
	$("#horizontalCellsVal").html(horizontalCellsSlider.value);
	$("#verticalCellsVal").html(verticalCellsSlider.value);
}

function initialise()
{
	document.getElementById("undo").style.visibility = "visible";
	isGameOver = false;
	matrixDefault();
	drawArena();
	turnCount = 0;
	counterAnimate = 0;
	gameTimer = setInterval(updateMatrix, gameSpeed);
}

function initialiseValues(){
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    gapWidth = width / horizontalCells;
    gapHeight = height / verticalCells;
    if(gapWidth < gapHeight) {
        ballRadius = (gapWidth / 4.7);
        ballBorderSize = (gapWidth / 25);
    }
    else {
        ballRadius = (gapHeight/4.7);
        ballBorderSize = (gapHeight / 25);
    }

    countMatrix = new Array(verticalCells);
    colorMatrix = new Array(verticalCells);
    undoCount = new Array(verticalCells);
    undoColor = new Array(verticalCells);
}

function initialiseMatrix()
{
	for(var counter = 0; counter < verticalCells; counter++)
	{
		countMatrix[counter] = new Array(horizontalCells);
		colorMatrix[counter] = new Array(horizontalCells);
		undoCount[counter] = new Array(horizontalCells);
		undoColor[counter] = new Array(horizontalCells);
	}
}

function matrixDefault()
{
	for(var i = 0; i < verticalCells; i++)
	{
		for(var j = 0; j < horizontalCells; j++)
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
	
	if(turnCount % 2 == 0)
		gameArena.strokeStyle = "red";
	else
		gameArena.strokeStyle = "green";

	for(var counter = 1; counter < horizontalCells; counter++)
	{
		gameArena.beginPath();
		gameArena.moveTo(counter*gapWidth, 0);
		gameArena.lineTo(counter*gapWidth, height);
		gameArena.closePath();
		gameArena.stroke();
	}

	for(var counter = 1; counter < verticalCells; counter++)
	{
		gameArena.beginPath();
		gameArena.moveTo(0 , counter*gapHeight);
		gameArena.lineTo(width , counter*gapHeight);
		gameArena.closePath();
		gameArena.stroke();
	}

	for(var i = 0; i < verticalCells; i++)
	{
		for(var j = 0; j < horizontalCells; j++)
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

function undoGame()
{
	if(turnCount > 0 && flag == false)
	{
		flag = true;
		turnCount--;
		for(var i = 0; i < verticalCells; i++)
		{
			for(var j = 0; j < horizontalCells; j++)
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
	for(var i = 0; i < verticalCells; i++)
	{
		for(var j = 0; j < horizontalCells; j++)
		{
			undoCount[i][j] = countMatrix[i][j];
			undoColor[i][j] = colorMatrix[i][j];
		}
	}
}

function gameLoop(event)
{
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	var row = Math.floor(x/gapWidth);
	var column = Math.floor(y/gapHeight);

	if(!isGameOver)
	{
		takeBackUp();
		if(turnCount%2 == 0 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "red"))
		{
			countMatrix[column][row]++;		//Weird graphic coordinate-system
			colorMatrix[column][row] = "red";
			turnCount++;
			flag = false;
		}
		if(turnCount%2 == 1 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "green"))
		{
			countMatrix[column][row]++;		//Weird graphic coordinate-system
			colorMatrix[column][row] = "green";
			turnCount++;
			flag = false;
		}
	}
}

function populateCornerCells(i, j){
	countMatrix[i][j] -= 2;
	countMatrix[ i == (verticalCells - 1) ? i-1 : i+1 ][j]++;
	countMatrix[i][ j== (horizontalCells - 1) ? j-1 : j+1 ]++;
	colorMatrix[ i == (verticalCells - 1) ? i-1 : i+1 ][j] = colorMatrix[i][j];
	colorMatrix[i][ j== (horizontalCells - 1) ? j-1 : j+1 ] = colorMatrix[i][j];
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
	var cornerCord = [
        [0,0],
        [(verticalCells - 1),0],
        [(verticalCells - 1),(horizontalCells - 1)],
        [0,(horizontalCells - 1)]
    ];

	while(notStable()){
		for(var i = 0; i < 4;i++)
			if(countMatrix[cornerCord[i][0]][cornerCord[i][1]] >= 2){ populateCornerCells(cornerCord[i][0], cornerCord[i][1]); break; }

		for(var i = 1; i < (verticalCells - 1); i++){
			if(countMatrix[i][0] >= 3){ populateSideHCells(i, 0); break; }
			if(countMatrix[i][horizontalCells - 1] >= 3){ populateSideHCells(i, (horizontalCells - 1)); break; }
		}

		for(var i = 1; i < (horizontalCells - 1); i++){
			if(countMatrix[0][i] >= 3){ populateSideWCells(0, i); break; }
			if(countMatrix[verticalCells - 1][i] >= 3){ populateSideWCells(verticalCells - 1, i); break; }
		}

		for(var i = 1; i < verticalCells - 1; i++){
			for(var j = 1; j < horizontalCells - 1; j++){
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
	if(gameOver() == 1 || gameOver() == 2)
	{
		isGameOver = true;
		document.getElementById("undo").style.visibility = "hidden";
		drawArena();
		setTimeout(gameOverScreen.bind(null,gameOver()), 2000);
		clearInterval(gameTimer);
		setTimeout(initialise, 6000);
	}
}

function notStable()
{
	var ans = false;
	if(countMatrix[0][0] >= 2
        || countMatrix[verticalCells - 1][0] >= 2
        || countMatrix[verticalCells - 1][horizontalCells - 1] >= 2
        || countMatrix[0][horizontalCells - 1] >= 2)
		ans = true;

	for(var i = 1; i < verticalCells - 1; i++)
		if(countMatrix[i][0] >= 3 || countMatrix[i][horizontalCells - 1] >= 3)
			ans = true;

	for(var i = 1; i < horizontalCells - 1; i++)
		if(countMatrix[0][i] >= 3 || countMatrix[verticalCells - 1][i] >= 3)
			ans = true;

	for(var i = 1; i < verticalCells - 1; i++)
		for(var j = 1; j < verticalCells - 1; j++)
			if(countMatrix[i][j] >= 4)
				ans = true;

	return ans;
}

function gameOver()
{
	var countRed = 0;
	var countGreen = 0;
	for(var i = 0; i < verticalCells; i++)
	{
		for(var j = 0;j < horizontalCells; j++)
		{
			if(colorMatrix[i][j] == "red") countRed++;
			if(colorMatrix[i][j] == "green") countGreen++;
		}
	}
	if(turnCount > 1)
	{
		if(countRed == 0)
		{
			return 2;
		}
		if(countGreen == 0)
		{
			return 1;
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
	else
	{
		gameArena.clearRect(0, 0, width, height);
		gameArena.fillStyle = "black";
		gameArena.fillRect(0, 0, width, height);
		gameArena.fillStyle = "white";
		gameArena.font = "40px Times New Roman";
		gameArena.fillText("Player 1 wins!", width/2 - 150, height/2 - 50);
	}
}

function oneCircle(row, column, color)
{
	gameArena.beginPath();
	gameArena.arc(column*gapWidth + (gapWidth/2), row*gapHeight + (gapHeight/2), ballRadius, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if((row == 0 && column == 0)
        || (row == (verticalCells-1) && column == 0)
        || (row == 0 && column == (horizontalCells-1))
        || (row == (verticalCells-1) && column == (horizontalCells-1)))
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
	gameArena.lineWidth = ballBorderSize;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;
}

function twoCircle(row, column, color)
{
	gameArena.beginPath();
	gameArena.arc(column*gapWidth + (gapWidth/3.5), row*gapHeight + (gapHeight/2), ballRadius, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if(((row >= 1 && row < (verticalCells-1)) && (column == 0 || column == (horizontalCells-1)))
        || ((row == 0 || row == (verticalCells-1)) && (column >= 1 && column < (horizontalCells-1))))
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
	gameArena.lineWidth = ballBorderSize;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;

	gameArena.beginPath();
	gameArena.arc(column*gapWidth + (gapWidth/1.4), row*gapHeight + (gapHeight/2), ballRadius, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if(((row >= 1 && row < (verticalCells-1)) && (column == 0 || column == horizontalCells-1))
        || ((row == 0 || row == verticalCells-1) && (column >= 1 && column < horizontalCells-1)))
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
	gameArena.lineWidth = ballBorderSize;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;
}

function threeCircle(row, column, color)
{
	gameArena.beginPath();
	gameArena.arc(column*gapWidth + (gapWidth/3.5), row*gapHeight + (gapHeight/4.1), ballRadius, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if(counterAnimate%2 == 0)
		gameArena.strokeStyle = "black";
	else
		gameArena.strokeStyle = color;
	gameArena.lineWidth = ballBorderSize;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;

	gameArena.beginPath();
	gameArena.arc(column*gapWidth + (gapWidth/3.5), row*gapHeight + (gapHeight/1.3), ballRadius, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if(counterAnimate%2 == 0)
		gameArena.strokeStyle = "black";
	else
		gameArena.strokeStyle = color;
	gameArena.lineWidth = ballBorderSize;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;

	gameArena.beginPath();
	gameArena.arc(column*gapWidth + (gapWidth/1.4), row*gapHeight + (gapHeight/2), ballRadius, 0, Math.PI*2);
	gameArena.fillStyle = color;
	gameArena.fill();
	if(counterAnimate%2 == 0)
		gameArena.strokeStyle = "black";
	else
		gameArena.strokeStyle = color;
	gameArena.lineWidth = ballBorderSize;
	gameArena.stroke();
	gameArena.closePath();
	gameArena.lineWidth = 1;
}
