const { createGameBoard, removeGameBoard, parseMessage } = require('../src/client/js/client');

describe('Game Board Functions', () => {
  beforeEach(() => {
	document.getElementById.mockClear();
	global.io.mockClear();
  });

  it('should create a game board', () => {
	createGameBoard(20, 10);
	expect(document.getElementById).toHaveBeenCalledWith("tetrisBoard");
	expect(document.createElement).toHaveBeenCalledTimes(42); // 40 cells + 1 dashboard + 1 button
  });

  it('should remove the game board', () => {
	removeGameBoard();
	const board = document.getElementById("tetrisBoard");
	expect(board.innerHTML).toBe("");
  });

  it('should display the start button when "control_on" message is received', () => {
	const mockSocket = { emit: jest.fn() };
	parseMessage({ message: "control_on" }, mockSocket);
	const startButton = document.getElementById("startButton");
	expect(startButton.style.display).toBe("block");
  });
});
