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
  let player = players[id]
  movePlayer(player, x, y)
  // draw the updated player anew
  drawPlayer(player)
})

socket.on("new_player", (player) => {
  console.log("a new player joined", player);
  players[player.id] = player;
  drawPlayer(player);
})

socket.on("remove_player", (player) => {
  console.log("removing player")
  let tile = tiles[player.y][player.x]
  delete players[player.id]
  drawTile(tile)
})

socket.on("explosion", (explCoords) => {
  explCoords.forEach((coord) => {
    let tile = tiles[coord.y][coord.x]
    tile.isDeadly = true
    tile.item = "empty"
    drawTile(tile)
  })
})

socket.on("made_not_deadly", (explCoords) => {
  explCoords.forEach((coord) => {
    let tile = tiles[coord.y][coord.x]
    tile.isDeadly = false
    drawTile(tile)
  })
})

socket.on("powerup", (type, x ,y) => {
  console.log("new powerup at", x ,y);
  let tile = tiles[y][x];
  tile.item = type;
  drawTile(tile);
})

function drawGameState() {
  // DRAW TILES
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let tile = tiles[y][x]
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
  let shape;

  switch (tileType) {
    case "empty":
      shape = "box";
      ctx.fillStyle = "black";
      break;
    case "barrel":
      shape = "box";
      ctx.fillStyle = "brown";
      break;
    case "wall":
      shape = "box";
      ctx.fillStyle = "gray";
      break;
    case 0:
      shape = 'circle';
      ctx.fillStyle = "green";
      break;
    case 1:
      shape ="circle"
      ctx.fillStyle = "blue";
      break;
    case 2:
      shape = "circle"
      ctx.fillStyle = "orange";
      break;
    default:
      console.log("uhoh unrecogniable tile", tileType);
      break;
      
  }

  if (shape === "box") {
    if (tile.isDeadly) {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(tile.x * tileWidth, tile.y * tileHeight, tileWidth, tileHeight); 
  }
  else if (shape === "circle") {
    console.log('drawing item at', tile.x, tile.y);
    ctx.beginPath();
    ctx.arc((tile.x * tileWidth) + (tileWidth / 2), (tile.y * tileHeight) + (tileHeight / 2), tileWidth / 5, 0, 2 * Math.PI);
    ctx.fill();
  } 
}

function drawPlayer(player) {
    ctx.fillStyle = player.color
    ctx.beginPath();
    ctx.arc((player.x * tileWidth) + (tileWidth / 2), (player.y * tileHeight) + (tileHeight / 2), tileWidth / 3, 0, 2 * Math.PI);
    ctx.fill();
}

function movePlayer(player, newX, newY) {
  // "draw over" the previous player's tile
  drawTile(tiles[player.y][player.x])
  player.x = newX
  player.y = newY
}




document.addEventListener('keydown', function(event) {
  let keyCodes = {
      space: 32,
      left: 37,
      up: 38,
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
    
