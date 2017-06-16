const PLAYER_TYPES = require("./PlayerTypes");

class Player {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.coins = 300;
        this.position = 0;
    }

    canMove() {
        return this.coins >= 0;
    }

    move(properties) {
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

    considerBuying(property) {
        if (!property.ownerId && this.coins >= property.sellPrice) {
            switch (this.type) {
                case PLAYER_TYPES.IMPULSIVE:
                    this.buy(property);
                    break;
                case PLAYER_TYPES.DEMANDING:
                    if (property.rentPrice) {
                        this.buy(property);
                    }
                    break;
                case PLAYER_TYPES.CAUTIOUS:
                    if (this.coins - property.sellPrice >= 80) {
                        this.buy(property);
                    }
                    break;
                case PLAYER_TYPES.RANDOM:
                    if (Math.random() >= 0.5) {
                        this.buy(property);
                    }
                    break;
            }
        }
    }

    buy(property) {
        property.setOwner(this.id);
        this.coins -= property.sellPrice;
    }

    payRent(property, owner) {

        // console.log("[BEFORE] this.coins, property.rentPrice, owner.coins")
        // console.log(this.coins, property.rentPrice, owner.coins)
        // console.log("this.coins -= property.rentPrice")
        // console.log(`${this.coins} - ${property.rentPrice} =`, this.coins - property.rentPrice)

        this.coins -= property.rentPrice;
        owner.receiveRent(property.rentPrice);

        // console.log("[AFTER] this.coins, owner.coins")
        // console.log(this.coins, owner.coins)
        // console.log("============================")
    }

    receiveRent(rentValue) {

        // console.log("this.coins += rentValue")
        // console.log(`${this.coins} + ${rentValue} =`, this.coins + rentValue)

        this.coins += rentValue;
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Player;