function createGameBoard(rows, cols) {
    const board = document.getElementById('tetrisBoard');
    function createGrid() {
        board.innerHTML = '';
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
        }
    }
    createGrid();
}

function removeGameBoard() {
    const board = document.getElementById('tetrisBoard');
    board.innerHTML = '';
}


document.addEventListener('DOMContentLoaded', () => {
    const homeDiv = document.getElementById('home');
    const gameDiv = document.getElementById('game');
    const joinButton = document.getElementById('join');

    let socket;

    function navigateToGame(username, room) {
        homeDiv.classList.add('hidden');
        gameDiv.classList.remove('hidden');
        socket = io('http://localhost:8080');
        socket.on('connect', () => {
            console.log('Connected to the WebSocket server');
            socket.emit('joinRoom', {room, username});
            createGameBoard(20, 10);
        });
    }

    joinButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const room = document.getElementById('room').value;
        if (username && room) {
            history.pushState(null, '', `/#${room}[${username}]`);
            navigateToGame(username, room);
        }
        else {
            console.log("Please enter a username and room")
        }
    });

    window.addEventListener('popstate', () => {
        const hash = window.location.hash;
        if (hash) {
            const [room, player] = hash.slice(1).split('[');
            const playerName = player.slice(0, -1);
            navigateToGame(playerName, room);
        } else {
            homeDiv.classList.remove('hidden');
            gameDiv.classList.add('hidden');
            if (socket) {
                socket.disconnect();
                removeGameBoard();
                socket = null;
            }
        }
    });

    const initialHash = window.location.hash;
    if (initialHash) {
        const [room, player] = initialHash.slice(1).split('[');
        const playerName = player.slice(0, -1);
        navigateToGame(playerName, room);
    }
});
