const Tile = require('./tile');
const Player = require('./player');
const Powerup = require('./powerup');
const Bomb = require('./bomb');

// TODO uhhhh
const sockets = require("./../sockets.js");
const playerColors = ["aliceblue", "purple", "yellow", "blue", "green", "cyan"]
let nextPlayerId = 0

class Game {
  constructor() {
    this.players = {}; // Array of player objects
    this.tiles = [];
    this.width = 15;
    this.height = 15;
    this.initGame();
  }

  initGame() {
    for (let y = 0; y < this.height; y += 1) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x += 1) {
        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
          this.tiles[y][x] = new Tile('wall', x, y);
        } else {
          this.tiles[y][x] = new Tile('empty', x, y);
        }
      }
    }
    this.populateTilesWithBarrels();
  }

  getGameState() {
    let playersInfo = {}
    Object.entries(this.players).forEach(([_, player]) => {
      playersInfo[player.id] = player.getInfo();
    })

    return {
      players: playersInfo,
      tiles: this.tiles,
    }
  }

  addPlayer(id) {
    // Remove player if they already exist
    if (this.players[id]) {
      this.removePlayer(id);
    }

    // Create player and place in empty tile
    const tile = this.findEmptyTile(true);
    this.players[id] = new Player(this.getNextId, tile.x, tile.y, this.getRandomColor());
    console.log('created new player:', id, tile.x, tile.y);

    // emit new player to others

  }

  get getNextId(){
    let nextId = nextPlayerId;
    nextPlayerId +=1;
    return nextId;
  }

  getRandomColor() {
    return playerColors[Math.floor(Math.random() * playerColors.length)]
  }

  removePlayer(id) {
    delete this.players.id;
    console.log('removed player:', id);
  }

  movePlayer(id, direction) {
    // Check if player exists
    const player = this.players[id];
    if (player === null) return;

    // Check if player has the speed to move
    if (player.canMove) {
      player.canMove = false;
      setTimeout(() => {
        player.canMove = true;
      }, 1000 / player.speed);
    } else {
      console.log('player cant move yet!');
      return;
    }

    // Calculate new coords
    const newCoords = { x: player.x, y: player.y };
    if (direction === 'up') newCoords.y += 1;
    else if (direction === 'left') newCoords.x -= 1;
    else if (direction === 'right') newCoords.x += 1;
    else newCoords.y -= 1;

    // Check if another player is obstructing movement
    const playerInTheWay = Object.entries(this.players).some((_, p) => {
      if (p.x === newCoords.x && p.y === newCoords.y) {
        // someone is in the way!
        return true;
      }
      return false;
    });
    if (playerInTheWay) {
      return;
    }

    // Check if tile is free to move to
    const tile = this.tiles[newCoords.y][newCoords.x];
    if (tile.isEmpty()) {
      player.x = newCoords.x;
      player.y = newCoords.y;
      // TODO: emit
    } else if (tile.getItem() instanceof Powerup) {
      player.addPowerup(this.getItem().getType());
      player.x = newCoords.x;
      player.y = newCoords.y;
      // TODO: emit
    }
  }

  placeBomb(id) {
    let player = this.players[id]
    if (player.amtBombs > 0) {
      player.removeBomb();
      let b = new Bomb(this.players[id]);
      setTimeout(() => {
        b.explode(this.tiles, this.players);
        player.addBomb();
      }, 1000);
    } else {
      console.log("not enough bombs :(");
    }
  }

  findEmptyTile(onlyEdgeTiles) {
    const empties = this.tiles.reduce((acc, row) => acc.concat(row))
      .filter((tile) => (tile.isEmpty() && (onlyEdgeTiles ? this.isNextToEdge(tile) : true)));
    return empties[Math.floor(Math.random() * empties.length)];
  }

  isNextToEdge(item) {
    return item.x === this.width - 1 || item.x === 1 || item.y === this.height - 1 || item.y === 1;
  }

  populateTilesWithBarrels() {
    for (let y = 2; y < this.height - 2; y += 1) {
      for (let x = 2; x < this.width - 2; x += 1) {
        // checking if there's already something there
        // (for example if we hardcode a level with walls spread out)
        if (this.tiles[y][x].isEmpty()) {
          this.tiles[y][x].setItem('barrel');
        }
      }
    }
  }
}

module.exports = Game;
