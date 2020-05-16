class Tile {
  constructor(item, x, y) {
    this.x = x;
    this.y = y;
    this.item = item;
    this.deadly = false;
    this.explosionId = null;
    this.possiblePowerups = [0, 1, 2]
  }

  makeDeadly(id) {
    this.deadly = true;
    this.explosionId = id;
  }

  stopDeadly(id) {
    if (id === this.explosionId) {
      this.deadly = false;
      return true;
    } else {
      return false;
    }
  }

  isEmpty() {
    return this.item === 'empty';
  }

  getItem() {
    return this.item;
  }

  setItem(newItem) {
    this.item = newItem;
  }

  setRandomPowerup() {
    if(Math.random() < 1 / 4) {
      this.item = Math.floor(Math.random() * 3);
    } else {
      this.item = "empty";
    }
  }
}

module.exports = Tile;
