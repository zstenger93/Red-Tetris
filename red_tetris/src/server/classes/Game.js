const Player = require("./Player");

class Game {
  constructor(room, io) {
    this.listOfPeopleInRoom = {};
    this.player1 = null;
    this.player2 = null;
    this.gameState = "waiting";
    this.room = room;
    this.io = io;
    console.log("Game created");
  }

  addPlayer(name, socketId) {
    this.listOfPeopleInRoom[socketId] = new Player(name, socketId);
    if (this.player1 === null) this.player1 = this.listOfPeopleInRoom[socketId];
    else if (this.player2 === null)
      this.player2 = this.listOfPeopleInRoom[socketId];
    this.peopleInRoomCount++;
  }

  removePlayer(socketId) {
    if (this.player1 !== null && this.player1.socketId === socketId) {
      delete this.listOfPeopleInRoom[socketId];
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
    this.io.to(this.roomName).emit("message", { message: this.gameState });
    setInterval(() => {
      this.gameLogic();
      this.io.to(this.roomName).emit("message", { message: this.gameState });
      
    }, 1000);
  }

  listenToControls() {}

  endGame() {
    this.gameState = "ended";
  }
}

module.exports = Game;
