let socket = io.connect("http://" + window.location.host);
let players = null;
let tiles = null;
let width;
let height;
let tileWidth;
let tileHeight;

canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
/* --------------------------- SOCKET FUNCTIONS --------------------------------- */
function gameState(initState) {
  players = initState.players;
  tiles = initState.tiles;
  width = tiles[0].length;
  height = tiles.length;
  tileHeight = canvas.height / tiles[0].length;
  tileWidth = canvas.width / tiles.length;
  
  console.log(tiles);
  console.log(players);
  drawGameState(tiles, players);
}

function playerMove(id, x, y) {
  let player = players[id]
  movePlayer(player, x, y)
  // draw the updated player anew
  drawPlayer(player)
}

function newPlayer(player) {
  console.log("a new player joined", player);
  players[player.id] = player;
  drawPlayer(player);
}

function removePlayer(player) {
  let tile = tiles[player.y][player.x]
  delete players[player.id]
  drawTile(tile)
}

function explosion(explCoords) {
  explCoords.forEach((coord) => {
    let tile = tiles[coord.y][coord.x]
    tile.deadly = true
    drawTile(tile)
  })
}

function madeNotDeadly(explCoords) {
  explCoords.forEach((coord) => {
    let tile = tiles[coord.y][coord.x]
    tile.deadly = false
    drawTile(tile)
  })
}

function updateTile(item, x, y) {
  let tile = tiles[y][x];
  tile.item = item;
  drawTile(tile);
}

function gameOver(playerId) {
  if(playerId === -1) {
    alert("It's a draw!!")
  } else {
    alert("Player with id " + playerId + " won the game!!!");
  }
}

socket.on("message", (type, _payload) => {
  let payload;
  try {
    payload = JSON.parse(_payload);
    console.log("parsed", payload)
  } catch (TypeError) {
    console.log("coudlnt parse", _payload)
    payload = _payload;
  }
  
  switch (type) {
    case "game_state":
      gameState(payload);
      break;
    case 'player_move':
      playerMove(payload.id, payload.x, payload.y);
      break;
    case "new_player":
      newPlayer(payload);
      break;
    case "remove_player":
      removePlayer(payload);
      break;
    case "explosion":
      explosion(payload);
      break;
    case "made_not_deadly":
      madeNotDeadly(payload);
      break;
    case "update_tile":
      console.log("payload.y", payload.y)
      updateTile(payload.item, payload.x, payload.y);
      break;
    case "game_over":
      gameOver(payload);
      break;
  }
})

function startGame() {
  socket.send("start_game");
}

/* --------------------------- END SETUP SOCKET --------------------------------- */

// draws the gamestate based on the current local gamestate that has been sent by the server
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

// draws the tile appropriately depending on its type and items on it
function drawTile(tile) {
  let tileType = tile.item;

  // draw bg
  if (tileType === 'empty' || [0, 1, 2].includes(tileType) || tileType === 'bomb') ctx.fillStyle = "black";
  else if (tileType === 'barrel') ctx.fillStyle = "brown";
  else if (tileType === 'wall') ctx.fillStyle = "grey";
  // draw deadly :)
  if (tile.deadly) ctx.fillStyle = "red";
  ctx.fillRect(tile.x * tileWidth, tile.y * tileHeight, tileWidth, tileHeight); 
  
  // draw item
  if ([0,1,2].includes(tileType)) {
    console.log('drawing powerup', tileType);
    if (tileType === 0) ctx.fillStyle = "green"
    if (tileType === 1) ctx.fillStyle = "blue"
    if (tileType === 2) ctx.fillStyle = "orange"
    ctx.beginPath();
    ctx.arc((tile.x * tileWidth) + (tileWidth / 2), (tile.y * tileHeight) + (tileHeight / 2), tileWidth / 5, 0, 2 * Math.PI);
    ctx.fill();
  } else if (tileType === "bomb") {
    ctx.fillStyle = "red"
    ctx.fillRect(tile.x * tileWidth + (tileWidth / 4), tile.y * tileHeight + (tileHeight / 4), tileWidth / 2, tileHeight / 5); 
  }
}

// draws one player based on its data
function drawPlayer(player) {
  if (!player.isAlive) return;
    ctx.fillStyle = player.color
    ctx.beginPath();
    ctx.arc((player.x * tileWidth) + (tileWidth / 2), (player.y * tileHeight) + (tileHeight / 2), tileWidth / 3, 0, 2 * Math.PI);
    ctx.fill();
}

// draws over the previous position of the player so it looks like player has moved
function movePlayer(player, newX, newY) {
  // "draw over" the previous player's tile
  drawTile(tiles[player.y][player.x])
  player.x = newX
  player.y = newY
}



// EVENT LISTENER
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
      socket.send('bomb');
      break;
    case keyCodes.up:
      socket.send('move', 'up');
      break;
    case keyCodes.down:
      socket.send('move', 'down');
      break;
    case keyCodes.left:
      socket.send('move', 'left');
      break;
    case keyCodes.right:
      socket.send('move', 'right');
  }
}, false);
    
