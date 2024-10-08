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
    this.sendGameState();
  }

  moveRight(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.moveRight();
    this.sendGameState();
  }

  rotate(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.rotate();
    this.sendGameState();
  }

  moveDownOnce(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    let returnVal = player.moveDown();
    this.sendGameState();
    if (returnVal === null) return;
    if (player === null) return;
    if (player.socketId === this.player1.socketId && this.player2 !== null) {
      this.player2.appendLines(returnVal);
      return;
    }
    if (this.player2 !== null && player.socketId === this.player2.socketId) {
      this.player1.appendLines(returnVal);
      return;
    }
  }

  reverseRotate(socketId) {
    const player = this.findPlayer(socketId);
    if (player === null) return;
    player.reverseRotate();
    this.sendGameState();
  }

  fillEmptyPlayerPosition() {
    if (this.player1 === null && this.player2 === null) {
      for (const [socketId, player] of Object.entries(
        this.listOfPeopleInRoom
      )) {
        this.player1 = player;
        break;
      }
    }
    if (this.player1 === null) {
      if (this.player2 !== null) {
        this.player1 = this.player2;
        this.player2 = null;
      }
    }
    if (this.player2 === null) {
      for (const [socketId, player] of Object.entries(
        this.listOfPeopleInRoom
      )) {
        if (this.player1.socketId !== socketId) {
          this.player2 = player;
          break;
        }
      }
    }
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
      this.gameState = "waiting";
      this.player1 = null;
      this.fillEmptyPlayerPosition();
      this.gameState = "waiting";
      this.endGame();
    }
    if (this.player2 !== null && this.player2.socketId === socketId) {
      delete this.listOfPeopleInRoom[socketId];
      this.player2 = null;
      this.gameState = "waiting";
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
    let player1ReturnVal = null;
    let player2ReturnVal = null;
    if (this.player1 !== null) {
      player1ReturnVal = this.player1.moveDown();
    }
    if (this.player2 !== null) {
      player2ReturnVal = this.player2.moveDown();
    }
    if (player1ReturnVal === null && player2ReturnVal === null) return;
    if (player1ReturnVal !== null && this.player2 !== null)
      this.player2.appendLines(player1ReturnVal);
    if (player2ReturnVal !== null) this.player1.appendLines(player2ReturnVal);
    this.sendGameState();
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
        player1NextPiece: this.player1.returnNextPiece(),
        player2NextPiece: this.player2.returnNextPiece(),
        score1: `${this.player1.score}`,
        score2: `${this.player2.score}`,
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
        score1: `${this.player1.score}`,
        player1NextPiece: this.player1.returnNextPiece(),
        list: this.listOfPeopleInRoom,
      });
    }
  }

  startGame() {
    this.gameState = "started";
    this.roomSeed = Math.floor(Math.random() * 1000);
    if (this.player1 !== null) this.player1.resetBoard();
    if (this.player2 !== null) this.player2.resetBoard();
    if (this.player1 !== null) this.player1.generatePieces(this.roomSeed);
    if (this.player2 !== null) this.player2.generatePieces(this.roomSeed);
    this.io.to(this.room).emit("message", { message: this.gameState });
    const gameInterval = setInterval(() => {
      if (this.player1 && this.player1.checkLose()) {
        this.gameState = "ended";
        this.endGame();
        return;
      }
      if (this.player2 !== null) {
        if (this.player2.checkLose()) {
          this.gameState = "ended";
          this.endGame();
          return;
        }
      }
      this.gameLogic();
      this.sendGameState();
    }, 600);
    this.gameInterval.push(gameInterval);
  }

  endGame() {
    if (this.gameState === "ended") {
      if (this.player2 !== null) {
        this.io.to(this.room).emit("message", {
          message: this.gameState,
          winner: this.player1.checkLose()
            ? `${this.player2.name} wins`
            : `${this.player1.name} wins`,
          player1: this.player1.name,
          player2: this.player2.name,
        });
      } else {
        if (this.player1 !== null) {
          this.io.to(this.room).emit("message", {
            message: this.gameState,
            winner: `${this.player1.name} better luck next time! Your score was ${this.player1.score}`,
            player1: this.player1.name,
          });
        }
      }
    } else {
      this.gameState = "ended";
      if (this.player2 !== null) {
        this.io.to(this.room).emit("message", {
          message: this.gameState,
          player1: this.player1.name,
          player2: this.player2.name,
        });
      } else {
        if (this.player1 !== null) {
          this.io.to(this.room).emit("message", {
            message: this.gameState,
            player1: this.player1.name,
          });
        }
      }
    }
    for (let i = 0; i < this.gameInterval.length; i++) {
      clearInterval(this.gameInterval[i]);
    }
    this.gameInterval = [];
    this.gameState = "waiting";
    this.io.to(this.room).emit("message", { message: this.gameState });
    this.fillEmptyPlayerPosition();
    this.fillEmptyPlayerPosition();
    if (this.player1 !== null && this.player2 === null) {
      this.io.to(this.player1.socketId).emit("message", {
        message: "control_on",
        player1: this.player1.name,
      });
    } else if (this.player1 !== null && this.player2 !== null) {
      {
        this.io.to(this.player1.socketId).emit("message", {
          message: "control_on",
          player1: this.player1.name,
          player2: this.player2.name,
        });
        this.io.to(this.room).emit("message", {
          message: "connection",
          player1: this.player1.name,
          player2: this.player2.name,
        });
      }
    }
  }
}

module.exports = Game;
