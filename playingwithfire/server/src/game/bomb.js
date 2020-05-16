const Item = require('./item');
const sockets = require("./../sockets.js");

class Bomb extends Item {
  constructor(owner) {
    super(owner.x, owner.y);
    this.id = "" + owner.id + owner.bombCounter;
    this.timeTilExplosion = 3;
    this.strength = owner.bombStrength;
  }

  // explodes the bomb and checks whether players/barrels have been hit and takes appropriate action
  explode(gameBoard, players) {
    const explCoords = this.findExplosionTiles(gameBoard);
    explCoords.forEach((coord) => {
      let tile = gameBoard[coord.y][coord.x];
      // if there's a barrel on the explosion coordinates, spawn a powerup there (maybe)
      if (tile.getItem() === "barrel") {
        tile.setRandomPowerup();
        sockets.updateTile(tile.getItem(), tile.x, tile.y);
      } 
      else if (tile.getItem() === 'bomb' && tile.explosionId === this.id) {
        tile.setItem('empty');
        sockets.updateTile('empty', tile.x ,tile.y);
      }
      else {
        // otherwise we check if an explosion matched a player. If so, kill them
        let deadPlayers = Object.entries(players).filter(([_, p]) => p.isAlive && (p.x === coord.x && p.y === coord.y))
        deadPlayers.forEach(([_, player]) => {
          console.log("player", player.id, "DIED")
          player.die();
        })
      }
    });
    // emit the explosion coordinates to clients
    sockets.explosion(explCoords);
    
    // Check if game over
    let alivePlayers = Object.entries(players).filter(([_, p]) => p.isAlive);
    if (alivePlayers.length === 1) {
      sockets.gameOver(alivePlayers[0][1].id);
      return;
    } else if (alivePlayers.length === 0) {
      sockets.gameOver(-1);
      return;
    }

    // clean up explosions
    setTimeout(() => {
      let madeNotDeadly = []
      explCoords.forEach((coord) => {
        if(gameBoard[coord.y][coord.x].stopDeadly(this.id)) {
          madeNotDeadly.push({x: coord.x, y: coord.y})
        } else {
        }
      });
      // emit that the explosion tiles are no longer dangerous
      sockets.madeNotDeadly(madeNotDeadly);

    }, 1000);
  }


  // returns an array of coordinates that the explosion reached
  findExplosionTiles(gameBoard) {
    const explCoords = [{ x: this.x, y: this.y }];
    gameBoard[this.y][this.x].makeDeadly(this.id);

    // GOING LEFT FROM THE BOMB ORIGIN
    for (let y = this.y - 1; y >= Math.max(this.y - this.strength, 0); y -= 1) {
      const tile = gameBoard[y][this.x];
      if (tile.isEmpty()) {
        tile.makeDeadly(this.id);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.id);
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
        tile.makeDeadly(this.id);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.id);
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
        tile.makeDeadly(this.id);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.id);
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
        tile.makeDeadly(this.id);
        explCoords.push({ x: tile.x, y: tile.y });
      } else if (tile.getItem() === 'barrel') {
        tile.makeDeadly(this.id);
        explCoords.push({ x: tile.x, y: tile.y });
        break;
      } else if (tile.getItem() === 'wall') {
        break;
      }
    }
    return explCoords;
  }
}


module.exports = Bomb;
