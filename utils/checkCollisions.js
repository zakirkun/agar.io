const Orb = require("../classes/Orb");

let distance;

function checkForOrbCollisions(playerData, playerConfig, orbs, options) {
    let {locationX, locationY, radius} = playerData;
    let {zoom, speed} = playerConfig;

    return new Promise((resolve, reject) => {
        orbs.forEach((orb, idx) => {
            const {radius: orbRadius, locationX: orbLocationX, locationY: orbLocationY} = orb;

            if (locationX + radius + orbRadius > orbLocationX
                && locationX < orbLocationX + radius + orbRadius
                && locationY + radius + orbRadius > orbLocationY
                && locationY < orbLocationY + radius + orbRadius) {

                distance = Math.sqrt(
                    ((locationX - orbLocationX) * (locationX - orbLocationX)) +
                    ((locationY - orbLocationY) * (locationY - orbLocationY))
                );

                if (distance < radius + orbRadius) {
                    // collision
                    playerData.score += 1;

                    playerData.orbsAbsorbed += 1;

                    if (zoom > 1) playerConfig.zoom -= .001;

                    playerData.radius += 0.25;

                    if (speed < -0.005) {
                        playerConfig.speed += 0.005;
                    } else if (speed > 0.005) {
                        playerConfig.speed -= 0.005;
                    }

                    orbs.splice(idx, 1, new Orb({worldWidth: options.worldWidth, worldHeight: options.worldHeight}));

                    resolve(idx);
                }
            }
        });

        reject()
    });
}

function checkForPlayerCollisions(currentPlayerData, currentPlayerConfig, players, cb) {
    const {id: currentId, locationX, locationY, radius} = currentPlayerData;
    const {zoom} = currentPlayerConfig;

    return new Promise((resolve, reject) => {
        players.forEach((player, idx) => {
            const {id} = player;

            if (id !== currentId) {
                const {locationX: playerLocationX, locationY: playerLocationY, radius: playerRadius} = player;

                if (locationX + radius + playerRadius > playerLocationX
                    && locationX < playerLocationX + radius + playerRadius
                    && locationY + radius + playerRadius > playerLocationY
                    && locationY < playerLocationY + radius + playerRadius) {

                    distance = Math.sqrt(
                        ((locationX - playerLocationX) * (locationX - playerLocationX)) +
                        ((locationY - playerLocationY) * (locationY - playerLocationY))
                    );

                    if (distance < radius + playerRadius) {
                        if (radius > playerRadius) {
                            let collisionData = updateScores(currentPlayerData, player, idx);

                            if (zoom > 1) currentPlayerConfig.zoom -= (playerRadius * 0.25) * .001;

                            cb(player);

                            resolve(collisionData);
                        }
                    }
                }
            }
        });

        reject();
    });
}

function updateScores(killer, killed, idx) {
    killer.score += (killed.score + 10);
    killer.playersAbsorbed += 1;
    killed.alive = false;
    killer.radius += (killed.radius * 0.25);
    killed.idx = idx;

    return {
        died: killed,
        killedBy: killer
    };
}

module.exports = {checkForOrbCollisions, checkForPlayerCollisions};