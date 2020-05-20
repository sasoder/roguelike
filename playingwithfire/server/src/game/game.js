const Tile = require('./tile');
const Player = require('./player');
const Bomb = require('./bomb');
//const Barrel = require('./barrel');

const sockets = require("./../sockets.js");
const playerColors = ["aliceblue", "purple", "yellow", "blue", "green", "cyan"]

class Game {
  constructor() {
    this.players = {}; // Array of player objects
    this.tiles = [];
    this.width = 15;
    this.height = 15;
    this.initGame()
    this.isActive = false;
    this.nextPlayerId = 0
  }

  // sets up the base of the game with gameboard
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

  startGame() {
    // check if only one person in game
    this.isActive = true;
    let players = Object.entries(this.players);
    console.log("Started new game with", players.length, "players");
    if(players.length === 1) {
      sockets.gameOver(players[0][1].id);
    }
  }

  // returns info about the players and tiles in the current game
  getGameState() {
    let playersInfo = {}
    Object.entries(this.players).forEach(([_, player]) => {
      if (player.isAlive) playersInfo[player.id] = player.getInfo();
    })

    return {
      players: playersInfo,
      tiles: this.tiles,
    }
  }

  // adds player based on their socket-id
  addPlayer(id) {
    console.log(this.isActive)
    if(this.isActive) return;
    // // Remove player if they already exist
    // if (this.players[id]) {
    //   this.removePlayer(id);
    // }

    // Create player and place in empty tile
    const tile = this.findEmptyTile(true);
    this.players[id] = new Player(this.getNextId, tile.x, tile.y, this.getRandomColor());
    console.log('created new player:', id, tile.x, tile.y);

    // emit new player to others
    sockets.addPlayer(this.players[id].getInfo());
  }

  // increments the public id of the player that they are identified by from the clients
  get getNextId(){
    let nextId = this.nextPlayerId;
    this.nextPlayerId +=1;
    return nextId;
  }

  // returns a random color for players
  getRandomColor() {
    return playerColors[Math.floor(Math.random() * playerColors.length)]
  }

  // removes the player (if it exists) from the current game (only called from sockets.js on disconnect)
  removePlayer(id) {
    if(this.players[id] === undefined) return;
    this.players[id].die();
    sockets.removePlayer(this.players[id].getInfo())

    // Check if game over
    let alivePlayers = Object.entries(this.players).filter(([_, p]) => p.isAlive);
    if (alivePlayers.length === 1) {
      sockets.gameOver(alivePlayers[0][1].id);
      return;
    } else if (alivePlayers.length === 0) {
      sockets.gameOver(-1);
      return;
    }
    delete this.players.id;
  }

  // moves the player based on input from the client
  movePlayer(id, direction) {
    if(!this.isActive) return;
    // Check if player exists
    const player = this.players[id];
    if (player === undefined || !player.isAlive ) return;

    // Check if player has the speed to move
    if (player.canMove) {
      player.canMove = false;
      setTimeout(() => {
        player.canMove = true;
      }, 1000 / player.speed);
    } else {
      return;
    }

    // Calculate new coords
    const newCoords = { x: player.x, y: player.y };
    if (direction === 'up') newCoords.y -= 1;
    else if (direction === 'left') newCoords.x -= 1;
    else if (direction === 'right') newCoords.x += 1;
    else if (direction === 'down') newCoords.y += 1;

    // Check if another player is obstructing movement
    const playerInTheWay = Object.entries(this.players).some(([_, p]) => {
      if (p.isAlive && (p.x === newCoords.x && p.y === newCoords.y)) {
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
      // emitting before change occurs so we have a reference to the previous tile for drawing purposes
      sockets.movePlayer(player.id, newCoords.x, newCoords.y);
      player.x = newCoords.x;
      player.y = newCoords.y;
      if (tile.deadly) this.removePlayer(id);
    } else if ([0, 1, 2].includes(tile.getItem())) { // it's a powerup
      player.addPowerup(tile.getItem());
      tile.setItem("empty");
      sockets.updateTile('empty', newCoords.x, newCoords.y);
      sockets.movePlayer(player.id, newCoords.x, newCoords.y);
      player.x = newCoords.x;
      player.y = newCoords.y;
      if (tile.deadly) this.removePlayer(id);
    }
  }

  // places a bomb by the player with the id id based on input from the client
  placeBomb(id) {
    if (!this.isActive) return;

    let player = this.players[id]
    if(player == undefined) return;
    if (!player.isAlive) return;

    if (player.amtBombs > 0) {
      player.removeBomb();
      let b = new Bomb(this.players[id]);
      this.tiles[player.y][player.x].setItem("bomb")
      sockets.updateTile('bomb', player.x, player.y);
      setTimeout(() => {
        b.explode(this.tiles, this.players);
        player.addBomb();
      }, b.timeTilExplosion * 1000);
    } else {
      console.log("not enough bombs :(");
    }
  }

  // returns one empty tile, can be supplemented with a bool onlyEdgeTiles if we only want edge tiles or not
  findEmptyTile(onlyEdgeTiles) {
    const empties = this.tiles.reduce((acc, row) => acc.concat(row))
      .filter((tile) => (tile.isEmpty() && (onlyEdgeTiles ? this.isNextToEdge(tile) : true) && !this.isPlayerHere(tile)));
    return empties[Math.floor(Math.random() * empties.length)];
  }

  // returns true if the item checked is next to the edge
  isNextToEdge(item) {
    return item.x === this.width - 2 || item.x === 1 || item.y === this.height - 2 || item.y === 1;
  }

  // check whether or not there's a player on the tile
  isPlayerHere(tile) {
    return Object.entries(this.players).some(([_, player]) => {
      player.x === tile.x && player.y === tile.y;
    })
  }

  // add barrels to the gameboard deterministically
  populateTilesWithBarrels() {
    for (let y = 2; y < this.height - 2; y += 1) {
      for (let x = 2; x < this.width - 2; x += 1) {
        // checking if there's already something there
        // (for example if we hardcode a level with walls spread out)
        if (this.tiles[y][x].isEmpty()) {
          if(Math.random() > 1/4) {
            this.tiles[y][x].setItem('barrel');
          }
        }
      }
    }
  }
}

module.exports = Game;
