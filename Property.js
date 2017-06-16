class Property {
    constructor(sellPrice, rentPrice) {
        this.ownerId = null;
        this.sellPrice = sellPrice;
        this.rentPrice = rentPrice;
    }

    setOwner(playerId) {
        this.ownerId = playerId;
    }

    returnToSelling() {
        this.ownerId = null;
    }
}

module.exports = Property;