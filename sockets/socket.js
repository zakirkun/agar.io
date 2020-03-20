const Orb = require("../classes/Orb");
const PlayerData = require("../classes/PlayerData");
const PlayerConfig = require("../classes/PlayerConfig");
const Player = require("../classes/Player");

const orbs = [];
const players = [];

const settings = {
    orbsNumber: 500,
    size: 10,
    speed: 7,
    zoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000
};

const FPS = 1000 / 60;

const {orbsNumber, size, speed, zoom, worldWidth, worldHeight} = settings;

initGame();

let player;

module.exports = (io) => {
    setInterval(() => {
        const playersData = players.map((player) => player.data);

        io.to("game").emit("SERVER:TOCK", {players: playersData});
    }, FPS);

    io.sockets.on("connection", (socket) => {
        socket.on("CLIENT:JOIN_GAME", ({playerName, id}) => {
            socket.join("game");

            const playerConfig = new PlayerConfig({speed, zoom});
            const playerData = new PlayerData(playerName, id, {size, worldWidth, worldHeight});

            player = new Player(socket.id, playerConfig, playerData);

            players.push(player);

            socket.emit("SERVER:ORBS", {orbs});
        });

        socket.on("CLIENT:TICK", ({vectorX, vectorY}) => {
            if (!player) return;

            const speed = player.config.speed;

            const {locationX, locationY} = player.data;

            if ((locationX < 5 && vectorX < 0) || (locationX > worldWidth) && (vectorX > 0)) {
                player.data.locationY -= speed * vectorY;

                setMinimalAndMaximalLocation();
            } else if ((locationY < 5 && vectorY > 0) || (locationY > worldHeight) && (vectorY < 0)) {
                player.data.locationX += speed * vectorX;

                setMinimalAndMaximalLocation();
            } else {
                player.data.locationX += speed * vectorX;
                player.data.locationY -= speed * vectorY;

                setMinimalAndMaximalLocation();
            }
        });

        socket.on("disconnect", () => {
            socket.leave("game");
        });

        function setMinimalAndMaximalLocation() {
            if (player.data.locationY < 0) player.data.locationY = 0;
            if (player.data.locationX < 0) player.data.locationX = 0;

            if (player.data.locationX > worldWidth) player.data.locationX = worldWidth;
            if (player.data.locationY > worldHeight) player.data.locationY = worldHeight;
        }
    });
};

function initGame() {
    for (let i = 0; i < orbsNumber; i++) {
        const orb = new Orb({worldWidth, worldHeight});

        orbs.push(orb);
    }
}