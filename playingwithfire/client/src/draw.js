let socket = io.connect("http://localhost:3000");
let players = null;
let tiles = null;
let width;
let height;
let tileWidth;
let tileHeight;

canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

socket.on("game_state", (initState) => {
  players = initState.players;
  tiles = initState.tiles;
  width = tiles[0].length;
  height = tiles.length;
  tileHeight = canvas.height / tiles[0].length;
  tileWidth = canvas.width / tiles.length;

  console.log(tiles);
  console.log(players);
  drawGameState(tiles, players);
});

socket.on("player_move", (id, x, y) => {
  
  // TODO call drawplaer
})

function drawGameState() {
  // DRAW TILES
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let tile = tiles[y][x];
      drawTile(tile)
    } 
  }
  // DRAW PLAYERS
  Object.entries(players).forEach(([_, player]) => {
    drawPlayer(player)
  });

}

function drawTile(tile) {
  let tileType = tile.item;
  if(tileType === "empty") {
    ctx.fillStyle = "black";
    
  } else if (tileType === "barrel"){
    ctx.fillStyle = "brown";
    
  } else if (tileType === "wall") {
    ctx.fillStyle = "gray";
  }
  if (tile.isDeadly) {
    ctx.fillStyle = "red";
  }
  ctx.fillRect(tile.x * tileWidth, tile.y * tileHeight, tileWidth, tileHeight);   
}

function drawPlayer(player) {
    ctx.fillStyle = player.color
    ctx.beginPath();
    ctx.arc((player.x * tileWidth) + (tileWidth / 2), (player.y * tileHeight) + (tileHeight / 2), tileWidth / 3, 0, 2 * Math.PI);
    ctx.fill();
}




document.addEventListener('keydown', function(event) {
  let keyCodes = {
      space: 32,
      up: 38,
      left: 37,
      right: 39,
      down: 40,
  }

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
  }
}, false);
    
