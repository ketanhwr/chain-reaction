var width = 420;
var height = 630;

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
			colorMatrix[i][j] = 'Z';	//No color
			countMatrix[i][j] = 0;		//No value
		}
	}
}

function drawArena()
{
	var gapWidth = width/6;
	for(var counter = 1; counter < 6; counter++)
	{
		gameArena.beginPath();
		gameArena.moveTo(counter*gapWidth, 0);
		gameArena.lineTo(counter*gapWidth, height);
		gameArena.closePath();
		gameArena.stroke();
	}
	var gapHeight = height/9;
	for(var counter = 1; counter < 9; counter++)
	{
		gameArena.beginPath();
		gameArena.moveTo(0 , counter*gapHeight);
		gameArena.lineTo(width , counter*gapHeight);
		gameArena.closePath();
		gameArena.stroke();
	}
}

function test(event)
{
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	alert("X: " + x + " Y: " + y);
}