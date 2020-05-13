exports.io = undefined; // Will be initialized in the exports.init function
const Game = require("./game/game");
const sockets = {};
let game = new Game();

exports.init = ({ io }) => {
    exports.io = io;

    exports.io.on("connection", (socket) => {
        console.log(`New socket id=${socket.id}`);
        game.addPlayer(socket.id);

        socket.on('disconnect', () => {
            game.removePlayer(socket.id);
        });

        socket.on('move', (direction) => {
            game.movePlayer(socket.id, direction);
        });
    }) 
}
