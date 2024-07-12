const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Game = require('./classes/Game');


// function checkRoomState(room, username, message) {
//     return;
// }

// function checkPlayerState(room, username, message){
//     return;
// }

// function checkGameBoardState(room, username, message){
//     return;
// }

// function checkCurrentPiece(room, username, message){
    
// }


// function createBitMask(username, message) {
//     bitMask16 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// }

const games = {};

function messageParser(room, username, message) {
    checkRoomState(room, username, message);
    if (message === "start") {
        return;
    }
    if (message === "stop") {
        return;
    }
    if (message === "left") {
        return;
    }
    if (message === "right") {
        return;
    }
    if (message === "down") {
        return;
    }
    if (message === "rotate") {
        return;
    }
};


const socketServer = http.createServer();
const io = new Server(socketServer, {
    cors: {
        origin: "*"
    }
});

const userSockets = {};
// socket connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room);
        userSockets[socket.id] = { room, username };
        // console.log(`User '${username}' joined room '${room}'`);
        if (!games[room]) games[room] = new Game();
        games[room].addPlayer(username);
    });

    // recive message
    socket.on('message', ({ room, message }) => {
        const username = userSockets[socket.id]?.username || 'Anonymous';
        test = "123"
        socket.to(room).emit('message', { username, test });
        // console.log(`Message from '${username}' in room '${room}': ${message}`);
        // socket.to(room).emit('message', { username, message });
    });
    // disconeect
    socket.on('disconnect', () => {
        const user = userSockets[socket.id];
        if (user) {
            console.log(`User '${user.username}' disconnected from room '${user.room}'`);
            delete userSockets[socket.id];
            games[user.room].removePlayer(socket.id);
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
