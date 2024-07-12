Player = require('./Player');

class Game {
    constructor() {
        this.listOfPeopleInRoom = {};
        this.player1 = null;
        this.player2 = null;
        this.gameState = "waiting";
        this.currentPiece = null;
    }

    addPlayer(name, socketId) {
        this.listOfPeopleInRoom[socketId] = new Player(name, socketId);
        if (this.player1 === null) this.player1 = this.listOfPeopleInRoom[socketId];
        else this.player2 = this.listOfPeopleInRoom[socketId];
        console.log("Player added to game");
    }

    removePlayer(socketId) {
        delete this.listOfPeopleInRoom[socketId];
        if (this.player1.socketId === socketId) this.player1 = null;
        else if (this.player2.socketId === socketId) this.player2 = null;
        console.log("Player removed from the game game");
    }
}

module.exports = Game;