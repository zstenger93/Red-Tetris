const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Game = require("./classes/Game");

// function checkRoomState(room, username, message) {
//     return;
// }

// function checkPlayerState(room, username, message){
//     return;
// }

// function checkGameBoardState(room, username, message){
//     return;
// }

// function checkCurrentPiece(room, username, message){

// }

// function createBitMask(username, message) {
//     bitMask16 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// }

var games = {};

const socketServer = http.createServer();
const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

var userSockets = {};
// socket connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("joinRoom", async ({ room, username }) => {
    socket.join(room);
    userSockets[socket.id] = { room, username };
    // console.log(`User '${username}' joined room '${room}'`);
    if (!games[room]) games[room] = new Game();
    games[room].addPlayer(username, socket.id);
    if (games[room].player1 !== null) {
      const playerSocket = io.sockets.sockets.get(games[room].player1.socketId);
      playerSocket.emit("message", { message: "control_on" });
    }
  });

  function messageParser(room, username, message) {
    console.log(message);
    if (message === "start") {
      console.log("Game start command received");
      return;
    }
  }
  // recive message
  socket.on("message", ({ room, message }) => {
    const username = userSockets[socket.id]?.username || "Anonymous";
    console.log(message);
    messageParser(room, username, message);
  });
  // disconeect
  socket.on("disconnect", () => {
    var user = userSockets[socket.id];
    if (user) {
      console.log(
        `User '${user.username}' disconnected from room '${user.room}'`
      );
      games[user.room].removePlayer(socket.id);
      if (games[user.room].player1 !== null) {
        const playerSocket = io.sockets.sockets.get(
          games[user.room].player1.socketId
        );
        playerSocket.emit("message", { message: "control_on" });
      }
      if (Object.keys(games[user.room].listOfPeopleInRoom).length === 0) {
        delete games[user.room];
        console.log("Room deleted");
      }
      delete userSockets[socket.id];
    } else {
      console.log("A user disconnected");
    }
  });
});

// listening socket
const SOCKET_PORT = 8080;
socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on http://localhost:${SOCKET_PORT}`);
});
