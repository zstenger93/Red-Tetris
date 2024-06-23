const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the Vue app
app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  socket.on('startGame', () => {
    io.to('room1').emit('gameStart', { message: 'The game has started!' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// All other requests not handled will return the Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    