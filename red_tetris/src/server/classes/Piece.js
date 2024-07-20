class Piece {
  constructor() {
    this.name = 0;
    this.rotation = 0;
    this.shape = [];
  }

  rotate() {
    this.rotation = (this.rotation + 1) % 4;
    this.shape = this.shape.map((row, i) =>
      row.map((val, j) => this.shape[j][3 - i])
    );
  }

  reverseRotate() {
    this.rotation = (this.rotation - 1) % 4;
    this.shape = this.shape.map((row, i) =>
      row.map((val, j) => this.shape[3 - j][i])
    );
  }

  debug() {
    console.log(this.shape);
  }

  getShape() {
    return this.shape;
  }
}

class LPiece extends Piece {
  constructor() {
    super();
    this.name = 1;
    this.rotation = 0;
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
    this.rotation = 0;
    this.shape = [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
}

class ZPiece extends Piece {
  constructor() {
    super();
    this.name = 3;
    this.rotation = 0;
    this.shape = [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
  }
}

class SPiece extends Piece {
  constructor() {
    super();
    this.name = 4;
    this.rotation = 0;
    this.shape = [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
  }
}

class OPiece extends Piece {
  constructor() {
    super();
    this.name = 5;
    this.rotation = 0;
    this.shape = [
      [1, 1],
      [1, 1],
    ];
  }
}

class TPiece extends Piece {
  constructor() {
    super();
    this.name = 6;
    this.rotation = 0;
    this.shape = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
}

class IPiece extends Piece {
  constructor() {
    super();
    this.name = 7;
    this.rotation = 0;
    this.shape = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
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
};
