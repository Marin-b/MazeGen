const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const container = document.querySelector("#mazeContainer");
const cSizeInput = document.querySelector("#cellSize")
const gridSizeContainer = document.querySelector("#gridSize")

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
gridSizeContainer.innerHTML = `${yCell} x ${xCell}`
var speeds = [1, 5, 10, 100]
var solveSpeed = speeds[0];

function updateGlobals()
{
  C_SIZE = Number(cSizeInput.value) || C_SIZE;
  if (C_SIZE < 4) {
    return
  }
  HEIGHT = Math.floor(container.offsetHeight / C_SIZE) * C_SIZE;
  WIDTH = Math.floor(container.offsetWidth / C_SIZE) * C_SIZE;
  xCell = WIDTH / C_SIZE
  yCell = HEIGHT / C_SIZE
  endPos = [xCell - 1, yCell - 1];
  gridSizeContainer.innerHTML = `${yCell} x ${xCell}`
}

function generateMaze() {
  canvas.height = HEIGHT
  canvas.width = WIDTH
  if (theMazeSolver) {
    theMazeSolver.canceled = true;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  theMaze = new Maze
  theMaze.draw(context);
  theMazeSolver = new MazeSolver(theMaze.cells,context, startPos, endPos)
}

function solveMaze() {
  for(let i = 0; i < solveSpeed; i++) {
    theMazeSolver.nextStep()
     if (!theMazeSolver.solving) {
       solveSpeed = speeds[0]
       return
     }
  }
  requestAnimationFrame(solveMaze)
}

function start() {
  if (!theMazeSolver.solving) {
    solveMaze()
  } else {
    solveSpeed = speeds[speeds.indexOf(solveSpeed) + 1]
  }
}

generateMaze();
document.querySelector("#reload").addEventListener('click', generateMaze)
document.querySelector("#start").addEventListener('click', start)

cSizeInput.addEventListener("input", updateGlobals)

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        generateMaze()
    }
});

