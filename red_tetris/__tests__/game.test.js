const Game = require("../src/server/classes/Game");
const Player = require("../src/server/classes/Player");
const { EventEmitter } = require("events");

jest.mock("../src/server/classes/Player", () => {
  return jest.fn().mockImplementation((name, socketId) => ({
    name,
    socketId,
    moveLeft: jest.fn(),
    moveRight: jest.fn(),
    rotate: jest.fn(),
    reverseRotate: jest.fn(),
    moveDown: jest.fn(),
    appendLines: jest.fn(),
    returnBoard: jest.fn().mockReturnValue("board"),
    returnOverlay: jest.fn().mockReturnValue("overlay"),
    resetBoard: jest.fn(),
    generatePieces: jest.fn(),
    checkLose: jest.fn(),
    returnNextPiece: jest.fn(),
  }));
});

describe("Game", () => {
  let game;
  let io;

  beforeEach(() => {
    io = new EventEmitter();
    io.to = jest.fn().mockReturnThis();
    io.emit = jest.fn();
    game = new Game("room1", io);
  });

  test("addPlayer should add players to the game", () => {
    game.addPlayer("Alice", "socket1");
    game.addPlayer("Bob", "socket2");
    expect(game.player1).not.toBeNull();
    expect(game.player2).not.toBeNull();
    expect(game.player1.name).toBe("Alice");
    expect(game.player2.name).toBe("Bob");
  });

  test("removePlayer should handle removing player1 and promote player2", () => {
    game.addPlayer("Alice", "socket1");
    game.addPlayer("Bob", "socket2");
    game.removePlayer("socket1");
    expect(game.player1.name).toBe("Bob");
    expect(game.player2).toBeNull();
  });

  test("moveLeft should call moveLeft on the correct player", () => {
    game.addPlayer("Alice", "socket1");
    game.addPlayer("Bob", "socket2");
    game.moveLeft("socket1");
    expect(game.player1.moveLeft).toHaveBeenCalled();
    game.moveLeft("socket2");
    expect(game.player2.moveLeft).toHaveBeenCalled();
  });

  test("moveRight should call moveRight on the correct player", () => {
    game.addPlayer("Alice", "socket1");
    game.addPlayer("Bob", "socket2");

    game.moveRight("socket1");
    expect(game.player1.moveRight).toHaveBeenCalled();
    game.moveRight("socket2");
    expect(game.player2.moveRight).toHaveBeenCalled();
  });

  test("rotate should call rotate on the correct player", () => {
    game.addPlayer("Alice", "socket1");
    game.rotate("socket1");
    expect(game.player1.rotate).toHaveBeenCalled();
  });

  test("reverseRotate should call reverseRotate on the correct player", () => {
    game.addPlayer("Alice", "socket1");
    game.reverseRotate("socket1");
    expect(game.player1.reverseRotate).toHaveBeenCalled();
  });

  test("gameLogic should handle player moves and send game state", () => {
    game.addPlayer("Alice", "socket1");
    game.addPlayer("Bob", "socket2");
    game.player1.moveDown.mockReturnValue(1);
    game.gameLogic();
    expect(game.player2.appendLines).toHaveBeenCalledWith(1);
    expect(io.emit).toHaveBeenCalledWith("message", expect.anything());
  });

  test("startGame should set gameState to 'started' and emit message", () => {
    jest.useFakeTimers();
    game.addPlayer("Alice", "socket1");
    game.addPlayer("Bob", "socket2");
    game.startGame();
    expect(game.gameState).toBe("started");
    expect(io.emit).toHaveBeenCalledWith("message", { message: "started" });
    jest.runOnlyPendingTimers();
    expect(game.gameLogic).toBeDefined();
    jest.useRealTimers();
  });

  // test("endGame should set gameState to 'waiting' and clear intervals", () => {
  //   game.startGame();
  //   game.endGame();
  //   expect(game.gameState).toBe("waiting");
  //   expect(game.gameInterval.length).toBe(0);
  // });
});

describe("Game startGame Endgame Scenarios", () => {
  let game;
  let io;

  beforeEach(() => {
    jest.useFakeTimers();
    io = new EventEmitter();
    io.to = jest.fn().mockReturnThis();
    io.emit = jest.fn();
    game = new Game("testRoom", io);
    game.player1 = new Player("Alice", "socket1");
    game.player2 = new Player("Bob", "socket2");
    game.player1.checkLose = jest.fn();
    game.player2.checkLose = jest.fn();
    game.endGame = jest.fn();
  });

  test("Game should end if player1 loses immediately", () => {
    game.player1.checkLose.mockReturnValue(true);

    game.startGame();

    jest.runOnlyPendingTimers();

    expect(game.endGame).toHaveBeenCalled();
  });

  test("Game should end if player2 loses immediately", () => {
    game.player2.checkLose.mockReturnValue(true);

    game.startGame();

    jest.runOnlyPendingTimers();

    expect(game.endGame).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
});

describe("removePlayer function", () => {
  let game, mockIo;

  beforeEach(() => {
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    game = new Game("testRoom", mockIo);
    game.listOfPeopleInRoom = {
      socket1: { socketId: "socket1", name: "Player1" },
      socket2: { socketId: "socket2", name: "Player2" },
      socket3: { socketId: "socket3", name: "Player3" },
    };
    game.player1 = { socketId: "socket1", name: "Player1" };
    game.player2 = { socketId: "socket2", name: "Player2" };
  });

  test("should delete a non-player socketId and return without further action", () => {
    game.removePlayer("socket3");
    expect(game.listOfPeopleInRoom).not.toHaveProperty("socket3");
    expect(game.player1).toEqual({ socketId: "socket1", name: "Player1" });
    expect(game.player2).toEqual({ socketId: "socket2", name: "Player2" });
  });

  test("should promote a player from listOfPeopleInRoom to player2 when player2 is null", () => {
    game.removePlayer("socket2");
    game.removePlayer("socket3");
    expect(game.player2).toBeNull();
    game.removePlayer("socket4");
    expect(game.listOfPeopleInRoom).not.toHaveProperty("socket4");
    expect(game.player2).toBeNull();
  });
});

describe("removePlayer method in Game", () => {
  let game;

  beforeEach(() => {
    game = new Game();
    game.endGame = jest.fn();
    game.gameState = "active";
    game.player1 = { socketId: "socket1" };
    game.player2 = null;
    game.listOfPeopleInRoom = { socket1: {} };
  });

  it('should end the game and set gameState to "waiting" when player1 is removed and player2 is null', () => {
    game.removePlayer("socket1");
    expect(game.endGame).toHaveBeenCalled();
    expect(game.gameState).toEqual("waiting");
  });
});

describe("moveDownOnce", () => {
  let game;
  let io;

  beforeEach(() => {
    io = new EventEmitter();
    io.to = jest.fn().mockReturnThis();
    io.emit = jest.fn();
    game = new Game("room1", io);
    game.sendGameState = jest.fn();
    game.findPlayer = jest.fn();
  });

  test("should call moveDown on the correct player and handle return value", () => {
    const mockPlayer1 = {
      socketId: "socket1",
      moveDown: jest.fn().mockReturnValue(1),
      appendLines: jest.fn(),
    };
    const mockPlayer2 = {
      socketId: "socket2",
      moveDown: jest.fn().mockReturnValue(2),
      appendLines: jest.fn(),
    };

    game.player1 = mockPlayer1;
    game.player2 = mockPlayer2;

    game.findPlayer.mockReturnValue(mockPlayer1);

    game.moveDownOnce("socket1");
    expect(mockPlayer1.moveDown).toHaveBeenCalled();
    expect(game.sendGameState).toHaveBeenCalled();
    expect(mockPlayer2.appendLines).toHaveBeenCalledWith(1);

    game.findPlayer.mockReturnValue(mockPlayer2);

    game.moveDownOnce("socket2");
    expect(mockPlayer2.moveDown).toHaveBeenCalled();
    expect(game.sendGameState).toHaveBeenCalled();
    expect(mockPlayer1.appendLines).toHaveBeenCalledWith(2);
  });

  test("should return if player is null", () => {
    game.findPlayer.mockReturnValue(null);
    game.moveDownOnce("socket1");
    expect(game.sendGameState).not.toHaveBeenCalled();
  });

  test("should return if moveDown returns null", () => {
    const mockPlayer = {
      socketId: "socket1",
      moveDown: jest.fn().mockReturnValue(null),
      appendLines: jest.fn(),
    };

    game.player1 = mockPlayer;
    game.findPlayer.mockReturnValue(mockPlayer);

    game.moveDownOnce("socket1");
    expect(mockPlayer.moveDown).toHaveBeenCalled();
    expect(game.sendGameState).toHaveBeenCalled();
    expect(mockPlayer.appendLines).not.toHaveBeenCalled();
  });
});

describe("endGame", () => {
  let game;
  let io;

  beforeEach(() => {
    io = new EventEmitter();
    io.to = jest.fn().mockReturnThis();
    io.emit = jest.fn();
    game = new Game("room1", io);
    game.player1 = {
      name: "Player1",
      checkLose: jest.fn().mockReturnValue(false),
      socketId: "socket1",
    };
    game.player2 = { name: "Player2", socketId: "socket2" };
    game.gameState = "playing";
  });

  test("should emit message with winner when gameState is 'ended' and player2 is not null", () => {
    game.gameState = "ended";
    game.player1.checkLose.mockReturnValue(true);

    game.endGame();

    expect(io.to).toHaveBeenCalledWith("room1");
    expect(io.emit).toHaveBeenCalledWith("message", {
      message: "ended",
      winner: "Player2",
      player1: "Player1",
      player2: "Player2",
    });
  });

  test("should emit message with winner when gameState is 'ended' and player2 is null", () => {
    game.gameState = "ended";
    game.player2 = null;

    game.endGame();

    expect(io.to).toHaveBeenCalledWith("room1");
    expect(io.emit).toHaveBeenCalledWith("message", {
      message: "ended",
      winner: "Player1",
      player1: "Player1",
    });
  });

  test("should set gameState to 'ended' and emit message when gameState is not 'ended' and player2 is not null", () => {
    game.endGame();

    expect(game.gameState).toBe("waiting");
    expect(io.to).toHaveBeenCalledWith("room1");
    expect(io.emit).toHaveBeenCalledWith("message", {
      message: "ended",
      player1: "Player1",
      player2: "Player2",
    });
  });

  test("should set gameState to 'ended' and emit message when gameState is not 'ended' and player2 is null", () => {
    game.player2 = null;

    game.endGame();

    expect(game.gameState).toBe("waiting");
    expect(io.to).toHaveBeenCalledWith("room1");
    expect(io.emit).toHaveBeenCalledWith("message", {
      message: "ended",
      player1: "Player1",
    });
  });
});
