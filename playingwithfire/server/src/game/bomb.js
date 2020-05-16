const Item = require('./item');
const sockets = require("./../sockets.js");

class Bomb extends Item {
  constructor(owner) {
    super(owner.x, owner.y);
    this.ownerId = owner.id;
    this.timeTilExplosion = 5;
    this.strength = owner.bombStrength;
  }

  explode(gameBoard) {
    const explCoords = this.findExplosionTiles(gameBoard);
    explCoords.forEach((coord) => {
      let tile = gameBoard[coord.y][coord.x];
      if (tile.getItem() === "barrel") {
        tile.setRandomPowerup();
        sockets.powerup(tile.getItem(), tile.x, tile.y);
      }
      // TODO: don't think we want this (destroys items)
      /* else {
        gameBoard[coord.y][coord.x].setItem("empty");
      } */
    });
    sockets.explosion(explCoords);


    // clean up explosions
    setTimeout(() => {
      let madeNotDeadly = []//explCoords.filter((coord) => {gameBoard[coord.y][coord.x].stopDeadly(this.ownerId)});
      explCoords.forEach((coord) => {
        if(gameBoard[coord.y][coord.x].stopDeadly(this.ownerId)) {
          madeNotDeadly.push({x: coord.x, y: coord.y})
        } else {
        }
      });
      console.log(madeNotDeadly)
      sockets.madeNotDeadly(madeNotDeadly);

    }, 1000);
    // TODO check if any players die
  }


  findExplosionTiles(gameBoard) {
    const explCoords = [{ x: this.x, y: this.y }];
    gameBoard[this.y][this.x].makeDeadly(this.ownerId);

    // GOING LEFT FROM THE BOMB ORIGIN
    for (let y = this.y - 1; y >= Math.max(this.y - this.strength, 0); y -= 1) {
      const tile = gameBoard[y][this.x];
      if (tile.isEmpty()) {
        tile.makeDeadly(this.ownerId);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.ownerId);
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
        tile.makeDeadly(this.ownerId);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.ownerId);
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
        tile.makeDeadly(this.ownerId);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.ownerId);
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
        tile.makeDeadly(this.ownerId);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.ownerId);
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
