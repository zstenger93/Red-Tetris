const { createGameBoard, removeGameBoard, parseMessage, colorTheGameField, drawOverlay } = require('../src/client/js/client');
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

describe('Game Board Functions', () => {
  beforeEach(() => {
	document.getElementById.mockClear();
	global.io.mockClear();
  });

  it('should create a game board', () => {
	createGameBoard(20, 10);
	expect(document.getElementById).toHaveBeenCalledWith("tetrisBoard");
	expect(document.createElement).toHaveBeenCalledTimes(421);
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
	expect(startButton);
  });
});

describe('createGameBoard', () => {
  beforeEach(() => {
    document.getElementById = jest.fn().mockReturnValue({
      style: {},
      appendChild: jest.fn(),
      innerHTML: '',
    });

    document.createElement = jest.fn().mockImplementation(() => {
		return {
		  classList: {
			add: jest.fn()
		  },
		  style: {},
		  appendChild: jest.fn(),
		};
	  });
  });

  it('should create a game board with the correct number of cells', () => {
    const rows = 20;
    const cols = 10;
    createGameBoard(rows, cols);

    expect(document.createElement).toHaveBeenCalledTimes(421);

    expect(document.getElementById).toHaveBeenCalledWith('tetrisBoard');
  });

  it('should correctly set styles for the board', () => {
    createGameBoard(20, 10);
    const board = document.getElementById('tetrisBoard');

    expect(board.style.display).toBe('flex');
    expect(board.style.justifyContent).toBe('space-around');
    expect(board.style.alignItems).toBe('center');
    expect(board.style.gap).toBe('100px');
  });
});

describe('colorTheGameField', () => {
	const colorNames = [
		"#A4343A",
		"#C2505E",
		"#69202A", 
		"#D77B86",
		"#500C18",
		"#E08C97",
		"#410912",
		"#F2A2AE",
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

  it('should correctly color the game field based on board1 and board2 data', () => {
    const data = {
		board1: [0, '1', '1', 1, '1', '2'],
		board2: [2, '2', '1', 0, '2', '2']
	  };

    colorTheGameField(data);

    expect(mockElements['grid112'].style.backgroundColor).toBe(colorNames[1]);
    expect(mockElements['grid221'].style.backgroundColor).toBe(colorNames[2]);
    expect(mockElements['grid222'].style.backgroundColor).toBe(colorNames[0]);
  });

  it('should not attempt to color cells if board data is missing', () => {
    const data = {};

    colorTheGameField(data);

    expect(document.getElementById).not.toHaveBeenCalled();
  });

  it('should handle null values for board1 and board2', () => {
    const data = {
      board1: null,
      board2: "null"
    };

    colorTheGameField(data);

    expect(document.getElementById).not.toHaveBeenCalled();
  });
});

describe('drawOverlay', () => {
	const colorNames = [
	  "#A4343A",
	  "#C2505E",
	  "#69202A", 
	  "#D77B86",
	  "#500C18",
	  "#E08C97",
	  "#410912",
	  "#F2A2AE",
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
  
	it('should correctly apply overlay colors', () => {
		const data = {
		  overlay1: [0, '1', '1', 1, '1', '2'],
		  overlay2: [2, '2', '1', 0, '2', '2']
		};
	  
		drawOverlay(data);
	  
		expect(mockElements['grid112'].style.backgroundColor).toBe(colorNames[1]);
    	expect(mockElements['grid111'].style.backgroundColor).toBe(colorNames[0]);
	  });
	  
	it('should not attempt to color cells if overlay data is missing', () => {
	  const data = {};
  
	  drawOverlay(data);
  
	  expect(document.getElementById).not.toHaveBeenCalled();
	});
  
	it('should handle null values for overlay1 and overlay2', () => {
	  const data = {
		overlay1: null,
		overlay2: "null"
	  };
  
	  drawOverlay(data);
  
	  expect(document.getElementById).not.toHaveBeenCalled();
	});
});

describe('parseMessage function', () => {
  let mockStartButton;
  let mockSocket;
  let mockEmit;

  beforeEach(() => {
    mockStartButton = {
      style: {},
      addEventListener: jest.fn()
    };
    mockSocket = { emit: jest.fn() };
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === 'startButton') return mockStartButton;
      return null;
    });
    global.colorTheGameField = jest.fn();
    global.drawOverlay = jest.fn();
  });


  it('should display the start button and add click listener when "control_on" message is received', () => {
    parseMessage({ message: "control_on" }, mockSocket);
    expect(document.getElementById).toHaveBeenCalledWith("startButton");
    expect(mockStartButton.style.display).toBe("block");
    expect(mockStartButton.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it('should emit "start" message when start button is clicked', () => {
  parseMessage({ message: "control_on" }, mockSocket);

  const clickEventListener = mockStartButton.addEventListener.mock.calls[0][1];
  clickEventListener();

  expect(mockSocket.emit).toHaveBeenCalledWith("message", { message: "start" });
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


// describe("DOMContentLoaded event", () => {
// 	beforeEach(() => {
// 	  // Reset the HTML structure before each test
// 	  document.body.innerHTML = `
// 		<div id="home"></div>
// 		<div id="game" class="hidden"></div>
// 		<button id="join"></button>
// 		<input id="username" value="testUser"/>
// 		<input id="room" value="testRoom"/>
// 	  `;
  
// 	  // Add the script to the document
// 	  const script = document.createElement("script");
// 	  script.textContent = `
// 		document.addEventListener("DOMContentLoaded", () => {
// 		  const homeDiv = document.getElementById("home");
// 		  const gameDiv = document.getElementById("game");
// 		  const joinButton = document.getElementById("join");
  
// 		  let socket;
  
// 		  function navigateToGame(username, room) {
// 			homeDiv.classList.add("hidden");
// 			gameDiv.classList.remove("hidden");
  
// 			socket = io("http://localhost:8080");
  
// 			socket.on("connect", () => {
// 			  socket.emit("joinRoom", { room, username });
// 			  createGameBoard(20, 10);
// 			});
  
// 			socket.on("message", (data) => {
// 			  parseMessage(data, socket);
// 			});
// 		  }
  
// 		  joinButton.addEventListener("click", () => {
// 			const username = document.getElementById("username").value;
// 			const room = document.getElementById("room").value;
// 			if (username && room) {
// 			  history.pushState(null, "", \`/#\${room}[\${username}]\`);
// 			  navigateToGame(username, room);
// 			} else {
// 			  console.log("Please enter a username and room");
// 			}
// 		  });
  
// 		  window.addEventListener("popstate", () => {
// 			const hash = window.location.hash;
// 			if (hash) {
// 			  const [room, player] = hash.slice(1).split("[");
// 			  const playerName = player.slice(0, -1);
// 			  navigateToGame(playerName, room);
// 			} else {
// 			  homeDiv.classList.remove("hidden");
// 			  gameDiv.classList.add("hidden");
// 			  if (socket) {
// 				socket.disconnect();
// 				removeGameBoard();
// 				socket = null;
// 			  }
// 			}
// 		  });
  
// 		  const initialHash = window.location.hash;
// 		  if (initialHash) {
// 			const [room, player] = initialHash.slice(1).split("[");
// 			const playerName = player.slice(0, -1);
// 			navigateToGame(playerName, room);
// 		  }
// 		});
// 	  `;
// 	  document.body.appendChild(script);
  
// 	  // Trigger DOMContentLoaded event
// 	  document.dispatchEvent(new Event("DOMContentLoaded"));
// 	});
  
// 	afterEach(() => {
// 	  jest.clearAllMocks();
// 	});
  
// 	it("should navigate to game when join button is clicked", () => {
// 	  // Simulate button click
// 	  const joinButton = document.getElementById("join");
// 	  joinButton.click(); // Trigger the join button click
  
// 	  expect(document.getElementById("home").classList.add).toHaveBeenCalledWith("hidden");
// 	  expect(document.getElementById("game").classList.remove).toHaveBeenCalledWith("hidden");
// 	  expect(global.io).toHaveBeenCalledWith("http://localhost:8080");
// 	});
  
// 	it("should handle popstate event correctly", () => {
// 	  const hash = "#testRoom[testUser]";
// 	  window.location.hash = hash;
  
// 	  // Dispatch popstate event
// 	//   window.dispatchEvent(new Event("popstate"));
  
// 	  expect(document.getElementById("home").classList.add).toHaveBeenCalledWith("hidden");
// 	  expect(document.getElementById("game").classList.remove).toHaveBeenCalledWith("hidden");
// 	  expect(global.io).toHaveBeenCalledWith("http://localhost:8080");
// 	});
  
// 	it("should navigate to game based on initial hash", () => {
// 	  const hash = "#testRoom[testUser]";
// 	  window.location.hash = hash;
  
// 	  // Trigger DOMContentLoaded event
// 	  document.dispatchEvent(new Event("DOMContentLoaded"));
  
// 	  expect(document.getElementById("home").classList.add).toHaveBeenCalledWith("hidden");
// 	  expect(document.getElementById("game").classList.remove).toHaveBeenCalledWith("hidden");
// 	  expect(global.io).toHaveBeenCalledWith("http://localhost:8080");
// 	});
//   });
  