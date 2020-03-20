import {PLAYER_LOGIN, SET_MOUSE_POSITION} from "./types";

const loginPlayer = (payload) => ({
    type: PLAYER_LOGIN,
    payload
});

const setMousePosition = (payload) => ({
    type: SET_MOUSE_POSITION,
    payload
});

export {loginPlayer, setMousePosition};