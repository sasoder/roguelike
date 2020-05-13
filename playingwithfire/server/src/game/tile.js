class Tile {
    constructor(item, x ,y) {
        this.x = x;
        this.y = y;
        this.item = item
    }

    isEmpty() {
        return this.item == "empty"
    }

    getItem() {
        return this.item
    }
}

module.exports = Tile