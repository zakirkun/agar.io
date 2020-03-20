const Orb = require("../classes/Orb");
const PlayerData = require("../classes/PlayerData");
const PlayerConfig = require("../classes/PlayerConfig");
const Player = require("../classes/Player");

const orbs = [];
const players = [];

const settings = {
    orbsNumber: 500,
    size: 5,
    speed: 15,
    zoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000
};

const FPS = 1000 / 30;

const {orbsNumber, size, speed, zoom, worldWidth, worldHeight} = settings;

initGame();

let player;

module.exports = (io) => {
    setInterval(() => {
        const playersData = players.map((player) => player.data);

        io.to("game").emit("SERVER:TOCK", {players: playersData});
    }, FPS);

    io.sockets.on("connection", (socket) => {
        let intervalPlayerLocation;

        socket.on("CLIENT:JOIN_GAME", ({playerName}) => {
            socket.join("game");

            const playerConfig = new PlayerConfig({speed, zoom});
            const playerData = new PlayerData(playerName, {size, worldWidth, worldHeight});

            player = new Player(socket.id, playerConfig, playerData);

            players.push(player);

            intervalPlayerLocation = setInterval(() => {
                socket.emit("SERVER:PLAYER_LOCATION", {locationX: player.data.locationX, locationY: player.data.locationY});
            }, FPS);

            socket.emit("SERVER:ORBS", {orbs});
        });

        socket.on("CLIENT:TICK", ({vectorX, vectorY}) => {
            if (!player) return;

            const speed = player.config.speed;

            const {locationX, locationY} = player.data;

            if ((locationX < 5 && vectorX < 0) || (locationX > worldWidth) && (vectorX > 0)) {
                player.data.locationY -= speed * vectorY;
            } else if ((locationY < 5 && vectorY > 0) || (locationY > worldHeight) && (vectorY < 0)) {
                player.data.locationX += speed * vectorX;
            } else {
                player.data.locationX += speed * vectorX;
                player.data.locationY -= speed * vectorY;
            }
        });

        socket.on("disconnect", () => {
            clearInterval(intervalPlayerLocation);

            socket.leave("game");
        });
    });
};

function initGame() {
    for (let i = 0; i < orbsNumber; i++) {
        const orb = new Orb({worldWidth, worldHeight});

        orbs.push(orb);
    }
}