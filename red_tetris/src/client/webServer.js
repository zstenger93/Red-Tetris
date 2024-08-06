const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");

require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "client")));

const SOCKET_PORT = process.env.SOCKET_PORT || 8080;
// Serve the JS file
app.get("/js/client.js", (req, res) => {
  const clientPath = path.join(__dirname, "js", "client.js");
  let updatedContent = fs.readFileSync(clientPath, "utf8");
  updatedContent = updatedContent
    .replace("{{IP}}", IP)
    .replace("{{PORT}}", SOCKET_PORT);

  res.setHeader("Content-Type", "application/javascript");
  res.send(updatedContent);
  console.log("client.js sent");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/assets/background.png", (req, res) => {
  res.sendFile(path.join(__dirname, "assets", "background.png"));
});

const httpServer = http.createServer(app);

const PORT = process.env.WEBSERVER_PORT || 8000;
const IP = process.env.IP || "localhost";
httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

module.exports = { app, httpServer };
