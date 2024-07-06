const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

const socketServer = http.createServer();
const io = new Server(socketServer, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('message', ({ room, message }) => {
        console.log(`Message from client in room ${room}: ${message}`);
        socket.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

const SOCKET_PORT = 8080;
socketServer.listen(SOCKET_PORT, () => {
    console.log(`Socket.IO server listening on http://localhost:${SOCKET_PORT}`);
});
