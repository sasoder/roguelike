
const express = require('express')
const http = require("http");

const app = express()
const port = 3000
// Express usually does this for us, but socket.io needs the httpServer directly
const httpServer = http.Server(app);
const io = require("socket.io").listen(httpServer);


/*  ------  ***  ------   SETUP SESSION   ------  ***  ------  */
const expressSession = require('express-session');

const session = expressSession({
  secret: 'Super secret! Shh! Don\'t tell anyone...',
  // TODO: Necessary to change?
  resave: true,
  // TODO: Necessary to change?
  saveUninitialized: true,
  // "This is typically used in conjuction with short, non-session-length maxAge values to provide a quick
  // timeout of the session data with reduced potentional of it occurring during on going server interactions.""
  rolling: true,
});
app.use(session);

const socketIOSession = require('express-socket.io-session')
io.use(socketIOSession(session, {
  autoSave: true,
  saveUninitialized: true,
}));
/* ----------------------------------------------------------- */
/* -------------------- Setup Logging --------------------- */
const betterLogging = require("better-logging");
// enhances log messages with timestamps etc
betterLogging.default(console, {
  stampColor: Color => Color.Light_Green,
  typeColors: Color => ({
    log: Color.Light_Green
  })
});
console.loglevel = 4; // Enables debug output

app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true },
    path: { show: true },
    body: { show: true }
  })
);
  
// This is a middleware that parses the body of the request into a javascript object.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* ------------------------------------------------------------ */


/* ------------- SET-UP SOCKETS -------------------------------- */
const sockets = require("./sockets.js");
sockets.init({ io });
/* ------------------------------------------------------------ */

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  
});

// Start server
httpServer.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});