exports.io = undefined; // Will be initialized in the exports.init function
const Game = require("./game/game");
let game = new Game();


exports.init = ({ io }) => {
    exports.io = io;

    exports.io.on("connection", (socket) => {
        newConnection(socket);

        socket.on('disconnect', () => {
            game.removePlayer(socket.id);
        });

        socket.on('move', (direction) => {
            console.log(`move action ${direction}`);
            game.movePlayer(socket.id, direction);
        });

        socket.on('bomb', () => {
            console.log("bomb has been placed omg");
            game.placeBomb(socket.id);
        })
    })
}

async function newConnection(socket) {
    console.log(`New socket id=${socket.id}`);
    game.addPlayer(socket.id);
    // emit gamestate to this socket
    let gameState = game.getGameState();
    socket.emit('game_state', gameState);
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