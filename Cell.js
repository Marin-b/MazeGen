class Cell
{
  constructor(x, y, neighbours)
  {
    this.x = x
    this.y = y
    this.neighbours = this.parseNeighbours(neighbours)
    this.visited = false
  }

  parseNeighbours(neighbours)
  {
    const parsed = []
    var n;
    for (const [key, value] of Object.entries(neighbours)) {
      if (value == true) {
        n = this.getNeighbourIn(key)
        if (!n) { continue }
        parsed.push(n)
      }
    }
    return parsed
  }

  getNeighbourIn(direction)
  {
    if (direction == "top" && this.y != 0) {
      return [this.x, this.y - 1];
    }
    if (direction == "bottom") {
      return [this.x, this.y + 1];
    }
    if (direction == "right") {
      return [this.x + 1, this.y];
    }
    if (direction == "left" && this.x != 0) {
      return [this.x - 1, this.y];
    }
  }

  pos()
  {
    return [this.x, this.y]
  }
}
