class Player {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        // default player can only place one bomb at a time
        this.totalBombs = 1;
    }
}


module.exports = Player