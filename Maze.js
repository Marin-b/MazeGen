class Maze {
  constructor() {
    this.cells = [];
    this.visited = [];
    this.backtrack = [];
    this.nCell = 0
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
        this.nCell++;
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
    while(this.backtrack.length != this.nCell){
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
    ctx.strokeStyle = "black";
    ctx.lineWidth = C_SIZE / 100
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
