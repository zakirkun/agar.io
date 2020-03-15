import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";

import styles from "./game-field.module.css";
import {modifyLocationY, modifyLocationX, setLocation} from "../../actions/player.action";
import {PLAYER_SPEED} from "../../constants";

const GameField = (props) => {
    const {leaderboard, messageBlock, leadersList, leader, leaderNumber, leaderName, canvas, leaderboardTitle, leaderboardHeader} = styles;

    const canvasRef = useRef(null);

    function initCanvas() {
        const canvasElement = canvasRef.current;

        if (!canvasElement) return;

        const canvasCtx = canvasElement.getContext("2d");

        const player = {
            locationX: Math.floor(Math.random() * 500 + 10),
            locationY: Math.floor(Math.random() * 500 + 10),
            vectorX: 0,
            vectorY: 0
        };

        let {locationX, locationY} = player;

        function drawPlayer() {
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            canvasCtx.setTransform(1, 0, 0, 1, 0, 0);

            const camX = -locationX + canvasElement.width / 2;
            const camY = -locationY + canvasElement.height / 2;

            canvasCtx.translate(camX, camY);

            canvasCtx.beginPath();

            canvasCtx.fillStyle = "rgb(255, 0, 0)";
            canvasCtx.arc(locationX, locationY, 10, 0, Math.PI * 2);
            canvasCtx.arc(200, 200, 10, 0, Math.PI * 2);
            canvasCtx.fill();

            canvasCtx.lineWidth = 3;
            canvasCtx.strokeStyle = "rgb(0, 255, 0)";
            canvasCtx.stroke();

            requestAnimationFrame(drawPlayer);
        }

        drawPlayer();

        let vectorX, vectorY;

        canvasElement.addEventListener("mousemove", (event) => {
            const {clientX: x, clientY: y} = event;

            const angleDegree = Math.atan2(y - (canvasElement.width / 2), x - (canvasElement.height / 2)) * 180 / Math.PI;

            if (angleDegree >= 0 && angleDegree < 90) {
                vectorX = 1 - (angleDegree / 90);
                vectorY = -(angleDegree / 90);
            } else if (angleDegree >= 90 && angleDegree <= 180) {
                vectorX = -(angleDegree - 90) / 90;
                vectorY = -(1 - ((angleDegree - 90) / 90));
            } else if (angleDegree >= -180 && angleDegree < -90) {
                vectorX = (angleDegree + 90) / 90;
                vectorY = (1 + ((angleDegree + 90) / 90));
            } else if (angleDegree < 0 && angleDegree >= -90) {
                vectorX = (angleDegree + 90) / 90;
                vectorY = (1 - ((angleDegree + 90) / 90));
            }

            if ((locationX < 5 && vectorX < 0) || (locationX > 500) && (vectorX > 0)) {
                locationY -= PLAYER_SPEED * vectorY;
            } else if ((locationY < 5 && vectorY > 0) || (locationY > 500) && (vectorY < 0)) {
                locationX += PLAYER_SPEED * vectorX;
            } else {
                locationX += PLAYER_SPEED * vectorX;
                locationY -= PLAYER_SPEED * vectorY;
            }
        });
    }

    useEffect(() => {
        const setCanvasSize = () => {
            const canvasElement = canvasRef.current;

            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;
        };

        setCanvasSize();

        window.addEventListener("resize", setCanvasSize);
    }, []);

    useEffect(() => {
        initCanvas();
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className={canvas} />

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
    isGameFieldOpen: state.windowState.isGameFieldOpen,
    player: state.playerState.player
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(GameField);