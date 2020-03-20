import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";

import styles from "./game-field.module.css";
import {socket} from "../../utils/socketConnection";
import {FPS} from "../../constants";

const player = {};
let players = [];
let orbs = [];

let vectorX = 0, vectorY = 0;

const GameField = (props) => {
    const {leaderboard, messageBlock, leadersList, leader, leaderNumber, leaderName, canvas, leaderboardTitle, leaderboardHeader} = styles;
    const {playerName, initialMousePosition} = props;

    const canvasRef = useRef(null);

    // canvas draw
    function draw(canvas) {
        const ctx = canvas.getContext("2d");

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const camX = -player.locationX + canvasWidth / 2;
        const camY = -player.locationY + canvasHeight / 2;

        ctx.translate(camX, camY);

        players.forEach((player) => {
            ctx.beginPath();

            ctx.fillStyle = player.color;
            ctx.arc(player.locationX, player.locationY, player.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgb(0,255,0)";
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

    // mouse logic
    function onCanvasMouseMove(event) {
        const {clientX: x, clientY: y} = event;
        const canvas = event.currentTarget;

        setVectors(canvas, x, y);
    }

    function setVectors(canvas, x, y) {
        const angleDeg = Math.atan2(y - (canvas.height / 2), x - (canvas.width / 2)) * 180 / Math.PI;

        if (angleDeg >= 0 && angleDeg < 90) {
            // console.log("Mouse is in the lower right quad")
            vectorX = 1 - (angleDeg / 90);
            vectorY = -(angleDeg / 90);
        } else if (angleDeg >= 90 && angleDeg <= 180) {
            // console.log("Mouse is in the lower left quad")
            vectorX = -(angleDeg - 90) / 90;
            vectorY = -(1 - ((angleDeg - 90) / 90));
        } else if (angleDeg >= -180 && angleDeg < -90) {
            // console.log("Mouse is in the upper left quad")
            vectorX = (angleDeg + 90) / 90;
            vectorY = (1 + ((angleDeg + 90) / 90));
        } else if (angleDeg < 0 && angleDeg >= -90) {
            // console.log("Mouse is in the upper right quad")
            vectorX = (angleDeg + 90) / 90;
            vectorY = (1 - ((angleDeg + 90) / 90));
        }
    }

    // draw canvas effect
    useEffect(() => {
        const canvas = canvasRef.current;

        draw(canvas);
    }, []);

    // canvas size effect
    useEffect(() => {
        const canvas = canvasRef.current;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        setCanvasSize();

        window.addEventListener("resize", setCanvasSize);
    }, []);

    // set initial locations effect
    useEffect(() => {
        const canvas = canvasRef.current;

        const x = initialMousePosition[0];
        const y = initialMousePosition[1];

        setVectors(canvas, x, y);
    }, []);

    // socket logic effect
    useEffect(() => {
        socket.on("SERVER:ORBS", ({orbs: orbsArray}) => {
            orbs = orbsArray;
        });

        socket.on("SERVER:PLAYER_LOCATION", ({locationX, locationY}) => {
            player.locationX = locationX;
            player.locationY = locationY;
        });

        socket.on("SERVER:TOCK", ({players: playersArray}) => {
            players = playersArray;
        });

        socket.emit("CLIENT:JOIN_GAME", {playerName});

        setInterval(() => {
            socket.emit("CLIENT:TICK", {vectorX, vectorY});
        }, FPS);
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