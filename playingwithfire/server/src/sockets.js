exports.io = undefined; // Will be initialized in the exports.init function
const Game = require("./game/game");
let game = new Game();
let sockets = []


exports.init = ({ io }) => {
    exports.io = io;

    exports.io.on('connection', (socket) => {
        newConnection(socket);

        socket.on('disconnect', () => {
            removeConnection(socket);
        });

        socket.on('move', (direction) => {
            game.movePlayer(socket.id, direction);
        });

        socket.on('bomb', () => {
            game.placeBomb(socket.id);
        })

        socket.on('start_game', () => {
            console.log("HBABJAKJBA")
            sockets.forEach((id) => {
                game.addPlayer(id);
            });
            game.startGame();
            let gameState = game.getGameState();
            exports.io.emit("game_state", gameState);
        })
    })
}

function newConnection(socket) {
    console.log(`New socket id=${socket.id}`);
    let gameState = game.getGameState();
    // emit gamestate to this socket
    socket.emit('game_state', gameState);
    //game.addPlayer(socket.id);
    sockets.push(socket.id);
}

function removeConnection(socket) {
    game.removePlayer(socket.id);
    sockets = sockets.filter(s => s !== socket.id);
}

exports.removePlayer = (player) => {
    exports.io.emit("remove_player", player)
}

exports.addPlayer = (player) => {
    exports.io.emit("new_player", player);
}

exports.movePlayer = (id, newX, newY) => {
    exports.io.emit("player_move", id, newX, newY)
}

exports.explosion = (explCoords) => {
    exports.io.emit("explosion", explCoords)
}

exports.madeNotDeadly = (explCoords) => {
    console.log("socky")
    exports.io.emit("made_not_deadly", explCoords)
}

exports.powerup = (type, x ,y) => {
    console.log("emit powerup", type)
    exports.io.emit("powerup", type, x, y)
}

exports.takePowerup = (x, y) => {
    console.log("powerup taken")
    exports.io.emit("take_powerup", x, y)
}

exports.gameOver = (playerId) => {
    exports.io.emit("game_over", playerId);
    game = new Game();
}