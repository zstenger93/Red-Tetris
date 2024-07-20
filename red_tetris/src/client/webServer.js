const express = require("express");
const path = require("path");
const http = require("http");

const app = express();

app.use(express.static(path.join(__dirname, "client")));

// Serve the JS file
app.get("/js/client.js", (req, res) => {
  res.sendFile(path.join(__dirname, "js", "client.js"));
  console.log("client.js sent");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/assets/background.png", (req, res) => {
  res.sendFile(path.join(__dirname, "assets", "background.png"));
});

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

module.exports = { app, httpServer };
