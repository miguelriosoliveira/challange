const fs = require("fs");
const readLine = require("readline");
const PLAYER_TYPES = require("./PlayerTypes");
const Player = require("./Player");
const Property = require("./Property");

let players = [
    new Player(0, PLAYER_TYPES.IMPULSIVE),
    new Player(1, PLAYER_TYPES.DEMANDING),
    new Player(2, PLAYER_TYPES.CAUTIOUS),
    new Player(3, PLAYER_TYPES.RANDOM)
];
let properties = [];

let lineReader = readLine.createInterface({
    input: fs.createReadStream("gameConfig.txt")
});

lineReader.on("line", line => {
    let lineSplitted = line.split(" ");
    properties.push(new Property(Number(lineSplitted[0]), Number(lineSplitted[1])));
}).on("close", () => {
    let analytics = [];
    for (let i = 0; i < 300; i++) {
        let matchData = match();
        console.log(matchData);
        analytics.push(matchData);
    }
    let timeOuts = 0;
    let avgRounds = 0;
    let victoriesByPlayerType = {
        IMPULSIVE: 0,
        DEMANDING: 0,
        CAUTIOUS: 0,
        RANDOM: 0
    };
    for (let matchData of analytics) {
        let {rounds, winnerType} = matchData;
        if (rounds == 1000) {
            timeOuts++;
        }
        avgRounds += rounds / analytics.length;
        victoriesByPlayerType[winnerType] += 1 / 300;
    }
    avgRounds = Math.round(avgRounds);
    Object.keys(victoriesByPlayerType).forEach(playerType => {
        victoriesByPlayerType[playerType] = Math.round(victoriesByPlayerType[playerType] * 10000) / 100;
    });
    let arr = Object.values(victoriesByPlayerType);
    let max = Math.max(...arr);
    let mostWinningType = {name: "", victoryRate: null};
    for (let type in victoriesByPlayerType) {
        if (victoriesByPlayerType.hasOwnProperty(type)) {
            if (victoriesByPlayerType[type] == max) {
                mostWinningType.name = type;
                mostWinningType.victoryRate = max + " %";
            }
        }
    }

    console.log("Partidas terminadas por time out:", timeOuts);
    console.log("Média de rodadas por partida:", avgRounds);
    console.log("Percentual de vitórias por comportamento:");
    console.log("\tIMPULSIVE:", victoriesByPlayerType.IMPULSIVE + " %");
    console.log("\tDEMANDING:", victoriesByPlayerType.DEMANDING + " %");
    console.log("\t CAUTIOUS:", victoriesByPlayerType.CAUTIOUS + " %");
    console.log("\t   RANDOM:", victoriesByPlayerType.RANDOM + " %");
    console.log(`Comportamento que mais venceu: ${mostWinningType.name} -> ${mostWinningType.victoryRate}`);
});

function hasWinner() {
    let p1 = players[0].coins;
    let p2 = players[1].coins;
    let p3 = players[2].coins;
    let p4 = players[3].coins;

    if (p1 > 0 && p2 < 0 && p3 < 0 && p4 < 0) {
        return true;
    } else if (p1 < 0 && p2 > 0 && p3 < 0 && p4 < 0) {
        return true;
    } else if (p1 < 0 && p2 < 0 && p3 > 0 && p4 < 0) {
        return true;
    } else if (p1 < 0 && p2 < 0 && p3 < 0 && p4 > 0) {
        return true;
    }

    return false;
}

function printWinner() {
    let winner = {id: null, coins: 0};

    for (let player of players) {
        if (!player.canMove()) continue;
        if (player.coins > winner.coins) {
            winner = player;
        } else if (player.coins == winner.coins && player.id < winner.id) {
            winner = player;
        }
    }

    // console.log(players)

    // console.log("WINNER:", winner, Object.keys(PLAYER_TYPES)[winner.type]);
    return winner;
}

function shuffle(array) {
    for (let i = array.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
}

function setIds(players) {
    players.forEach((player, i) => player.id = i);
}

function match() {
    players = [
        new Player(0, PLAYER_TYPES.IMPULSIVE),
        new Player(1, PLAYER_TYPES.DEMANDING),
        new Player(2, PLAYER_TYPES.CAUTIOUS),
        new Player(3, PLAYER_TYPES.RANDOM)
    ];
    shuffle(players);
    setIds(players);
    let round = 0;
    while (!hasWinner() && round < 1000) {
        players.forEach(player => {
            if (!player.canMove()) {
                return;
            }
            player.move(properties);
            let currentProperty = properties[player.position];
            if (currentProperty.ownerId) {
                if (currentProperty.ownerId != player.id) {
                    let propertyOwner = players.find(player => player.id == currentProperty.ownerId);
                    player.payRent(currentProperty, propertyOwner);
                    if (!player.canMove()) {
                        properties.forEach(prop => {
                            if (prop.ownerId == player.id) prop.returnToSelling();
                        });
                    }
                }
            } else {
                player.considerBuying(currentProperty);
            }
        });
        round++;
    }
    let winner = printWinner();
    // console.log("ROUNDS TO FINISH:", round);
    return {
        rounds: round,
        winnerType: Object.keys(PLAYER_TYPES)[winner.type]
    };
}