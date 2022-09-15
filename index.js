const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const container = document.querySelector("#mazeContainer");
const cSizeInput = document.querySelector("#cellSize")

var theMaze = null;
var theMazeSolver = null


var C_SIZE = 50;
cSizeInput.value = 50
var HEIGHT = Math.floor(container.offsetHeight / C_SIZE) * C_SIZE;
var WIDTH = Math.floor(container.offsetWidth / C_SIZE) * C_SIZE;
canvas.height = HEIGHT
canvas.width = WIDTH
var xCell = WIDTH / C_SIZE
var yCell = HEIGHT / C_SIZE
const startPos = [0, 0];
var endPos = [xCell - 1, yCell - 1];



function updateGlobals()
{
  C_SIZE = Number(cSizeInput.value) || C_SIZE;
  HEIGHT = Math.floor(container.offsetHeight / C_SIZE) * C_SIZE;
  WIDTH = Math.floor(container.offsetWidth / C_SIZE) * C_SIZE;
  canvas.height = HEIGHT
  canvas.width = WIDTH
  xCell = WIDTH / C_SIZE
  yCell = HEIGHT / C_SIZE
  endPos = [xCell - 1, yCell - 1];
}

function generateMaze() {
  updateGlobals();
  if (theMazeSolver) {
    theMazeSolver.canceled = true;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  theMaze = new Maze
  theMaze.draw(context);
  theMazeSolver = new MazeSolver(theMaze.cells,context, startPos, endPos)
}

function solveMaze() {
  theMazeSolver.generateStep()
}


generateMaze();
document.querySelector("#reload").addEventListener('click', generateMaze)
document.querySelector("#solve").addEventListener('click', solveMaze)

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        generateMaze()
    }
});
