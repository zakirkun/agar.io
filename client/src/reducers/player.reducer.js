import {PLAYER_LOGIN, SET_MOUSE_POSITION} from "../actions/types";

const initialState = {
    name: null,
    initialMousePosition: []
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

        default:
            return state;
    }
};

export {playerReducer};