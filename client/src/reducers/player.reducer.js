import {PLAYER_LOGIN, SET_GAME_RESULT, SET_MOUSE_POSITION} from "../actions/types";

const initialState = {
    name: null,
    initialMousePosition: [],
    gameResult: null
};

const playerReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case PLAYER_LOGIN:
            return {
                ...state,
                name: payload.name
            };

        case SET_MOUSE_POSITION:
            return {
                ...state,
                initialMousePosition: payload.initialMousePosition
            };

        case SET_GAME_RESULT:
            return {
                ...state,
                gameResult: payload.gameResult
            };

        default:
            return state;
    }
};

export {playerReducer};