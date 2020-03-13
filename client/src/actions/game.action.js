import {GAME_LEADERBOARD_RECEIVE} from "./types";

const receiveGameLeaderboard = (payload) => ({
    type: GAME_LEADERBOARD_RECEIVE,
    payload
});

export {receiveGameLeaderboard};