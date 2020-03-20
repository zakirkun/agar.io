import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";
import {v4} from "uuid";

import styles from "./game-field.module.css";
import {socket} from "../../utils/socketConnection";
import {FPS} from "../../constants";

let players = [],
    orbs = [],
    vectorX = 0,
    vectorY = 0,
    playerId;

const GameField = (props) => {
    const {leaderboard, messageBlock, leadersList, leader, leaderNumber, leaderName, canvas, leaderboardTitle, leaderboardHeader} = styles;
    const {playerName, initialMousePosition} = props;

    const canvasRef = useRef(null);

    function draw(canvas) {
        const ctx = canvas.getContext("2d");

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const player = players.find((player) => player.id === playerId) || {};

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const cameraX = -player.locationX + canvasWidth / 2;
        const cameraY = -player.locationY + canvasHeight / 2;

        ctx.translate(cameraX, cameraY);

        players.forEach((player) => {
            ctx.beginPath();

            ctx.fillStyle = player.color;
            ctx.arc(player.locationX, player.locationY, player.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgb(0, 255, 0)";
            ctx.stroke();
        });

        orbs.forEach((orb) => {
            ctx.beginPath();

            ctx.fillStyle = orb.color;
            ctx.arc(orb.locationX, orb.locationY, orb.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(() => draw(canvas));
    }

    function onCanvasMouseMove(event) {
        const {clientX: x, clientY: y} = event;
        const canvas = event.currentTarget;

        setVectors(canvas, x, y);
    }

    function setVectors(canvas, x, y) {
        const angleDeg = Math.atan2(y - (canvas.height / 2), x - (canvas.width / 2)) * 180 / Math.PI;

        if (angleDeg >= 0 && angleDeg < 90) {
            vectorX = 1 - (angleDeg / 90);
            vectorY = -(angleDeg / 90);
        } else if (angleDeg >= 90 && angleDeg <= 180) {
            vectorX = -(angleDeg - 90) / 90;
            vectorY = -(1 - ((angleDeg - 90) / 90));
        } else if (angleDeg >= -180 && angleDeg < -90) {
            vectorX = (angleDeg + 90) / 90;
            vectorY = (1 + ((angleDeg + 90) / 90));
        } else if (angleDeg < 0 && angleDeg >= -90) {
            vectorX = (angleDeg + 90) / 90;
            vectorY = (1 - ((angleDeg + 90) / 90));
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        draw(canvas);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        setCanvasSize();

        window.addEventListener("resize", setCanvasSize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        const x = initialMousePosition[0];
        const y = initialMousePosition[1];

        setVectors(canvas, x, y);
    }, []);

    useEffect(() => {
        playerId = v4();

        socket.on("SERVER:ORBS", ({orbs: orbsArray}) => orbs = orbsArray);

        socket.on("SERVER:TOCK", ({players: playersArray}) => players = playersArray);

        socket.emit("CLIENT:JOIN_GAME", {playerName, id: playerId});

        const intervalTick = setInterval(() => socket.emit("CLIENT:TICK", {vectorX, vectorY}), FPS);

        return () => {
            clearInterval(intervalTick);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className={canvas} onMouseMove={onCanvasMouseMove} />

            <div className={leaderboard}>
                <div className={leaderboardHeader}>
                    <h4 className={leaderboardTitle}>Leaderboard</h4>
                </div>

                <div className={leadersList}>
                    <div className={leader}>
                        <span className={leaderNumber}>1.</span>
                        <span className={leaderName}>Ansat</span>
                    </div>
                    <div className={leader}>
                        <span className={leaderNumber}>2.</span>
                        <span className={leaderName}>Ansat2</span>
                    </div>
                    <div className={leader}>
                        <span className={leaderNumber}>3.</span>
                        <span className={leaderName}>Ansat3</span>
                    </div>
                    <div className={leader}>
                        <span className={leaderNumber}>4.</span>
                        <span className={leaderName}>Ansat4</span>
                    </div>
                </div>
            </div>

            <div className={messageBlock}>

            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    initialMousePosition: state.playerState.initialMousePosition,
    playerName: state.playerState.name
});

export default connect(mapStateToProps, null)(GameField);