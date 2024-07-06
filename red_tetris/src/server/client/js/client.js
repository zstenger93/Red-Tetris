document.addEventListener('DOMContentLoaded', () => {
    const homeDiv = document.getElementById('home');
    const gameDiv = document.getElementById('game');
    const joinButton = document.getElementById('join');
    const sendMessageButton = document.getElementById('sendMessage');
    const roomInfoDiv = document.getElementById('roomInfo');
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');

    let socket;

    function navigateToGame(username, room) {
        homeDiv.classList.add('hidden');
        gameDiv.classList.remove('hidden');
        roomInfoDiv.textContent = `Room: ${room}, Player: ${username}`;
        
        socket = io('http://localhost:8080');
        socket.on('connect', () => {
            console.log('Connected to the WebSocket server');
            socket.emit('joinRoom', {room, username});
        });
        
        socket.on('message', (message) => {
            console.log('Received message:', message);
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messagesDiv.appendChild(messageElement);
        });

        sendMessageButton.addEventListener('click', () => {
            const message = messageInput.value;
            if (message) {
                socket.emit('message', { room, message });
                messageInput.value = '';
            }
        });
    }

    joinButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const room = document.getElementById('room').value;
        
        if (username && room) {
            history.pushState(null, '', `/#${room}[${username}]`);
            navigateToGame(username, room);
        } else {
            alert('Please enter both username and room.');
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
