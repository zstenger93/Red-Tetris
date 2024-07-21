const Player = require("./Player");

class Game {
  constructor(room, io) {
    this.listOfPeopleInRoom = {};
    this.player1 = null;
    this.player2 = null;
    this.gameState = "waiting";
    this.room = room;
    this.io = io;
    this.gameInterval = [];
    this.roomSeed = Math.floor(Math.random() * 1000);
    console.log("Game created");
  }

  findPlayer(socketId) {
    if (this.player1 !== null && this.player1.socketId === socketId) {
      return this.player1;
    }
    if (this.player2 !== null && this.player2.socketId === socketId) {
      return this.player2;
    }
    return null;
  }

  moveLeft(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.moveLeft();
  }

  moveRight(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.moveRight();
  }

  rotate(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.rotate();
  }

  reverseRotate(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.reverseRotate();
  }

  addPlayer(name, socketId) {
    this.listOfPeopleInRoom[socketId] = new Player(name, socketId);
    if (this.player1 === null) this.player1 = this.listOfPeopleInRoom[socketId];
    else if (this.player2 === null && this.gameState === "waiting")
      this.player2 = this.listOfPeopleInRoom[socketId];
  }

  removePlayer(socketId) {
    if (this.player1 !== null && this.player1.socketId === socketId) {
      delete this.listOfPeopleInRoom[socketId];
      if (this.player2 == null) {
        this.endGame();
        this.gameState = "waiting";
      }
      this.player1 = this.player2;
      this.player2 = null;
    }
    if (this.player2 !== null && this.player2.socketId === socketId) {
      delete this.listOfPeopleInRoom[socketId];
      this.player2 = null;
      this.endGame();
    } else {
      delete this.listOfPeopleInRoom[socketId];
      return;
    }
    if (this.player2 === null) {
      for (const [socketId, player] of Object.entries(
        this.listOfPeopleInRoom
      )) {
        if (this.player2 === null && this.player1.socketId !== socketId) {
          this.player2 = player;
          break;
        }
      }
    }
  }

  gameLogic() {
    if (this.player1 !== null) {
      this.player1.moveDown();
    }
    if (this.player2 !== null) {
      this.player2.moveDown();
    }
  }

  sendGameState() {
    if (this.player2 !== null) {
      this.io.to(this.room).emit("message", {
        message: this.gameState,
        board1: this.player1.returnBoard(),
        board2: this.player2.returnBoard(),
        overlay1: this.player1.returnOverlay(),
        overlay2: this.player2.returnOverlay(),
        player1: this.player1.name,
        player2: this.player2.name,
        list: this.listOfPeopleInRoom,
      });
    } else {
      this.io.to(this.room).emit("message", {
        message: this.gameState,
        board1: this.player1.returnBoard(),
        overlay1: this.player1.returnOverlay(),
        overlay2: "null",
        board2: "null",
        player1: this.player1.name,
        list: this.listOfPeopleInRoom,
      });
    }
  }

  startGame() {
    this.gameState = "started";
    this.roomSeed = Math.floor(Math.random() * 1000);
    if (this.player1 !== null) this.player1.generatePieces(this.roomSeed);
    if (this.player2 !== null) this.player2.generatePieces(this.roomSeed);
    this.io.to(this.room).emit("message", { message: this.gameState });
    const gameInterval = setInterval(() => {
      if (this.player1.checkLose()) {
        this.endGame();
        return;
      }
      if (this.player2 !== null) {
        if (this.player2.checkLose()) {
          this.endGame();
          return;
        }
      }
      this.gameLogic();
      this.sendGameState();
    }, 100);
    this.gameInterval.push(gameInterval);
  }

  listenToControls() {}

  endGame() {
    this.gameState = "ended";
    for (let i = 0; i < this.gameInterval.length; i++) {
      clearInterval(this.gameInterval[i]);
    }
    this.gameInterval = [];
    this.gameState = "waiting";
  }
}

module.exports = Game;
