var socket = io.connect("http://localhost:3000");
var lastDownTarget, canvas;

window.onload = function() {
    canvas = document.getElementById('canvas');

    document.addEventListener('mousedown', function(event) {
        lastDownTarget = event.target;
    }, false);

    document.addEventListener('keyup', function(event) {
        if(lastDownTarget == canvas) {
            socket.emit('move', 'up');
        }
    }, false);
}