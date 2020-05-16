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
    let gameState = game.getGameState();
    // emit gamestate to this socket
    socket.emit('game_state', gameState);
    game.addPlayer(socket.id);
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