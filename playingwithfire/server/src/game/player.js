const Bomb = require('./bomb');



class Player {
  constructor(id, x, y, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.totalBombs = 1; // default player can only place one bomb at a time
    this.amtBombs = 1;
    this.speed = 1; // moves per second
    this.bombStrength = 2;
    this.canMove = true;
  }

  getInfo() {
    return {
      x: this.x,
      y: this.y,
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
    this.amtBombs -= 1;
    if (this.amtBombs < 0) {
      this.amtBombs = 0;
    }
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
        break;
      default: console.error('Powerup not yet implemented!');
    }
  }
}




module.exports = Player;
