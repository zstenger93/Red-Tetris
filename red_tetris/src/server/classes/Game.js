Player = require('./Player');

class Game {
	constructor() {
		this.listOfPeopleInRoom = {};
		this.player1 = null;
		this.player2 = null;
		this.gameState = "waiting";
		this.currentPiece = null;
		console.log("Game created");
	}

	addPlayer(name, socketId) {
		this.listOfPeopleInRoom[socketId] = new Player(name, socketId);
		if (this.player1 === null) this.player1 = this.listOfPeopleInRoom[socketId];
		else if  (this.player2 === null) this.player2 = this.listOfPeopleInRoom[socketId];
		console.log("Player added to game");
	}

	removePlayer(socketId) {
		if (this.player1 !== null && this.player2 != null && this.player1.socketId !== socketId && this.player2.socketId !== socketId) {
		  delete this.listOfPeopleInRoom[socketId];
		  return;
		}
		this.player1 = null;
		this.player2 = null;
		this.gameState = "waiting";
	  
		let nextPlayerIndex = 0;
		for (const [id, player] of Object.entries(this.listOfPeopleInRoom)) {
		  if (id !== socketId) {
			if (nextPlayerIndex === 0) {
			  this.player1 = player;
			} else if (nextPlayerIndex === 1) {
			  this.player2 = player;
			  break;
			}
			nextPlayerIndex++;
		  }
		}
	  
		console.log("Player removed from game");
		console.log(this.player1);
		console.log(this.player2);
	  }
	
	startGame() {
		this.gameState = "playing";
		console.log("Game started");
	}

	endGame() {
		this.gameState = "ended";
		console.log("Game ended");
	}
}

module.exports = Game;