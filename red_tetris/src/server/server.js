const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Game = require("./classes/Game");
require("dotenv").config();

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
    socket.join(room);
    userSockets[socket.id] = { room, username };
    if (!games[room]) games[room] = new Game(room, io);
    games[room].addPlayer(username, socket.id);
    if (games[room].player1 !== null && games[room].gameState === "waiting") {
      const playerSocket = io.sockets.sockets.get(games[room].player1.socketId);
      if (playerSocket) {
        playerSocket.emit("message", {
          message: "control_on",
          player1: games[room].player1.name,
        });
      }
    }
  });

  function messageParser(room, username, data) {
    if (data === "start") {
      if (games[room].gameState !== "waiting") return;
      games[room].startGame();
      io.to(room).emit("message", { username, message: "game_started" });
    }
    if (data === "move_left") games[room].moveLeft(socket.id);
    if (data === "move_right") games[room].moveRight(socket.id);
    if (data === "rotate") games[room].rotate(socket.id);
    if (data === "reverse_rotate") games[room].reverseRotate(socket.id);
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
        if (playerSocket) {
          if (games[user.room].player2 === socket.id) {
            games[user.room].endGame();
            playerSocket.emit("message", {
              message: "control_on",
              player1: games[user.room].player1.name,
            });
          }
        }
      }
      if (Object.keys(games[user.room].listOfPeopleInRoom).length === 0) {
        games[user.room].endGame();
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
const SOCKET_PORT = process.env.SOCKET_PORT || 8080;
const IP = process.env.IP || "localhost";
socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on http://${IP}:${SOCKET_PORT}`);
});
