const Powerup = require('./powerup');
const Item = require('./item');

class Barrel extends Item {
  // constructor(x, y) {
  //   super(x, y);
  // }

  destroy() {
    const powerup = Powerup(this.x, this.y);
    return powerup;
  }
}
