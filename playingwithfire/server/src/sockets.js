exports.io = undefined; // Will be initialized in the exports.init function
const Game = require("./game/game");
let game = new Game();
let sockets = []


// setup different actions to take based on client emits
exports.init = ({ io }) => {
    exports.io = io;

    exports.io.on('connection', (socket) => {
        newConnection(socket);

        socket.on('disconnect', () => {
            removeConnection(socket);
        });

        socket.on("message", (type, payload) => {
            if (type === "move") game.movePlayer(socket.id, payload);
            else if (type === "bomb") game.placeBomb(socket.id);
            else if (type === "start_game") {
                sockets.forEach((id) => {
                    game.addPlayer(id);
                });
                game.startGame();
                let gameState = game.getGameState();
                exports.io.send("game_state", JSON.stringify(gameState));
            }
        })
    })
}

function newConnection(socket) {
    console.log(`New socket id=${socket.id}`);
    let gameState = game.getGameState();
    // emit gamestate to this socket
    socket.send('game_state', JSON.stringify(gameState));
    sockets.push(socket.id);
}

function removeConnection(socket) {
    game.removePlayer(socket.id);
    sockets = sockets.filter(s => s !== socket.id);
}


// emits from the game that update the gamescreen for the clients
exports.removePlayer = (player) => {
    exports.io.send("remove_player", JSON.stringify(player));
}

exports.addPlayer = (player) => {
    exports.io.send("new_player", JSON.stringify(player))
}

exports.movePlayer = (id, newX, newY) => {
    let payload = JSON.stringify({
        id: id,
        x: newX,
        y: newY,
    });
    exports.io.send("player_move", payload);
}

exports.explosion = (explCoords) => {
    exports.io.send("explosion", JSON.stringify(explCoords))
}

exports.madeNotDeadly = (explCoords) => {
    exports.io.send("made_not_deadly", JSON.stringify(explCoords))
}

exports.gameOver = (playerId) => {
    if(game.isActive) {
        game.isActive = false
        exports.io.send("game_over", playerId);
        game = new Game()
    }
}

// for updating a tile with a specific item
exports.updateTile = (item, x, y) => {
    let payload = JSON.stringify({
        item,
        x,
        y
    })
    exports.io.send("update_tile", payload)
}