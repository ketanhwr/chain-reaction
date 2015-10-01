var width = 420;
var height = 630;
var gapWidth = width/6;
var gapHeight = height/9;
var turnCount = 0;

var canvas = document.getElementById("arena");
var gameArena = canvas.getContext("2d");

canvas.addEventListener("click", test);

var countMatrix = new Array(9);
var colorMatrix = new Array(9);

initialiseMatrix();
drawArena();

function initialiseMatrix()
{
	for(var counter = 0; counter < 9; counter++)
	{
		countMatrix[counter] = new Array(6);
	}

	for(var counter = 0; counter < 9; counter++)
	{
		colorMatrix[counter] = new Array(6);
	}
	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 6; j++)
		{
			colorMatrix[i][j] = "";		//No color
			countMatrix[i][j] = 0;		//No value
		}
	}
}

function drawArena()
{
	gameArena.clearRect(0, 0, width, height);
	gameArena.font = "35px Times New Roman";

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
			gameArena.fillStyle = colorMatrix[i][j];
			gameArena.fillText(countMatrix[i][j], j*gapWidth + 25, i*gapHeight + 45);
		}
	}
}

function test(event)
{
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	
	var row = Math.floor(x/gapWidth);
	var column = Math.floor(y/gapHeight);
	
	if(turnCount%2 == 0 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "red"))
	{
		countMatrix[column][row]++;		//Weird graphic coordinate-system
		colorMatrix[column][row] = "red";
		turnCount++;
	}
	if(turnCount%2 == 1 && (colorMatrix[column][row] == "" || colorMatrix[column][row] == "green"))
	{
		countMatrix[column][row]++;		//Weird graphic coordinate-system
		colorMatrix[column][row] = "green";
		turnCount++;
	}
	drawArena();
}