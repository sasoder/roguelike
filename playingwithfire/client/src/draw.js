var socket = io.connect("http://localhost:3000");
var lastDownTarget, canvas;
let gameState = null;

socket.on("game_state", (initState) => {
  gameState = initState;
  console.log(gameState);
});






window.onload = function() {
  canvas = document.getElementById('canvas');

  /* document.addEventListener('mousedown', function(event) {
    lastDownTarget = event.target;
  }, false); */
  
  document.addEventListener('keydown', function(event) {
    let keyCodes = {
        space: 32,
        up: 38,
        left: 37,
        right: 39,
        down: 40,
    }
    socket.emit('move', 'up');
    switch (event.keyCode) {
      case keyCodes.space:
        socket.emit('bomb');
        break;
      
      case keyCodes.up:
        socket.emit('move', 'up');
        break;

      case keyCodes.down:
        socket.emit('move', 'down');
        break;
        
      case keyCodes.left:
        socket.emit('move', 'left');
        break;
      
      case keyCodes.right:
        socket.emit('move', 'right');
        break;
    }
  }, false);
    
}

drawTiles(gameBoard) {

}