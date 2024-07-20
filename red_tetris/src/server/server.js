const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Game = require("./classes/Game");

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
  socket.on("joinRoom", async ({ room, username }) => {
    console.log(`User ${username} is joining room ${room}`);
    socket.join(room);
    userSockets[socket.id] = { room, username };
    if (!games[room]) games[room] = new Game(room, io);
    games[room].addPlayer(username, socket.id);
    if (games[room].player1 !== null && games[room].gameState === "waiting") {
      const playerSocket = io.sockets.sockets.get(games[room].player1.socketId);
      playerSocket.emit("message", { message: "control_on" });
    }
  });

  function messageParser(room, username, data) {
    console.log(`Message received from ${username} in room ${room}: ${data}`);
    if (data === "start") {
      games[room].startGame();
      io.to(room).emit("message", { username, message: "game_started" });
    }
  }

  // receive message
  socket.on("message", ({ room, message }) => {
    const username = userSockets[socket.id]?.username || "Anonymous";
    const userRoom = userSockets[socket.id]?.room || room;
    messageParser(userRoom, username, message);
  });

  // disconnect
  socket.on("disconnect", () => {
    var user = userSockets[socket.id];
    if (user) {
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
