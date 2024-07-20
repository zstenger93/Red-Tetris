const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const Game = require("../src/server/classes/Game"); // Ensure this path is correct

describe("socket.io server functionality", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
	const httpServer = createServer();
	io = new Server(httpServer);
	httpServer.listen(() => {
	  const port = httpServer.address().port;
	  clientSocket = new Client(`http://localhost:${port}`);
	  io.on("connection", (socket) => {
		serverSocket = socket;
	  });
	  clientSocket.on("connect", done);
	});
  });

  afterAll(() => {
	io.close();
	clientSocket.close();
  });

  test("should communicate", (done) => {
	clientSocket.on("hello", (arg) => {
	  expect(arg).toBe("world");
	  done();
	});
	serverSocket.emit("hello", "world");
  });

  test("should join room and receive control message", (done) => {
	clientSocket.emit("joinRoom", { room: "testRoom", username: "testUser" });
	clientSocket.on("message", (message) => {
	  expect(message).toEqual({ message: "control_on" });
	  done();
	});
  });

  // Add more tests here following the pattern above
});