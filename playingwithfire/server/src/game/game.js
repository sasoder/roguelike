const Tile = require("./tile");
const Player = require("./player");

class Game {

    constructor() {
        this.players = {} // Array of player objects
        //this.walls = [] // Array of coords you cant move to and get blown up by bombs
        //this.powerups = {} // Array of powerup objects (with coords)
        this.tiles = []
        this.width = 10
        this.height = 10
        this.initGame()
    }

    initGame() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = []
            for (let x = 0; x < this.width; x++){
                if (x == 0 || x == this.width || y == 0 || y == this.height) {
                    this.tiles[y][x] = new Tile("wall", x ,y);
                }
                else {
                    this.tiles[y][x] = new Tile("empty", x, y);
                }
                
            }
        }
        console.log("these are the tiles:\n", this.tiles);
    }

    addPlayer(id) {
        // Remove player if they already exist
        if (this.players[id]) {
            console.log("removing player", id);
        }

        // Create player and place in empty tile
        let tile = this.findEmptyTile();
        this.players[id] = new Player(id, tile.x, tile.y);
        console.log("created new player:", id, tile.x, tile.y);
    }

    removePlayer(id) {
        this.players[id] = null;
        console.log("removed player:", id);
    }
    
    findEmptyTile() {
        let empties = this.tiles.reduce((acc, row) => acc.concat(row))
                                .filter(tile => tile.isEmpty());
        return empties[Math.floor(Math.random()*empties.length)];
    }
}

module.exports = Game