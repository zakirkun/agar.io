import {MODIFY_PLAYER_LOCATION_X, MODIFY_PLAYER_LOCATION_Y, PLAYER_LOGIN, SET_PLAYER_LOCATION} from "./types";

const loginPlayer = (payload) => ({
    type: PLAYER_LOGIN,
    payload
});

const setLocation = (payload) => ({
    type: SET_PLAYER_LOCATION,
    payload
});

const modifyLocationX = (payload) => ({
    type: MODIFY_PLAYER_LOCATION_X,
    payload
});

const modifyLocationY = (payload) => ({
    type: MODIFY_PLAYER_LOCATION_Y,
    payload
});

export {loginPlayer, setLocation, modifyLocationX, modifyLocationY};