const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

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

const userSockets = {};
const rooms = {};
// socket connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room);
        userSockets[socket.id] = { room, username };
        console.log(`User '${username}' joined room '${room}'`);
    });

    // recive message
    socket.on('message', ({ room, message }) => {
        const username = userSockets[socket.id]?.username || 'Anonymous';
        console.log(`Message from '${username}' in room '${room}': ${message}`);
        socket.to(room).emit('message', { username, message });
    });
    // disconeect
    socket.on('disconnect', () => {
        const user = userSockets[socket.id];
        if (user) {
            console.log(`User '${user.username}' disconnected from room '${user.room}'`);
            delete userSockets[socket.id];
        } else {
            console.log('A user disconnected');
        }
    });
});


// listening socket
const SOCKET_PORT = 8080;
socketServer.listen(SOCKET_PORT, () => {
    console.log(`Socket.IO server listening on http://localhost:${SOCKET_PORT}`);
});
