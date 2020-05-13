

class Powerup extends Item{
    constructor(x, y, type) {
        super(x, y)
        // types = {0: speed,
        //          1: lightning strength
        //          2: amt bombs}
        this.type = type
    }
}