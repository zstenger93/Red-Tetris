const Piece = require("./Piece");

collumnNames = ["K", "A", "R", "T", "U", "P", "E", "L", "I", "S"];
rowNames = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
];

class Player {
  constructor(name, socketId) {
    this.name = name;
    this.socketId = socketId;
    this.score = 0;
    this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
    this.currentPiece = null;
    this.nextPiece = null;
    this.isAlive = true;
    this.currentPiece = null;
    this.gameBoard = [];
  }

  initGameBoard() {
    this.gameBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
  }

  addScore(score) {
    this.score += score;
  }

  updatePiece(piece) {
    this.currentPiece = piece;
  }

  returnBoard() {
    let returnMessage = "";
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        returnMessage += this.board[i][j] + collumnNames[j] + rowNames[i];
      }
    }
    return returnMessage;
  }
}

module.exports = Player;
