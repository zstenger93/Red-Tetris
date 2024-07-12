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
        else this.player2 = this.listOfPeopleInRoom[socketId];
        console.log("Player added to game");
    }

    removePlayer(socketId) {
        delete this.listOfPeopleInRoom[socketId];
        if (this.player1.socketId === socketId)
        {
            this.player1 = this.player2;
            this.player2 = null;
        }
        if (this.player2 !== null && this.player2.socketId === socketId)
        {
            this.player2 = null;
            for (const sockId in this.listOfPeopleInRoom)
            {
                if (sockId !== this.player1.socketId)
                {
                    this.player2 = this.listOfPeopleInRoom[sockId];
                    break;
                }
            }
        }
        console.log("Player removed from the game");
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