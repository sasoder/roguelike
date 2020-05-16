const Item = require('./item');
const sockets = require("./../sockets.js");

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
    sockets.explosion(explCoords);
    console.log(explCoords)
    // clean up explosions
    let madeNotDeadly = {}
    setTimeout(() => {
      explCoords.forEach((coord) => {
        if(gameBoard[coord.y][coord.x].stopDeadly(this.ownerId)) {
          madeNotDeadly.push({x: coord.x, y: coord.y})
          console.log("made not deadly")
        }
      });
      console.log('woah explosion STOPPP');
      // TODO: emit explosion stop
      sockets.madeNotDeadly(madeNotDeadly);

    }, 1000);
    // TODO check if any players die
  }


  findExplosionTiles(gameBoard, players) {
    const explCoords = [{ x: this.x, y: this.y }];

    // GOING LEFT FROM THE BOMB ORIGIN
    for (let y = this.y - 1; y >= Math.max(this.y - this.strength, 0); y -= 1) {
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
    for (let y = this.y + 1; y <= Math.min(this.y + this.strength, gameBoard.length); y += 1) {
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
    for (let x = this.x - 1; x >= Math.max(this.x - this.strength, 0); x -= 1) {
      const tile = gameBoard[this.y][x];
      if (tile.isEmpty()) {
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        explCoords.push({x: tile.x, y: tile.y});
        break;
      } else if (tile.getItem() === 'wall') {
        break;
      }
    }

    // GOING DOWN FROM THE BOMB ORIGIN
    for (let x = this.x + 1; x <= Math.min(this.x + this.strength, gameBoard[0].length); x += 1) {
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
