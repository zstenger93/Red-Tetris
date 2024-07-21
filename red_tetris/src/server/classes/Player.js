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
    this.verticalPosition = -1;
    this.horizontalPosition = 4;
    this.seed = 0;
  }

  resetBoard() {
    this.score = 0;
    this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
    this.currentPiece = null;
    this.nextPiece = null;
    this.isAlive = true;
    this.currentPiece = null;
    this.currentPieceIndex = 0;
    this.gameBoard = [];
    this.verticalPosition = -1;
    this.horizontalPosition = 4;
    this.seed = 0;
  }

  checkAndRemoveLines() {
    let linesToRemove = [];
    for (let i = 0; i < this.board.length; i++) {
      let line = this.board[i];
      let isLine = true;
      for (let j = 0; j < line.length; j++) {
        if (line[j] === 0 || line[j] === 9) {
          isLine = false;
          break;
        }
      }
      if (isLine) {
        linesToRemove.push(i);
      }
    }
    for (let i = 0; i < linesToRemove.length; i++) {
      this.board.splice(linesToRemove[i], 1);
      this.board.unshift(Array(10).fill(0));
    }
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
          if (this.verticalPosition <= 0) {
            this.isAlive = false;
            return;
          }
          this.board[i + this.verticalPosition][j + this.horizontalPosition] =
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

  moveLeft() {
    if (this.currentPiece === null) return;
    if (
      this.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.verticalPosition,
        this.horizontalPosition - 1
      )
    ) {
      return false;
    }
    this.horizontalPosition -= 1;
    return true;
  }

  moveRight() {
    if (this.currentPiece === null) return;
    if (
      this.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.verticalPosition,
        this.horizontalPosition + 1
      )
    ) {
      return false;
    }
    this.horizontalPosition += 1;
    return true;
  }

  rotate() {
    if (this.currentPiece === null) return;
    this.currentPiece.rotate();
    if (
      this.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.verticalPosition,
        this.horizontalPosition
      )
    ) {
      this.currentPiece.reverseRotate();
      return false;
    }
    return true;
  }

  reverseRotate() {
    if (this.currentPiece === null) return;
    this.currentPiece.reverseRotate();
    if (
      this.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.verticalPosition,
        this.horizontalPosition
      )
    ) {
      this.currentPiece.rotate();
      return false;
    }
    return true;
  }

  moveDown() {
    if (this.currentPiece === null) {
      return;
    }

    if (
      this.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.verticalPosition + 1,
        this.horizontalPosition
      )
    ) {
      this.registerPiece();
      this.checkAndRemoveLines();
      if (!this.isAlive) return;
      this.currentPieceIndex += 1;
      this.generatePieces(this.seed);
      this.verticalPosition = -1;
      this.horizontalPosition = 4;
      return;
    }
    this.verticalPosition += 1;
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
        if (this.verticalPosition + i < 0) continue;
        if (this.currentPiece.shape[i][j] === 0) continue;
        returnMessage +=
          this.currentPiece.shape[i][j] +
          collumnNames[j + this.horizontalPosition] +
          rowNames[i + this.verticalPosition];
      }
    }
    return returnMessage;
  }

  checkLose() {
    if (!this.isAlive) {
      return true;
    }
    return false;
  }
}

module.exports = Player;
