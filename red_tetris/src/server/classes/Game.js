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
    console.log("Game created");
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

  gameLogic() {}

  startGame() {
    this.gameState = "started";
    this.io.to(this.room).emit("message", { message: this.gameState });
    const gameInterval = setInterval(() => {
      this.gameLogic();
      if (this.player2 !== null) {
        this.io.to(this.room).emit("message", {
          message: this.gameState,
          board1: this.player1.returnBoard(),
          board2: this.player2.returnBoard(),
          player1: this.player1.name,
          player2: this.player2.name,
          list: this.listOfPeopleInRoom,
        });
      } else {
        this.io.to(this.room).emit("message", {
          message: this.gameState,
          board1: this.player1.returnBoard(),
          board2: "null",
          player1: this.player1.name,
          list: this.listOfPeopleInRoom,
        });
      }
    }, 1000);
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
