const Bomb = require('./bomb');



class Player {
  constructor(id, x, y, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.totalBombs = 1; // default player can only place one bomb at a time
    this.amtBombs = 1;
    this.speed = 2; // moves per second
    this.bombStrength = 2;
    this.canMove = true;
    this.isAlive = true;
    this.bombCounter = 0;
  }

  getInfo() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      isAlive: this.isAlive,
      color: this.color
    };
  }

  addBomb() {
    this.amtBombs += 1;
    if (this.amtBombs > this.totalBombs) {
      this.amtBombs = this.totalBombs;
    }
  }

  removeBomb() {
    this.bombCounter++
    this.amtBombs -= 1;
    if (this.amtBombs < 0) {
      this.amtBombs = 0;
    }
  }

  die() {
    this.isAlive = false;
  }

  addPowerup(type) {
    switch (type) {
      case 0:
        this.speed += 1;
        break;
      case 1:
        this.bombStrength += 1;
        break;
      case 2:
        this.totalBombs += 1;
        this.amtBombs += 1;
        console.log("PLAYER ", this.id, " CAN NOW PLACE ", this.totalBombs, " BOMBS AT A TIME!");
        break;
      default: console.error('Powerup not yet implemented!');
    }
  }
}

module.exports = Player;
