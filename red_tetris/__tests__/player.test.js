const Player = require("../src/server/classes/Player");
const { LPiece } = require("../src/server/classes/Piece");

describe("initGameBoard", () => {
  test("initializes a 20x10 game board filled with 0s", () => {
    const player = new Player();
    player.initGameBoard();
    const expectedBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
    expect(player.gameBoard).toEqual(expectedBoard);
  });
});

describe("Player piece management", () => {
  let player;
  beforeEach(() => {
    player = new Player();
    player.initGameBoard();
    player.verticalPosition = 5;
    player.horizontalPosition = 4;
  });

  test("updatePiece should update the current piece", () => {
    const newPiece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "red",
    };
    player.updatePiece(newPiece);
    expect(player.currentPiece).toEqual(newPiece);
  });

  describe("registerPiece", () => {
    test("should register the current piece on the board", () => {
      const pieceShape = [
        [1, 1],
        [1, 1],
      ];
      const piece = { shape: pieceShape, color: "red" };
      player.updatePiece(piece);
      player.registerPiece();

      expect(player.board[5][4]).toBe(1);
      expect(player.board[5][5]).toBe(1);
      expect(player.board[6][4]).toBe(1);
      expect(player.board[6][5]).toBe(1);
    });

    test("should set isAlive to false if piece is registered at the top of the board", () => {
      player.verticalPosition = 0;
      const pieceShape = [
        [1, 1],
        [1, 1],
      ];
      const piece = { shape: pieceShape, color: "red" };
      player.updatePiece(piece);
      player.registerPiece();

      expect(player.isAlive).toBe(false);
    });
  });
});

describe("Player class tests", () => {
  let player;

  beforeEach(() => {
    player = new Player("TestPlayer", "socketId1");
  });

  test("Player initialization", () => {
    expect(player.name).toBe("TestPlayer");
    expect(player.socketId).toBe("socketId1");
    expect(player.score).toBe(0);
    expect(player.board.length).toBe(20);
    expect(player.board[0].length).toBe(10);
    expect(player.isAlive).toBe(true);
    expect(player.verticalPosition).toBe(-1);
    expect(player.horizontalPosition).toBe(4);
  });

  test("resetBoard should reset the player board and score", () => {
    player.score = 100;
    player.resetBoard();
    expect(player.score).toBe(0);
    expect(player.board.every((row) => row.every((cell) => cell === 0))).toBe(
      true
    );
  });

  test("checkAndRemoveLines with no complete lines", () => {
    expect(player.checkAndRemoveLines()).toBeNull();
  });

  test("checkAndRemoveLines with complete lines", () => {
    player.board[19] = Array(10).fill(1);
    expect(player.checkAndRemoveLines()).toBe(1);
    expect(player.board[0].every((cell) => cell === 0)).toBe(true);
  });

  test("generateSeedValue should generate consistent seed values", () => {
    const seedValue = player.generateSeedValue(0, 1);
    expect(seedValue).toBeLessThan(7);
    expect(seedValue).toBeGreaterThanOrEqual(0);
  });

  test("generatePieces should update current and next piece", () => {
    player.generatePieces(0);
    expect(player.currentPiece).not.toBeNull();
    expect(player.nextPiece).not.toBeNull();
  });

  test("addScore should increase player score", () => {
    player.addScore(100);
    expect(player.score).toBe(100);
  });

  test("moveLeft without collision", () => {
    player.currentPiece = new LPiece();
    player.horizontalPosition = 6;
    expect(player.moveLeft()).toBe(false);
    expect(player.horizontalPosition).toBe(6);
  });

  test("moveRight without collision", () => {
    player.currentPiece = new LPiece();
    player.horizontalPosition = 6;
    expect(player.moveRight()).toBe(false);
    expect(player.horizontalPosition).toBe(6);
  });

  test("rotate without collision", () => {
    player.currentPiece = new LPiece();
    player.horizontalPosition = 4;
    player.verticalPosition = 0;
    expect(player.rotate()).toBe(true);
  });

  test("moveDown without collision", () => {
    player.currentPiece = new LPiece();
    const result = player.moveDown();
    expect(result).toBeNull();
    expect(player.verticalPosition).toBe(0);
  });

  test("checkCollision with collision", () => {
    player.currentPiece = new LPiece();
    player.verticalPosition = 19;
    expect(
      player.checkCollision(
        player.board,
        player.currentPiece.shape,
        player.verticalPosition + 1,
        player.horizontalPosition
      )
    ).toBe(true);
  });

  test("checkLose initially false", () => {
    expect(player.checkLose()).toBe(false);
  });

  test("checkLose after death", () => {
    player.isAlive = false;
    expect(player.checkLose()).toBe(true);
  });

  describe("Player piece management", () => {
    let player;
    beforeEach(() => {
      player = new Player();
      player.initGameBoard();
      player.verticalPosition = 5;
      player.horizontalPosition = 4;
    });

    test("updatePiece should update the current piece", () => {
      const newPiece = {
        shape: [
          [1, 1],
          [1, 1],
        ],
        color: "red",
      };
      player.updatePiece(newPiece);
      expect(player.currentPiece).toEqual(newPiece);
    });

    describe("registerPiece", () => {
      test("should register the current piece on the board", () => {
        const pieceShape = [
          [1, 1],
          [1, 1],
        ];
        const piece = { shape: pieceShape, color: "red" };
        player.updatePiece(piece);
        player.registerPiece();

        expect(player.board[5][4]).toBe(1);
        expect(player.board[5][5]).toBe(1);
        expect(player.board[6][4]).toBe(1);
        expect(player.board[6][5]).toBe(1);
      });

      test("should set isAlive to false if piece is registered at the top of the board", () => {
        player.verticalPosition = 0;
        const pieceShape = [
          [1, 1],
          [1, 1],
        ];
        const piece = { shape: pieceShape, color: "red" };
        player.updatePiece(piece);
        player.registerPiece();

        expect(player.isAlive).toBe(false);
      });
    });
  });
});

describe("Board and Overlay Representation", () => {
  let player;
  beforeEach(() => {
    player = new Player();
    player.initGameBoard();
    global.columnNames = ["K", "A", "R", "T", "U", "P", "E", "L", "I", "S"];
    global.rowNames = [
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
    player.currentPiece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "red",
    };
    player.verticalPosition = 5;
    player.horizontalPosition = 4;
  });

  test("returnBoard should return a string representation of the board", () => {
    let expectedString = "";
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        expectedString += "0" + columnNames[j] + rowNames[i];
      }
    }
    expect(player.returnBoard()).toEqual(expectedString);
  });

  test("returnOverlay should return a string representation of the current piece overlay on the board", () => {
    let expectedString = "";
    for (let i = 0; i < player.currentPiece.shape.length; i++) {
      for (let j = 0; j < player.currentPiece.shape[i].length; j++) {
        if (player.currentPiece.shape[i][j] === 0) continue;
        expectedString +=
          "1" +
          columnNames[j + player.horizontalPosition] +
          rowNames[i + player.verticalPosition];
      }
    }
    expect(player.returnOverlay()).toEqual(expectedString);
  });
});

describe("Player actions", () => {
  let player;
  let mockBoard;
  let mockPiece;

  beforeEach(() => {
    mockBoard = Array(20)
      .fill()
      .map(() => Array(10).fill(0));
    mockPiece = {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
      rotate: jest.fn(),
      reverseRotate: jest.fn(),
    };
    player = new Player();
    player.board = mockBoard;
    player.currentPiece = mockPiece;
  });

  describe("reverseRotate", () => {
    it("should not rotate if there is no current piece", () => {
      player.currentPiece = null;
      expect(player.reverseRotate()).toBeUndefined();
      expect(mockPiece.reverseRotate).not.toHaveBeenCalled();
    });

    it("should reverse rotate the current piece", () => {
      player.reverseRotate();
      expect(mockPiece.reverseRotate).toHaveBeenCalled();
    });

    it("should rotate back if there is a collision after reverse rotation", () => {
      player.checkCollision = jest.fn().mockReturnValue(true);
      const result = player.reverseRotate();
      expect(mockPiece.rotate).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should not rotate back if there is no collision after reverse rotation", () => {
      player.checkCollision = jest.fn().mockReturnValue(false);
      const result = player.reverseRotate();
      expect(mockPiece.rotate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe("appendLines", () => {
    it("should append specified number of lines to the board", () => {
      const initialBoardLength = player.board.length;
      const linesToAdd = 3;
      player.appendLines(linesToAdd);
      expect(player.board.length).toBe(initialBoardLength);
      for (let i = 0; i < linesToAdd; i++) {
        expect(player.board[initialBoardLength - linesToAdd + i]).toEqual(
          Array(10).fill(8)
        );
      }
    });
  });
});

describe("moveDown method", () => {
  let player;

  beforeEach(() => {
    player = new Player();
    player.currentPiece = { shape: [[1]], position: { x: 0, y: 0 } };
    player.board = Array(20)
      .fill()
      .map(() => Array(10).fill(0));
    player.isAlive = true;
    player.currentPieceIndex = 0;
    player.seed = 0;
    player.verticalPosition = 0;
    player.horizontalPosition = 4;

    player.checkCollision = jest.fn();
    player.registerPiece = jest.fn();
    player.checkAndRemoveLines = jest.fn();
    player.generatePieces = jest.fn();
  });

  it("should return null if currentPiece is null", () => {
    player.currentPiece = null;
    expect(player.moveDown()).toBeNull();
  });

  it("should move the piece down if there is no collision", () => {
    player.checkCollision.mockReturnValue(false);
    expect(player.moveDown()).toBeNull();
    expect(player.verticalPosition).toBe(1);
  });

  it("should register piece, check and remove lines, and generate new piece if there is a collision", () => {
    player.checkCollision.mockReturnValue(true);
    player.checkAndRemoveLines.mockReturnValue("someValue");

    const returnValue = player.moveDown();

    expect(player.registerPiece).toHaveBeenCalled();
    expect(player.checkAndRemoveLines).toHaveBeenCalled();
    expect(player.currentPieceIndex).toBe(1);
    expect(player.generatePieces).toHaveBeenCalledWith(player.seed);
    expect(player.verticalPosition).toBe(-1);
    expect(player.horizontalPosition).toBe(4);
    expect(returnValue).toBe("someValue");
  });

  it("should return null and not proceed if the player is not alive after checking and removing lines", () => {
    player.checkCollision.mockReturnValue(true);
    player.checkAndRemoveLines.mockReturnValue("someValue");
    player.isAlive = false;

    const returnValue = player.moveDown();

    expect(returnValue).toBeNull();
    expect(player.currentPieceIndex).toBe(0);
  });
});