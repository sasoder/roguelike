const Powerup = require("./powerup")

class Barrel extends Item {
    constructor(x, y) {
        super(x, y)
    }

    destroy() {
        let powerup = Powerup(this.x, this.y)
        return powerup
    }

}