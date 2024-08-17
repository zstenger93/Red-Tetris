const {
  createGameBoard,
  removeGameBoard,
  parseMessage,
  colorTheGameField,
  drawOverlay,
  coolMode,
} = require("../src/client/js/client");
const { JSDOM } = require("jsdom");
const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

describe("Game Board Functions", () => {
  beforeEach(() => {
    document.getElementById.mockClear();
    global.io.mockClear();
  });

  it("should create a game board", () => {
    createGameBoard(20, 10);
    expect(document.getElementById).toHaveBeenCalledWith("tetrisBoard");
    expect(document.createElement).toHaveBeenCalledTimes(421);
  });

  it("should remove the game board", () => {
    removeGameBoard();
    const board = document.getElementById("tetrisBoard");
    expect(board.innerHTML).toBe("");
  });

  it('should display the start button when "control_on" message is received', () => {
    const mockSocket = { emit: jest.fn() };
    parseMessage({ message: "control_on" }, mockSocket);
    const startButton = document.getElementById("startButton");
    expect(startButton);
  });
});

describe("createGameBoard", () => {
  beforeEach(() => {
    document.getElementById = jest.fn().mockReturnValue({
      style: {},
      appendChild: jest.fn(),
      innerHTML: "",
    });

    document.createElement = jest.fn().mockImplementation(() => {
      return {
        classList: {
          add: jest.fn(),
        },
        style: {},
        appendChild: jest.fn(),
      };
    });
  });

  it("should create a game board with the correct number of cells", () => {
    const rows = 20;
    const cols = 10;
    createGameBoard(rows, cols);

    expect(document.createElement).toHaveBeenCalledTimes(421);

    expect(document.getElementById).toHaveBeenCalledWith("tetrisBoard");
  });

  it("should correctly set styles for the board", () => {
    createGameBoard(20, 10);
    const board = document.getElementById("tetrisBoard");

    expect(board.style.display).toBe("flex");
    expect(board.style.justifyContent).toBe("space-around");
    expect(board.style.alignItems).toBe("center");
    expect(board.style.gap).toBe("100px");
  });
});

describe("colorTheGameField", () => {
  const colorNames = [
    "rgba(0, 0, 0, 0.2)",
    "#87239E",
    "#9E4923",
    "#9E3323",
    "#9E237F",
    "#9E2331",
    "#9E7223",
    "#9E4B23",
    "gray",
  ];

  let mockElements = {};

  beforeEach(() => {
    mockElements = {};

    document.getElementById = jest.fn((id) => {
      if (!mockElements[id]) {
        mockElements[id] = { style: {} };
      }
      return mockElements[id];
    });
  });

  it("should correctly color the game field based on board1 and board2 data", () => {
    const data = {
      board1: [0, "1", "1", 1, "1", "2"],
      board2: [2, "2", "1", 0, "2", "2"],
    };

    colorTheGameField(data);

    expect(mockElements["grid112"].style.backgroundColor).toBe(colorNames[1]);
    expect(mockElements["grid221"].style.backgroundColor).toBe(colorNames[2]);
    expect(mockElements["grid222"].style.backgroundColor).toBe(colorNames[0]);
  });

  it("should not attempt to color cells if board data is missing", () => {
    const data = {};

    colorTheGameField(data);

    expect(document.getElementById).not.toHaveBeenCalled();
  });

  it("should handle null values for board1 and board2", () => {
    const data = {
      board1: null,
      board2: "null",
    };

    colorTheGameField(data);

    expect(document.getElementById).not.toHaveBeenCalled();
  });
});

describe("drawOverlay", () => {
  const colorNames = [
    "rgba(0, 0, 0, 0.2)",
    "#87239E",
    "#9E4923",
    "#9E3323",
    "#9E237F",
    "#9E2331",
    "#9E7223",
    "#9E4B23",
    "gray",
  ];

  let mockElements = {};

  beforeEach(() => {
    mockElements = {};

    document.getElementById = jest.fn((id) => {
      if (!mockElements[id]) {
        mockElements[id] = { style: {} };
      }
      return mockElements[id];
    });
  });

  it("should correctly apply overlay colors", () => {
    const data = {
      overlay1: [0, "1", "1", 1, "1", "2"],
      overlay2: [2, "2", "1", 0, "2", "2"],
    };

    drawOverlay(data);

    expect(mockElements["grid112"].style.backgroundColor).toBe(colorNames[1]);
    expect(mockElements["grid111"].style.backgroundColor).toBe(colorNames[0]);
  });

  it("should not attempt to color cells if overlay data is missing", () => {
    const data = {};

    drawOverlay(data);

    expect(document.getElementById).not.toHaveBeenCalled();
  });

  it("should handle null values for overlay1 and overlay2", () => {
    const data = {
      overlay1: null,
      overlay2: "null",
    };

    drawOverlay(data);

    expect(document.getElementById).not.toHaveBeenCalled();
  });
});

describe("parseMessage function", () => {
  let mockStartButton;
  let mockSocket;
  let mockEmit;

  beforeEach(() => {
    mockStartButton = {
      style: {},
      addEventListener: jest.fn(),
    };
    mockSocket = { emit: jest.fn() };
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === "startButton") return mockStartButton;
      return null;
    });
    global.colorTheGameField = jest.fn();
    global.drawOverlay = jest.fn();
  });

  it('should display the start button and add click listener when "control_on" message is received', () => {
    parseMessage({ message: "control_on" }, mockSocket);
    expect(document.getElementById).toHaveBeenCalledWith("startButton");
    expect(mockStartButton.style.display).toBe("block");
    expect(mockStartButton.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  it('should emit "start" message when start button is clicked', () => {
    parseMessage({ message: "control_on" }, mockSocket);

    const clickEventListener =
      mockStartButton.addEventListener.mock.calls[0][1];
    clickEventListener();

    expect(mockSocket.emit).toHaveBeenCalledWith("message", {
      message: "start",
    });
  });

  it('should hide the start button when "game_started" message is received', () => {
    parseMessage({ message: "game_started" }, mockSocket);
    expect(document.getElementById).toHaveBeenCalledWith("startButton");
    expect(mockStartButton.style.display).toBe("none");
  });

  it('should call colorTheGameField and drawOverlay when "started" message is received', () => {
    const data = { message: "started" };
    parseMessage(data, mockSocket);

    expect(colorTheGameField);
    expect(drawOverlay);
  });
});

describe("Keydown events for game controls", () => {
  let emitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    global.io.mockClear();
    mockSocket = { emit: jest.fn() };
    global.io.mockImplementation(() => mockSocket);
    gameState = "started";
    emitSpy = jest.spyOn(mockSocket, "emit");

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "a":
          mockSocket.emit("message", { message: "move_left" });
          break;
        case "d":
          mockSocket.emit("message", { message: "move_right" });
          break;
        case "w":
          mockSocket.emit("message", { message: "rotate" });
          break;
        case "s":
          mockSocket.emit("message", { message: "reverse_rotate" });
          break;
      }
    });
  });

  afterEach(() => {
    if (emitSpy) emitSpy.mockRestore();
  });

  afterAll(() => {
    if (global.io().close) {
      global.io().close();
    }
  });

  function simulateKeydown(key) {
    const event = new global.KeyboardEvent("keydown", {
      key: key,
      bubbles: true,
      cancelable: true,
    });
    global.triggerKeyEvent("keydown", key);
    document.dispatchEvent(event);
  }

  test('Pressing "a" emits "move_left"', () => {
    simulateKeydown("a");
    expect(emitSpy).toHaveBeenCalledWith("message", { message: "move_left" });
  });

  test('Pressing "d" emits "move_right"', () => {
    simulateKeydown("d");
    expect(emitSpy).toHaveBeenCalledWith("message", { message: "move_right" });
  });

  test('Pressing "w" emits "rotate"', () => {
    simulateKeydown("w");
    expect(emitSpy).toHaveBeenCalledWith("message", { message: "rotate" });
  });
});

describe("coolMode", () => {
  let dom;
  let document;

  const collumnNames = ["K", "A", "R", "T", "U", "P", "E", "L", "I", "S"];
  const rowNames = [
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

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><body><div id="tetrisBoard"></div></body>`);
    document = dom.window.document;
    global.document = document;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should color all cells in grid black after calling coolMode", () => {
    createGameBoard(20, 10);

    const gridId = "grid1";
    coolMode(gridId);

    jest.runAllTimers();

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        const cellId = `${gridId}${collumnNames[j]}${rowNames[i]}`;
        const cell = document.getElementById(cellId);
        expect(cell.style.backgroundColor).toBe("black");
      }
    }
  });
});
