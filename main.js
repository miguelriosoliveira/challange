const fs = require("fs");
const readLine = require("readline");

class Player {
    constructor() {
        this.coins = 300;
        this.position = 0;
    }

    move() {
        let boardSize = properties.length - 1;
        let nSteps = getRndInteger(1, 6);
        let newPosition = this.position + nSteps;
        if (newPosition <= boardSize) {
            this.position = newPosition;
        } else {
            this.position = newPosition - boardSize;
            this.coins += 100;
        }
    }
}

class Property {
    constructor(sellPrice, rentPrice) {
        this.ownerId = null;
        this.sellPrice = sellPrice;
        this.rentPrice = rentPrice;
    }
}

let players = [new Player(), new Player(), new Player(), new Player()];
let properties = [];

let lineReader = readLine.createInterface({
    input: fs.createReadStream("gameConfig.txt")
});

lineReader.on("line", line => {
    let lineSplitted = line.split(" ");
    properties.push(new Property(lineSplitted[0], lineSplitted[1]));
}).on("close", () => {
    while (!hasWinner()) {
        players.forEach(player => {
            player.move();
        });
    }
});

function hasWinner() {
    let p1 = players[0];
    let p2 = players[1];
    let p3 = players[2];
    let p4 = players[3];

    if (p1 > 0 && p2 <= 0 && p3 <= 0 && p4 <= 0) {
        return true;
    } else if (p1 <= 0 && p2 > 0 && p3 <= 0 && p4 <= 0) {
        return true;
    } else if (p1 <= 0 && p2 <= 0 && p3 > 0 && p4 <= 0) {
        return true;
    } else if (p1 <= 0 && p2 <= 0 && p3 <= 0 && p4 > 0) {
        return true;
    }

    return false;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
