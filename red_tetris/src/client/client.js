const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:8080');

// When connected, log the connection
socket.on('connect', () => {
    console.log('Connected to server');
});

// Listen for messages from the server
socket.on('message', (message) => {
    console.log(message);
});

// Send a message to the server
socket.emit('message', 'Hello server');

// Log disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
