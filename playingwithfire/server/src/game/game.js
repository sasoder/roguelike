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
        this.populateTilesWithBarrels()
        console.log("these are the tiles:\n", this.tiles);
    }

    addPlayer(id) {
        // Remove player if they already exist
        if (this.players[id]) {
            console.log("removing player", id);
        }

        // Create player and place in empty tile
        let tile = this.findEmptyTile(true);
        this.players[id] = new Player(id, tile.x, tile.y);
        console.log("created new player:", id, tile.x, tile.y);
    }

    removePlayer(id) {
        this.players[id] = null;
        console.log("removed player:", id);
    }

    movePlayer(id, direction) {
        let player = this.players[id];
        let newCoords = {x: player.x, y: player.y}
        if (direction === 'up') newCoords.y += 1
        else if (direction === 'left') newCoords.x -= 1
        else if (direction === 'right') newCoords.x += 1
        else newCoords.y -= 1
        
        // Check if a player is obstructing movement
        let playerInTheWay = this.players.some(p => {
            if (p.x === newCoords.x && p.y === newCoords.y) {
                // someone is in the way!
                return true
            }
        });
        if(playerInTheWay) {
            return
        }

        let tile = this.tiles[newCoords.y][newCoords.x]
        if (tile.isEmpty()) {
            this.this.makeMove(player, newCoords)   
        } 
        else if(tile.getItem() == typeof(Powerup)) {
            player.addPowerup(this.getItem().getType())
            this.makeMove(player, newCoords)
        }
    }

    makeMove(player, newCoords) {
        player.x = newCoords.x
        player.y = newCoords.y
        // emit change
        
    }
    
    findEmptyTile(onlyEdgeTiles) {
        let empties = this.tiles.reduce((acc, row) => acc.concat(row))
                                .filter(tile => tile.isEmpty()
                                        && onlyEdgeTiles ? this.isNextToEdge(tile) : true); // also check that the tile is next to the edge
        return empties[Math.floor(Math.random()*empties.length)];
    }

    isNextToEdge(item) {
        return item.x == this.width-1 || item.x == 1 || item.y == this.height-1 || item.y == 1
    }

    populateTilesWithBarrels() {
        for (let y = 2; y < this.height - 1; y++) {
            for (let x = 2; x < this.width - 1; x++) {
                // checking if there's already something there (for example if we hardcode a level with walls spread out)
                if(this.tiles[y][x].isEmpty()) {
                    this.tiles[y][x].setItem("barrel")
                }
            }
        }
    }
}

module.exports = Game