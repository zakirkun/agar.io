import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {v4} from "uuid";

import styles from "./game-field.module.css";
import {socket} from "../../utils/socketConnection";
import {FPS} from "../../constants";
import {setGameResult} from "../../actions/player.action";
import {closeGameField, openMenuModal} from "../../actions/window.action";

let players = [],
    orbs = [],
    vectorX = 0,
    vectorY = 0,
    player = {},
    playerId,
    isGameRunning = false;

const GameField = (props) => {
    const {leaderboard: leaderboardStyle, messageBlock, leadersList, leader, leaderNumber, leaderName, canvas, leaderboardTitle, leaderboardHeader, leaderScore} = styles;
    const {playerName, initialMousePosition, setGameResult, closeGameField, openMenuModal} = props;

    const [leaderboard, setLeaderboard] = useState([]);

    const canvasRef = useRef(null);

    function draw(ctx, canvasWidth, canvasHeight) {
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

        if (isGameRunning) requestAnimationFrame(() => draw(ctx, canvasWidth, canvasHeight));
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

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener("resize", setCanvasSize);

        return () => {
            window.removeEventListener("resize", setCanvasSize);
        };
    }, []);

    useEffect(() => {
        isGameRunning = true;

        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");

        draw(ctx, canvas.width, canvas.height);

        return () => {
            isGameRunning = false;
        };
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
        socket.on("SERVER:LEADERBOARD", ({leaderboard}) => setLeaderboard(leaderboard));
        socket.on("SERVER:ORBS_UPDATE", ({newOrb, idx}) => orbs.splice(idx, 1, newOrb));
        socket.on("SERVER:PLAYERS", ({players: playersArray}) => players = playersArray);
        socket.on("SERVER:PLAYER_DATA", ({player: playerData}) => player = playerData);
        socket.on("SERVER:LEADERBOARD_UPDATE", ({leaderboard}) => setLeaderboard(leaderboard));
        socket.on("SERVER:LEAVE_GAME", ({playerData}) => {
            setGameResult({gameResult: playerData});

            closeGameField();
            openMenuModal();
        });

        socket.emit("CLIENT:JOIN_GAME", {playerName, id: playerId});

        const intervalTick = setInterval(() => {
            socket.emit("CLIENT:VECTORS", {vectorX, vectorY});
        }, FPS);

        return () => {
            clearInterval(intervalTick);

            socket.off("SERVER:ORBS");
            socket.off("SERVER:LEADERBOARD");
            socket.off("SERVER:ORBS_UPDATE");
            socket.off("SERVER:PLAYERS");
            socket.off("SERVER:PLAYER_DATA");
            socket.off("SERVER:LEADERBOARD_UPDATE");
            socket.off("SERVER:LEAVE_GAME");

            socket.emit("CLIENT:LEAVE_GAME");
        };
    }, []);

    const renderLeaderboard = () => (
        leaderboard.map((player, idx) => (
            <div className={leader}>
                <span className={leaderNumber}>{idx + 1}</span>
                <span className={leaderName}>{player.name}</span>
                <span className={leaderScore}>{player.score}</span>
            </div>
        ))
    );

    return (
        <>
            <canvas ref={canvasRef} className={canvas} onMouseMove={onCanvasMouseMove} width={window.innerWidth} height={window.innerHeight} />

            <div className={leaderboardStyle}>
                <div className={leaderboardHeader}>
                    <h4 className={leaderboardTitle}>Leaderboard</h4>
                </div>

                <div className={leadersList}>
                    {renderLeaderboard()}
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

const mapDispatchToProps = (dispatch) => ({
    setGameResult: (payload) => dispatch(setGameResult(payload)),
    closeGameField: () => dispatch(closeGameField()),
    openMenuModal: () => dispatch(openMenuModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameField);