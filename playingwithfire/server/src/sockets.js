exports.io = undefined; // Will be initialized in the exports.init function
const Game = require("./game/game");
let game = new Game();

const buckets = {};
const BUCKETSIZE = 10;

exports.init = ({ io }) => {
    exports.io = io;

    exports.io.on("connection", (socket) => {
        newConnection(socket.id);

        socket.on('disconnect', () => {
            game.removePlayer(socket.id);
        });

        socket.on('move', (direction) => {
            console.log(`move action ${direction}`);
            game.movePlayer(socket.id, direction);
        });
    }) 
}

async function newConnection(sessionId) {
    console.log(`New socket id=${sessionId}`);
    game.addPlayer(sessionId);
    buckets[sessionId] = 10;
}