import {PLAYER_LOGIN, SET_GAME_RESULT, SET_MOUSE_POSITION} from "./types";

const loginPlayer = (payload) => ({
    type: PLAYER_LOGIN,
    payload
});

const setMousePosition = (payload) => ({
    type: SET_MOUSE_POSITION,
    payload
});

const setGameResult = (payload) => ({
    type: SET_GAME_RESULT,
    payload
});

export {loginPlayer, setMousePosition, setGameResult};