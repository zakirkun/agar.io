const Orb = require("../classes/Orb");
const PlayerData = require("../classes/PlayerData");
const PlayerConfig = require("../classes/PlayerConfig");
const Player = require("../classes/Player");
const {checkForOrbCollisions, checkForPlayerCollisions} = require("../utils/checkCollisions");

const settings = {
    orbsNumber: 50,
    size: 10,
    speed: 7,
    zoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
};

const {orbsNumber, size, speed, zoom, worldWidth, worldHeight} = settings;

const orbs = [], FPS = 1000 / 60;

initGame();

module.exports = (io) => {
    let playersData = [], players = [];

    setInterval(() => {
        io.to("game").emit("SERVER:PLAYERS", {players: playersData});
    }, FPS);

    io.sockets.on("connection", (socket) => {
        let player = socket.player = null;
        let playerData = socket.playerData = {};
        let playerConfig = socket.playerConfig = {};
        let intervalPlayerData = socket.intervalPlayerData = null;
        let playerDataIdx = socket.playerDataIdx = null;
        let playerIdx = socket.playerIdx = null;

        socket.on("CLIENT:JOIN_GAME", ({playerName, id}) => {
            playerConfig = new PlayerConfig({speed, zoom});
            playerData = new PlayerData(playerName, id, {size, worldWidth, worldHeight});

            player = new Player(socket.id, playerConfig, playerData);

            players.push(player);
            playersData.push(player.data);

            playerDataIdx = playersData.indexOf(player.data);
            playerIdx = players.indexOf(player);

            socket.join("game");

            intervalPlayerData = setInterval(() => {
                socket.emit("SERVER:PLAYER_DATA", {playerData});
            }, FPS);

            socket.emit("SERVER:ORBS", {orbs});
        });

        socket.on("CLIENT:VECTORS", ({vectorX, vectorY}) => {
            if (!player) return;

            const {speed} = playerConfig;

            let {locationX, locationY} = playerData;

            if ((locationX < 5 && vectorX < 0) || (locationX > worldWidth) && (vectorX > 0)) {
                playerData.locationY -= speed * vectorY;

                setMinimalAndMaximalLocation();
            } else if ((locationY < 5 && vectorY > 0) || (locationY > worldHeight) && (vectorY < 0)) {
                playerData.locationX += speed * vectorX;

                setMinimalAndMaximalLocation();
            } else {
                playerData.locationX += speed * vectorX;
                playerData.locationY -= speed * vectorY;

                setMinimalAndMaximalLocation();
            }

            checkForOrbCollisions(playerData, playerConfig, orbs, {worldWidth, worldHeight})
                .then((res) => {
                    const orb = orbs[res];

                    io.to("game").emit("SERVER:ORBS_UPDATE", {newOrb: orb, idx: res});
                })
                .catch((error) => {});

            checkForPlayerCollisions(playerData, playerConfig, playersData)
                .then((res) => {
                    console.log("Player collision");
                })
                .catch(() => {});
        });

        socket.on("disconnect", () => {
            socket.leave("game");

            clearInterval(intervalPlayerData);

            playersData.splice(playerDataIdx, 1);
            players.splice(playerIdx, 1);
        });

        function setMinimalAndMaximalLocation() {
            const {locationX, locationY} = playerData;

            if (locationY < 0) playerData.locationY = 0;
            if (locationX < 0) playerData.locationX = 0;

            if (locationX > worldWidth) playerData.locationX = worldWidth;
            if (locationY > worldHeight) playerData.locationY = worldHeight;
        }
    });
};

function initGame() {
    for (let i = 0; i < orbsNumber; i++) {
        const orb = new Orb({worldWidth, worldHeight});

        orbs.push(orb);
    }
}