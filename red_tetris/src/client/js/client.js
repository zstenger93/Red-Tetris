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

var gameState = "waiting";

function createGameBoard(rows, cols) {
  const board = document.getElementById("tetrisBoard");
  board.style.display = "flex";
  board.style.justifyContent = "space-around";
  board.style.alignItems = "center";
  board.style.gap = "100px";

  function createGrid(gridId) {
    const tetrisBoard = document.createElement("div");
    tetrisBoard.classList.add("tetris");
    tetrisBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    tetrisBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    tetrisBoard.style.width = `${cols * 50}px`;
    tetrisBoard.style.height = `${rows * 50}px`;
    tetrisBoard.style.border = "7px solid #2a0000";
    tetrisBoard.style.display = "grid";
    tetrisBoard.style.gridGap = "1px";
    tetrisBoard.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
      cell.style.border = "1px solid black";
      cell.style.width = "45px";
      cell.style.height = "45px";
      cell.classList.add("cell");
      cell.id = `${gridId}${collumnNames[i % cols]}${
        rowNames[Math.floor(i / cols)]
      }`;
      tetrisBoard.appendChild(cell);
    }
    board.appendChild(tetrisBoard);
  }

  function createDashBoard() {
    const tetrisPanel = document.createElement("div");
    const tetrisDashBoard = document.createElement("div");
    tetrisDashBoard.id = "tetrisDashBoard";
    tetrisDashBoard.style.display = "grid";
    tetrisDashBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
    tetrisDashBoard.style.gridTemplateRows = "repeat(4, 1fr)";
    tetrisDashBoard.classList.add("tetris", "dashboard");
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement("div");
      cell.style.backgroundColor = "black";
      cell.style.border = "1px solid white";
      cell.style.width = "45px";
      cell.style.height = "45px";
      cell.classList.add("cell");
      cell.id = `dashboard_cell_${i}`;
      tetrisDashBoard.appendChild(cell);
    }
    const button = document.createElement("button");
    button.id = "startButton";
    button.style.display = "none";
    button.textContent = "Start Game";
    button.style.width = "200px";
    button.style.height = "50px";
    tetrisPanel.appendChild(tetrisDashBoard);
    tetrisPanel.appendChild(button);
    board.appendChild(tetrisPanel);
  }

  board.innerHTML = "";
  createDashBoard();
  createGrid("grid1");
  createGrid("grid2");
}

function removeGameBoard() {
  const board = document.getElementById("tetrisBoard");
  board.innerHTML = "";
}

function coolMode(gridId) {
  let delay = 0;
  const delayIncrement = 30;

  function colorCell(cellId, color) {
    setTimeout(() => {
      const cell = document.getElementById(cellId);
      cell.style.backgroundColor = color;
    }, delay);
  }

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      colorCell(`${gridId}${collumnNames[j]}${rowNames[i]}`, "black", delay);
      delay += delayIncrement;
    }
  }
}

function colorTheGameField(data) {
  if (!data.board1 || data.board1 === "null") return;
  for (let i = 0; i < data.board1.length; i = i + 3) {
    const cell = document.getElementById(
      `grid1${data.board1[i + 1]}${data.board1[i + 2]}`
    );
    cell.style.backgroundColor = colorNames[data.board1[i]];
  }
  if (!data.board2 || data.board2 === "null") return;
  for (let i = 0; i < data.board2.length; i = i + 3) {
    const cell = document.getElementById(
      `grid2${data.board2[i + 1]}${data.board2[i + 2]}`
    );
    cell.style.backgroundColor = colorNames[data.board2[i]];
  }
}

function drawOverlay(data) {
  if (!data.overlay1 || data.overlay1 === "null") return;
  for (let i = 0; i < data.overlay1.length; i = i + 3) {
    const cell = document.getElementById(
      `grid1${data.overlay1[i + 1]}${data.overlay1[i + 2]}`
    );
    cell.style.backgroundColor = colorNames[data.overlay1[i]];
  }
  if (!data.overlay2 || data.overlay2 === "null") return;
  for (let i = 0; i < data.overlay2.length; i = i + 3) {
    const cell = document.getElementById(
      `grid2${data.overlay2[i + 1]}${data.overlay2[i + 2]}`
    );
    cell.style.backgroundColor = colorNames[data.overlay2[i]];
  }
}

function parseMessage(data, socket) {
  console.log(data);
  if (data.message === "control_on") {
    const startButton = document.getElementById("startButton");
    startButton.style.display = "block";
    startButton.addEventListener("click", () => {
      socket.emit("message", { message: "start" });
    });
  }
  if (data.message === "game_started") {
    const startButton = document.getElementById("startButton");
    startButton.style.display = "none";
  }
  if (data.message === "started") {
    gameState = "started";
    colorTheGameField(data);
    setTimeout(() => {}, 50);
    drawOverlay(data);
  }
  if (data.message === "ended") {
    gameState = "ended";
    coolMode("grid1");
    coolMode("grid2");
  }
  if (data.message === "waiting") {
    gameState = "waiting";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const homeDiv = document.getElementById("home");
  const gameDiv = document.getElementById("game");
  const joinButton = document.getElementById("join");

  let socket;

  function navigateToGame(username, room) {
    homeDiv.classList.add("hidden");
    gameDiv.classList.remove("hidden");

    socket = io("http://10.12.1.1:8080");

    socket.on("connect", () => {
      socket.emit("joinRoom", { room, username });
      createGameBoard(20, 10);
    });

    socket.on("message", (data) => {
      parseMessage(data, socket);
    });

    addEventListener("keydown", (event) => {
      if (gameState === "started") {
        if (event.key === "a") {
          socket.emit("message", { message: "move_left" });
        }
        if (event.key === "d") {
          socket.emit("message", { message: "move_right" });
        }
        if (event.key === "w") {
          socket.emit("message", { message: "rotate" });
        }
        if (event.key === "s") {
          socket.emit("message", { message: "down" });
        }
      }
    });
  }

  joinButton.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const room = document.getElementById("room").value;
    if (username && room) {
      history.pushState(null, "", `/#${room}[${username}]`);
      navigateToGame(username, room);
    } else {
      console.log("Please enter a username and room");
    }
  });

  window.addEventListener("popstate", () => {
    const hash = window.location.hash;
    if (hash) {
      const [room, player] = hash.slice(1).split("[");
      const playerName = player.slice(0, -1);
      navigateToGame(playerName, room);
    } else {
      homeDiv.classList.remove("hidden");
      gameDiv.classList.add("hidden");
      if (socket) {
        socket.disconnect();
        removeGameBoard();
        socket = null;
      }
    }
  });

  const initialHash = window.location.hash;
  if (initialHash) {
    const [room, player] = initialHash.slice(1).split("[");
    const playerName = player.slice(0, -1);
    navigateToGame(playerName, room);
  }
});

module.exports = {
  createGameBoard,
  removeGameBoard,
  parseMessage,
  colorTheGameField,
  drawOverlay,
};
