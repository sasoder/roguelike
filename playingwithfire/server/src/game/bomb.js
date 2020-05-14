const Item = require('./item');

class Bomb extends Item {
  constructor(owner) {
    super(owner.x, owner.y);
    this.ownerId = owner.id;
    this.timeTilExplosion = 5;
    this.strength = owner.bombStrength;
  }

  explode(gameBoard, players) {
    console.log(this);
    const explCoords = this.findExplosionTiles(gameBoard, players);
    console.log('woah explosion!!!');
    // TODO: emit explosion
    // clean up explosions
    setTimeout(() => {
      explCoords.forEach((coord) => {
        gameBoard[coord.y][coord.x].stopDeadly(this.ownerId);
      });
      console.log('woah explosion STOPPP');
      // TODO: emit explosion stop
    }, 1000);
  }


  findExplosionTiles(gameBoard, players) {
    const explCoords = [{ x: this.x, y: this.y }];

    // GOING LEFT FROM THE BOMB ORIGIN
    for (let { y } = this; y >= this.y - this.strength; y -= 1) {
      const tile = gameBoard[y][this.x];
      if (tile.isEmpty()) {
        tile.makeDeadly(this.owner);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        explCoords.push({ x: tile.x, y: tile.y });
        break;
      } else if (tile.getItem() === 'wall') {
        break;
      }
    }

    // GOING RIGHT FROM THE BOMB ORIGIN
    for (let { y } = this; y <= this.y + this.strength; y += 1) {
      const tile = gameBoard[y][this.x];
      if (tile.isEmpty()) {
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        explCoords.push({ x: tile.x, y: tile.y });
        break;
      } else if (tile.getItem() === 'wall') {
        break;
      }
    }

    // GOING UP FROM THE BOMB ORIGIN
    for (let { x } = this; x >= this.x - this.strength; x -= 1) {
      const tile = gameBoard[this.y][x];
      if (tile.isEmpty()) {
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        explCoords.push([tile.x, tile.y]);
        break;
      } else if (tile.getItem() === 'wall') {
        break;
      }
    }

    // GOING DOWN FROM THE BOMB ORIGIN
    for (let { x } = this; x <= this.x + this.strength; x += 1) {
      const tile = gameBoard[this.y][x];
      if (tile.isEmpty()) {
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        explCoords.push({ x: tile.x, y: tile.y });
        break;
      } else if (tile.getItem() === 'wall') {
        break;
      }
    }
    return explCoords;
  }

  increaseStrength() {
    this.strength += 1;
  }
}


module.exports = Bomb;
