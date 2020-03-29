const Orb = require("../classes/Orb");
const PlayerData = require("../classes/PlayerData");
const PlayerConfig = require("../classes/PlayerConfig");
const Player = require("../classes/Player");
const {checkForOrbCollisions, checkForPlayerCollisions} = require("../utils/checkCollisions");

const settings = {
    orbsNumber: 5000,
    size: 10,
    speed: 7,
    zoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000
};

const {orbsNumber, size, speed, zoom, worldWidth, worldHeight} = settings;

let
    orbs = [],
    playersData = [],
    players = [],
    FPS = 1000 / 60;

initGame();

module.exports = (io) => {
    setInterval(() => {
        io.to("game").emit("SERVER:PLAYERS", {players: playersData});
    }, FPS);

    io.sockets.on("connection", (socket) => {
        socket.player = {};
        socket.playerData = {};
        socket.playerConfig = {};

        socket.on("CLIENT:JOIN_GAME", ({playerName, id: clientId}) => {
            socket.playerConfig = new PlayerConfig({speed, zoom});
            socket.playerData = new PlayerData(playerName, clientId, socket.id, {size, worldWidth, worldHeight});
            socket.player = new Player(socket.id, socket.playerConfig, socket.playerData);

            players.push(socket.player);
            playersData.push(socket.player.data);

            const leaderboard = getLeaderboard(playersData);

            socket.join("game");

            socket.emit("SERVER:ORBS", {orbs});
            socket.emit("SERVER:LEADERBOARD", {leaderboard});

            socket.intervalPlayerData = setInterval(() => {
                socket.emit("SERVER:PLAYER_DATA", {player: socket.playerData});
            }, FPS);
        });

        socket.on("CLIENT:VECTORS", ({vectorX, vectorY}) => {
            let
                {playerData, playerConfig} = socket,
                {speed = settings.speed} = playerConfig,
                {locationX, locationY} = playerData;

            if ((locationX < 5 && vectorX < 0) || (locationX > worldWidth) && (vectorX > 0)) {
                playerData.locationY -= speed * vectorY;
            } else if ((locationY < 5 && vectorY > 0) || (locationY > worldHeight) && (vectorY < 0)) {
                playerData.locationX += speed * vectorX;
            } else {
                playerData.locationX += speed * vectorX;
                playerData.locationY -= speed * vectorY;
            }

            setMinimalAndMaximalLocation();

            checkForOrbCollisions(playerData, playerConfig, orbs, {worldWidth, worldHeight})
                .then((res) => {
                    const
                        orb = orbs[res],
                        leaderboard = getLeaderboard(playersData);

                    io.to("game").emit("SERVER:ORBS_UPDATE", {newOrb: orb, idx: res});
                    io.to("game").emit("SERVER:LEADERBOARD_UPDATE", {leaderboard});
                })
                .catch(() => {});

            checkForPlayerCollisions(playerData, playerConfig, playersData, (killedPlayerData) => {
                const socket = io.of("/").connected[killedPlayerData.socketId];

                logout(socket);
            })
                .then((res) => {
                    socket.emit("SERVER:PLAYER_DEATH", res);
                })
                .catch(() => {});
        });

        socket.on("CLIENT:LEAVE_GAME", () => {
            if (checkIfIsClientInGame("game")) logout(socket);
        });

        function setMinimalAndMaximalLocation() {
            const
                {playerData} = socket,
                {locationX, locationY} = playerData;

            if (locationY < 0) playerData.locationY = 0;
            if (locationX < 0) playerData.locationX = 0;

            if (locationX > worldWidth) playerData.locationX = worldWidth;
            if (locationY > worldHeight) playerData.locationY = worldHeight;
        }

        function getLeaderboard(playersData) {
            return playersData.map((player) => ({id: player.id, name: player.name, score: player.score}))
                .sort((a, b) => b.score - a.score);
        }

        function logout(socket) {
            const {intervalPlayerData} = socket;

            socket.leave("game");

            clearInterval(intervalPlayerData);

            const playerDataIdx = playersData.findIndex((playerData) => playerData.id === socket.playerData.id);
            const playerIdx = players.findIndex((player) => player.id === socket.player.id);

            playersData.splice(playerDataIdx, 1);
            players.splice(playerIdx, 1);

            io.to("game").emit("SERVER:LEADERBOARD_UPDATE", {leaderboard: getLeaderboard(playersData)});

            socket.emit("SERVER:LEAVE_GAME", {playerData: socket.playerData});
        }

        function checkIfIsClientInGame(roomName) {
            return io.sockets.adapter.sids[socket.id][roomName];
        }
    });
};

function initGame() {
    for (let i = 0; i < orbsNumber; i++) {
        const orb = new Orb({worldWidth, worldHeight});

        orbs.push(orb);
    }
}