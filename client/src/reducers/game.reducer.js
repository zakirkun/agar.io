import {GAME_LEADERBOARD_RECEIVE} from "../actions/types";

const initialState = {
    leaderboard: null
};

const gameReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case GAME_LEADERBOARD_RECEIVE:
            return {
                ...state,
                leaderboard: payload.leaderboard
            };

        default:
            return state;
    }
};

export {gameReducer};