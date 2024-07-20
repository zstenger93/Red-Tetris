const {
  LPiece,
  JPiece,
  ZPiece,
  SPiece,
  OPiece,
  TPiece,
  IPiece,
} = require("./Piece");

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
const pieces = [LPiece, JPiece, ZPiece, SPiece, OPiece, TPiece, IPiece];

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
    this.currentPieceIndex = 0;
    this.gameBoard = [];
    this.vertialPosition = 2;
    this.horizontalPosition = 5;
    this.seed = 0;
  }

  generateSeedValue(seed, input) {
    return (((seed + input) * 9301 + 49297) % 233280) % pieces.length;
  }

  generatePieces(seed) {
    this.seed = seed;
    let piece1 = this.generateSeedValue(seed, this.currentPieceIndex);
    let piece2 = this.generateSeedValue(seed, this.currentPieceIndex + 1);
    this.currentPiece = new pieces[piece1]();
    this.nextPiece = new pieces[piece2]();
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

  registerPiece() {
    for (let i = 0; i < this.currentPiece.shape.length; i++) {
      for (let j = 0; j < this.currentPiece.shape[i].length; j++) {
        if (this.currentPiece.shape[i][j] !== 0) {
          this.board[i + this.vertialPosition][j + this.horizontalPosition] =
            this.currentPiece.shape[i][j];
        }
      }
    }
  }

  checkCollision(board, shape, offsetX, offsetY) {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] !== 0) {
          if (
            i + offsetX < 0 ||
            i + offsetX >= board.length ||
            j + offsetY < 0 ||
            j + offsetY >= board[i + offsetX].length
          ) {
            return true;
          }
          if (board[i + offsetX][j + offsetY] === undefined) return true;
          if (board[i + offsetX][j + offsetY] !== 0) return true;
        }
      }
    }
    return false;
  }

  moveDown() {
    if (this.currentPiece === null) {
      return;
    }

    if (
      this.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.vertialPosition + 1,
        this.horizontalPosition
      )
    ) {
      this.registerPiece();
      this.currentPieceIndex += 1;
      this.generatePieces(this.seed);
      this.vertialPosition = 0;
      return;
    }
    this.vertialPosition += 1;
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

  returnOverlay() {
    let returnMessage = "";
    for (let i = 0; i < this.currentPiece.shape.length; i++) {
      for (let j = 0; j < this.currentPiece.shape[i].length; j++) {
        returnMessage +=
          this.currentPiece.shape[i][j] +
          collumnNames[j + this.horizontalPosition] +
          rowNames[i + this.vertialPosition];
      }
    }
    return returnMessage;
  }
}

module.exports = Player;
