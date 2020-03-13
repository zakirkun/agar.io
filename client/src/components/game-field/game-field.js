import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";

import {socket} from "../../utils/socketConnection";
import styles from "./game-field.module.css";
import {receiveGameLeaderboard} from "../../actions/game.action";

const GameField = (props) => {
    const {leaderboard, messageBlock, leadersList, leader, leaderNumber, leaderName, canvas, leaderboardTitle, leaderboardHeader} = styles;
    const {isGameFieldOpen} = props;

    const [isWindowResizeHandlerSet, setIsWindowResizeHandlerSet] = useState(false);
    const [isDrawingRunning, setIsDrawingRunning] = useState(false);

    const canvasRef = useRef();

    const randomX = Math.floor(500 * Math.random() + 10);
    const randomY = Math.floor(500 * Math.random() + 10);

    function draw(canvasCtx) {
        canvasCtx.beginPath();
        canvasCtx.fillStyle = "rgb(255, 0, 0)";
        canvasCtx.arc(randomX, randomY, 10, 0, Math.PI * 2);
        canvasCtx.fill();
        canvasCtx.lineWidth = 3;
        canvasCtx.strokeStyle = "rgb(0, 255, 0)";
        canvasCtx.stroke();

        requestAnimationFrame(() => draw(canvasCtx));

        setIsDrawingRunning(true);
    }

    // canvas size change
    useEffect(() => {
        if (!isGameFieldOpen) return;

        const canvasElement = canvasRef.current;

        canvasElement.width = document.documentElement.clientWidth;
        canvasElement.height = document.documentElement.clientHeight;

        if (!isWindowResizeHandlerSet) {
            window.addEventListener("resize", () => {
                canvasElement.width = document.documentElement.clientWidth;
                canvasElement.height = document.documentElement.clientHeight;
            });

            setIsWindowResizeHandlerSet(true);
        }
    }, [isGameFieldOpen]);

    // drawing canvas
    useEffect(() => {
        if (!isGameFieldOpen) return;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");

        if (!isDrawingRunning) draw(canvasCtx);
    }, [isGameFieldOpen]);

    // socket events
    useEffect(() => {
        if (!isGameFieldOpen) return;

        socket.on("SERVER:LEADERBOARD", receiveGameLeaderboard);

        return () => {
            socket.off("SERVER:LEADERBOARD", receiveGameLeaderboard);
        };
    }, [isGameFieldOpen]);

    if (!isGameFieldOpen) return null;

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
    isGameFieldOpen: state.windowState.isGameFieldOpen
});

export default connect(mapStateToProps, null)(GameField);