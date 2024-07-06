const socket = io('http://localhost:8080');

socket.on('connect', () => {
    console.log('Connected to the WebSocket server');
});

socket.on('message', (message) => {
    console.log('Received message:', message);
});

function joinRoom(room) {
    socket.emit('joinRoom', room);
    console.log(`Joined room: ${room}`);
}

function sendMessage(room, message) {
    socket.emit('message', { room, message });
    console.log(`Sent message to room ${room}: ${message}`);
}

// Example usage:
// joinRoom('room1');
// sendMessage('room1', 'Hello, Room 1!');

fetch('http://localhost:8000')
    .then(response => response.text())
    .catch(error => console.error('Error fetching from HTTP server:', error));