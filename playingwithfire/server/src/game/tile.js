class Tile {
  constructor(item, x, y) {
    this.x = x;
    this.y = y;
    this.item = item;
    this.deadly = false;
    this.explosionOwnerId = null;
  }

  makeDeadly(owner) {
    this.deadly = true;
    this.explosionOwner = owner;
  }

  stopDeadly(ownerId) {
    if (ownerId === this.explosionOwnerId) {
      this.deadly = false;
    }
  }

  isEmpty() {
    return this.item === 'empty';
  }

  getItem() {
    return this.item;
  }

  setItem(newItem) {
    this.item = newItem;
  }
}

module.exports = Tile;
