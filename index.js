const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const HEIGHT = 1000;
const WIDTH = 1600;
const C_SIZE = 20;

canvas.height = HEIGHT
canvas.width = WIDTH

const xCell = WIDTH / C_SIZE
const yCell = HEIGHT / C_SIZE
const startPos = [0, 0];
const endPos = [xCell - 1, yCell - 1];
let nCell = 0;


class Maze {
  constructor() {
    this.cells = [];
    this.visited = [];
    this.backtrack = [];
    this.createMazeArray();
    this.generateMaze();
  }

  createMazeArray = () => {
    for(let i = 0; i < yCell; i++){
      this.cells.push([]);
      this.visited.push([]);
      for(let j = 0; j < xCell; j++){
        this.cells[i].push({
          left: false,
          right: false,
          top: false,
          bottom: false
        });
        this.visited[i].push(false)
        nCell++;
      }
    }
  }

  breakWalls = (x, y, direction) => {
    if (direction == "left"){
      this.cells[y][x].left = true;
      this.cells[y][x - 1].right = true;
      return [x - 1, y]
    }
    else if (direction == "right"){
      this.cells[y][x].right = true;
      this.cells[y][x + 1].left = true;
      return [x + 1, y];
    }
    else if (direction == "top"){
      this.cells[y][x].top = true;
      this.cells[y - 1][x].bottom = true;
      return [x, y - 1];
    }
    else if (direction == "bottom"){
      this.cells[y][x].bottom = true;
      this.cells[y + 1][x].top = true;
      return [x, y + 1];
    }
    return [undefined, undefined];
  }

  getPossibleDirection = (x, y) => {
    let ret = ["left", "right", "bottom", "top"];

    if (x == 0 || this.visited[y][x - 1]){
      ret = ret.filter((el) => el != "left")
    }
    if (x == xCell - 1 || this.visited[y][x + 1]){
      ret = ret.filter((el) => el != "right")
    }
    if (y == 0 || this.visited[y - 1][x]){
      ret = ret.filter((el) => el != "top")
    }
    if (y == yCell - 1 || this.visited[y + 1][x]){
      ret = ret.filter((el) => el != "bottom")
    }
    return ret;
  }

  backTrack = () => {
    let i = this.backtrack.length - 1;
    while(this.getPossibleDirection(this.backtrack[i][0], this.backtrack[i][1]).length == 0 && i > 0){
      i -= 1;
    }
    return this.backtrack[i];
  }

  generateMaze = () => {
    let x = startPos[0];
    let y = startPos[1];
    this.cells[y][x].left = true;
    this.cells[endPos[1]][endPos[0]].right = true;
    while(this.backtrack.length != nCell){
      const pDirection = this.getPossibleDirection(x, y);
      if (pDirection.length != 0){
        const dir = pDirection[Math.floor(Math.random() * pDirection.length)];
        [x, y] = this.breakWalls(x, y, dir)
        this.visited[y][x] = true;
        this.backtrack.push([x, y]);
      }
      else
      {
        [x, y] = this.backTrack();
      }
    }
  }

  draw = (ctx) => {
    ctx.beginPath();
    let y = 0;
    this.cells.forEach((row) => {
      let x = 0;
      row.forEach((cell) => {
        if (!cell.left){
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + C_SIZE);
        }
        if (!cell.right){
          ctx.moveTo(x + C_SIZE, y);
          ctx.lineTo(x + C_SIZE, y + C_SIZE);
        }
        if (!cell.top){
          ctx.moveTo(x, y);
          ctx.lineTo(x + C_SIZE, y);
        }
        if (!cell.bottom){
          ctx.moveTo(x, y + C_SIZE);
          ctx.lineTo(x + C_SIZE, y + C_SIZE);
        }
        x += C_SIZE;
      })
      y += C_SIZE;
    })
    ctx.stroke();
  }
}

class MazeSolver{
  constructor(maze, start, end){
    this.maze = maze;
    this.start = start;
    this.end = end;
    this.path = [];
    this.intersections = [];
    this.cameFrom = "left"
  }

  getCellPossibilities(x, y, prev = undefined){
    let ret = [];
    for (let key in this.maze[y][x]){
      if (this.maze[y][x][key] === true){
        ret.push(key);
      }
    }
    if ((x == this.start[0] && y == this.start[1]) || prev == "left"){
      ret = ret.filter((el) => el != "left")
    }
    if (prev === "right"){
      ret = ret.filter((el) => el != "right")
    }
    if (prev == "bottom"){
      ret = ret.filter((el) => el != "bottom")
    }
    if (prev == "top"){
      ret = ret.filter((el) => el != "top")
    }
    return ret;
  }

  moveTo(x, y, dir){
    if (dir == "left"){
      return [x - 1, y]
    } else if(dir == "right"){
      return [x + 1, y]
    } else if(dir == "top"){
      return [x, y - 1]
    } else if(dir == "bottom"){
      return [x, y + 1]
    }
    //return [x, y];
  }

  inefficientSolve(){
    let x = this.start[0];
    let y = this.start[1];
    while (!(x == this.end[0] && y == this.end[1])){
      const possibilities = this.getCellPossibilities(x, y);
      const dir = possibilities[Math.floor(Math.random() * possibilities.length)];
      this.path.push([x, y]);
      [x, y] = this.moveTo(x, y, dir);
    }
   this.path.push([x, y])
  }

  filterIntersections(){
    let lastInt = this.intersections[this.intersections.length - 1]
    while(lastInt.dirs.length == 0){
      this.intersections.pop()
      lastInt = this.intersections[this.intersections.length - 1]
    }
    return lastInt;
  }

  createIntersection(x, y, prev){
    this.intersections.push({
      dirs: [],
      pos: [x, y]
    })
    for (let key in this.maze[y][x]){
      if (this.maze[y][x][key] === true && key != prev){
        this.intersections[this.intersections.length - 1].dirs.push(key);
      }
    }
    return this.intersections[this.intersections.length - 1]
  }

  moveToLastIntersection(){
    this.filterIntersections();
    while(!(this.path[this.path.length - 1][0] == this.intersections[this.intersections.length -1].pos[0] && this.path[this.path.length - 1][1] == this.intersections[this.intersections.length - 1].pos[1])){
      this.path.pop();
    }
    const lastInt = this.intersections[this.intersections.length - 1]
    return this.useIntersectionDirection(lastInt)
  }

  useIntersectionDirection(lastInt){
    const dirs = lastInt.dirs
    const dir = dirs[Math.floor(Math.random() * dirs.length)]
    lastInt.dirs = lastInt.dirs.filter(el => el != dir)
    switch (dir){
      case "left":
        this.cameFrom = "right";
        return [lastInt.pos[0] - 1, lastInt.pos[1]]
      case "right":
        this.cameFrom = "left";
        return [lastInt.pos[0] + 1, lastInt.pos[1]]
      case "top":
        this.cameFrom = "bottom";
        return [lastInt.pos[0], lastInt.pos[1] - 1]
      case "bottom":
        this.cameFrom = "top";
        return [lastInt.pos[0], lastInt.pos[1] + 1]
    }
  }

  oppositeDirection(dir){
    if (dir == 'left'){
      return "right"
    }
    if (dir == 'top'){
      return "bottom"
    }
    if (dir == 'bottom'){
      return "top"
    }
    if (dir == 'right'){
      return "left"
    }

  }
  moreEfficientSolve(x = this.start[0], y = this.start[1]){
    if(x == this.end[0] && y == this.end[1])
    {
      this.path.push([x, y])
      this.path.push([x + 1, y])
      return;
    }
    this.path.push([x, y])
    let dirs = this.getCellPossibilities(x, y, this.cameFrom);
    dirs = dirs.filter(el => el != this.cameFrom)
    if (dirs.length > 1){
      [x, y] = this.useIntersectionDirection(this.createIntersection(x, y, this.cameFrom));
    }
    if (dirs.length == 0){
      [x, y] = this.moveToLastIntersection()
    }
    if (dirs.length == 1){
      [x ,y] = this.moveTo(x, y, dirs[0])
      this.cameFrom = this.oppositeDirection(dirs[0]);
    }
    return this.moreEfficientSolve(x, y)
  }

  drawPath(ctx){
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.lineWidth = C_SIZE / 2
    ctx.moveTo(C_SIZE * this.start[0], C_SIZE * this.start[1] + C_SIZE / 2)
    this.path.forEach((cell) => {
      ctx.lineTo(C_SIZE * cell[0] + C_SIZE / 2, C_SIZE * cell[1] + C_SIZE / 2)
      ctx.stroke();
    })
  }
}

const theMaze = new Maze
theMaze.draw(context);
//console.log(maze);
const theMazeSolver = new MazeSolver(theMaze.cells, startPos, endPos)
//theMazeSolver.inefficientSolve();
theMazeSolver.moreEfficientSolve();
theMazeSolver.drawPath(context);
console.log('done');




