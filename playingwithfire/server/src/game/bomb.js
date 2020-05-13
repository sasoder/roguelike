class Bomb extends Item {
    constructor(owner) {
        super(owner.x, owner.y)
        this.owner = owner
        this.timeTilExplosion =  5
        this.strength = owner.bombStrength
    }

    explode(gameBoard, players) {
        let explCoords = this.findExplosionTiles(gameBoard, players)
        this.owner.addBomb()
    }

    drawBomb(explCoords) {
        // TODO do this in client
    }
    
    findExplosionTiles(gameBoard, players) {
        let explCoords = [{x: this.x, y: this.y}]
        players.forEach(player => {

            // GOING LEFT FROM THE BOMB ORIGIN
            for (let y = this.y; y >= this.y - this.strength; y++) {
                let tile = gameBoard[y][this.x]
                    if(tile.isEmpty()) {
                        explCoords.push({x: tile.x, y: tile.y})
                    } else if (tile.getItem() === "barrel" || tile.x == player.x && tile.y == player.y) {
                        explCoords.push({x: tile.x, y: tile.y})
                        break
                    } else if (tile.getItem() === "wall") {
                        break
                    }
            }

            // GOING RIGHT FROM THE BOMB ORIGIN
            for (let y = this.y; y <= this.y + this.strength; y++) {
                let tile = gameBoard[y][this.x]
                    if(tile.isEmpty()) {
                        explCoords.push({x: tile.x, y: tile.y})
                    } else if (tile.getItem() === "barrel" || tile.x == player.x && tile.y == player.y) {
                        explCoords.push({x: tile.x, y: tile.y})
                        break
                    } else if (tile.getItem() === "wall") {
                        break
                    }
            }

            // GOING UP FROM THE BOMB ORIGIN
            for (let x = this.x; y >= this.x - this.strength; x++) {
                let tile = gameBoard[this.y][x]
                    if(tile.isEmpty()) {
                        explCoords.push({x: tile.x, y: tile.y})
                    } else if (tile.getItem() === "barrel" || tile.x == player.x && tile.y == player.y) {
                        explCoords.push([tile.x, tile.y])
                        break
                    } else if (tile.getItem() === "wall") {
                        break
                    }
            }

            // GOING DOWN FROM THE BOMB ORIGIN
            for (let x = this.x; y <= this.x + this.strength; x++) {
                    let tile = gameBoard[this.y][x]
                    if(tile.isEmpty()) {
                        explCoords.push({x: tile.x, y: tile.y})
                    } else if (tile.getItem() === "barrel" || tile.x == player.x && tile.y == player.y) {
                        explCoords.push({x: tile.x, y: tile.y})
                        break
                    } else if (tile.getItem() === "wall") {
                        break
                    }
            }
        })
        return explCoords
    }

    increaseStrength() {
        this.strength++
    }

}