class MazeSolver
{
  constructor(maze, context, start, end)
  {
    this.maze = maze.map((row, i) =>
      row.map((cell, j) => new Cell(j, i, cell))
    )
    this.end = this.getCellAt(end)
    this.ctx = context
    this.path = [this.getCellAt([start[0], start[1]])]
    this.canceled = false
  }

  generateStep()
  {
    if (this.canceled) {
      return
    }
    const next = this.findNext();
    if (next){
      this.goTo(next);
      if (next == this.end) {
        return
      }
    } else {
      this.backtrack()
    }
     window.requestAnimationFrame(() => this.generateStep())
  }

  goTo(next)
  {
    const current = this.path.at(-1)
    this.path.push(next);
    next.visited = true
    this.drawLine(current, next, "orange")
  }

  backtrack()
  {
    const current = this.path.pop();
    const next = this.path.at(-1);
    this.drawLine(current, next, "white")
  }

  drawLine(current, next, color)
  {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = C_SIZE / 2
    this.ctx.lineCap = 'square'
    this.ctx.moveTo(C_SIZE * current.x + C_SIZE / 2, C_SIZE * current.y + C_SIZE / 2)
    this.ctx.lineTo(C_SIZE * next.x + C_SIZE / 2, C_SIZE * next.y + C_SIZE / 2)
    this.ctx.stroke();
  }

  findNext()
  {
    const current = this.path.at(-1)
    const options = current.neighbours.map((n) => this.getCellAt(n)).filter((c) => !c.visited)
    if (options.lenght == 0) {
      return false
    }
    return options.at(-1)
  }


  getCellAt([x, y])
  {
    return this.maze[y][x]
  }
}


