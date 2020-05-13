class Player {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        // default player can only place one bomb at a time
        this.totalBombs = 1
        this.amtBombs = 1
        this.speed = 1
        this.bombStrength = 2
    }

    addBomb() {
        this.amtBombs++
        if(this.amtBombs > this.totalBombs) {
            this.amtBombs = this.totalBombs
        }
    }

    addPowerup(type) {
        switch (type) {
            case 0:
                this.speed++
                break
            case 1:
                this.bombStrength++
                break
            case 2:
                this.totalBombs++
                break
            default: console.error("Powerup not yet implemented!")
        }
    }

}


module.exports = Player