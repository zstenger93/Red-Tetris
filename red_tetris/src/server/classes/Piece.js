class Piece {
  constructor() {
    this.name = 0;
    this.shape = [];
  }

  rotate() {
    const len = this.shape.length;
    let tempShape = Array.from({ length: len }, () => Array(len).fill(0));

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        tempShape[j][len - 1 - i] = this.shape[i][j];
      }
    }

    this.shape = tempShape;
  }

  reverseRotate() {
    const len = this.shape.length;
    let tempShape = Array.from({ length: len }, () => Array(len).fill(0));

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        tempShape[len - 1 - j][i] = this.shape[i][j];
      }
    }

    this.shape = tempShape;
  }
}

class LPiece extends Piece {
  constructor() {
    super();
    this.name = 1;
    this.shape = [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
}

class JPiece extends Piece {
  constructor() {
    super();
    this.name = 2;
    this.shape = [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0],
    ];
  }
}

class ZPiece extends Piece {
  constructor() {
    super();
    this.name = 3;
    this.shape = [
      [3, 3, 0],
      [0, 3, 3],
      [0, 0, 0],
    ];
  }
}

class SPiece extends Piece {
  constructor() {
    super();
    this.name = 4;
    this.shape = [
      [0, 4, 4],
      [4, 4, 0],
      [0, 0, 0],
    ];
  }
}

class OPiece extends Piece {
  constructor() {
    super();
    this.name = 5;
    this.shape = [
      [5, 5],
      [5, 5],
    ];
  }
}

class TPiece extends Piece {
  constructor() {
    super();
    this.name = 6;
    this.shape = [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0],
    ];
  }
}

class IPiece extends Piece {
  constructor() {
    super();
    this.name = 7;
    this.shape = [
      [0, 0, 0, 0],
      [7, 7, 7, 7],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

module.exports = {
  LPiece,
  JPiece,
  ZPiece,
  SPiece,
  OPiece,
  TPiece,
  IPiece,
  Piece,
};
