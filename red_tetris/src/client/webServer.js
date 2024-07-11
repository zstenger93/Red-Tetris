const express = require('express');
const path = require('path');
const http = require('http');

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

module.exports = { app, httpServer };