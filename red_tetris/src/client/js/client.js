function createGameBoard(rows, cols) {
  const board = document.getElementById("tetrisBoard");
  board.style.display = "flex";
  board.style.justifyContent = "space-around";
  board.style.alignItems = "center";
  board.style.gap = "100px";

  function createGrid(gridId) {
    const tetrisBoard = document.createElement("div");
    tetrisBoard.classList.add("tetris", gridId);
    tetrisBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    tetrisBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    tetrisBoard.style.width = `${cols * 50}px`;
    tetrisBoard.style.height = `${rows * 50}px`;
    tetrisBoard.style.border = "1px solid black";
    tetrisBoard.style.display = "grid";
    tetrisBoard.style.gridGap = "1px";
    tetrisBoard.style.backgroundColor = "black";
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.style.backgroundColor = "#A4343A";
      cell.style.border = "1px solid black";
      cell.style.width = "45px";
      cell.style.height = "45px";
      cell.classList.add("cell");
      cell.id = `${gridId}_cell_${i}`;
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
      cell.style.backgroundColor = "#A4343A";
      cell.style.border = "1px solid black";
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
}

document.addEventListener("DOMContentLoaded", () => {
  const homeDiv = document.getElementById("home");
  const gameDiv = document.getElementById("game");
  const joinButton = document.getElementById("join");

  let socket;

  function navigateToGame(username, room) {
    homeDiv.classList.add("hidden");
    gameDiv.classList.remove("hidden");

    socket = io("http://localhost:8080");

    socket.on("connect", () => {
      socket.emit("joinRoom", { room, username });
      createGameBoard(20, 10);
    });

    socket.on("message", (data) => {
      parseMessage(data, socket);
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
