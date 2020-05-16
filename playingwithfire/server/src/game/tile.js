const Item = require('./item');

class Tile extends Item {
  constructor(item, x, y) {
    super(x, y)
    this.item = item;
    this.deadly = false;
    this.explosionId = null;
    this.possiblePowerups = [0, 1, 2]
  }

  // make tile deadly to step on for players
  makeDeadly(id) {
    this.deadly = true;
    this.explosionId = id;
  }

  // stop the deadliness of the tile
  stopDeadly(id) {
    if (id === this.explosionId) {
      this.deadly = false;
      return true;
    } else {
      return false;
    }
  }
  // returns true if tile is empty
  isEmpty() {
    return this.item === 'empty';
  }

  // returns the item currently on tile
  getItem() {
    return this.item;
  }

  // sets a new item to the tile
  setItem(newItem) {
    this.item = newItem;
  }

  // returns a random powerup (called when barrel of item is destroyed by explosion)
  setRandomPowerup() {
    if(Math.random() < 1 / 4) {
      this.item = Math.floor(Math.random() * 3);
    } else {
      this.item = "empty";
    }
  }
}

module.exports = Tile;
