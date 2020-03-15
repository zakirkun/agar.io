import {PLAYER_LOGIN, SET_PLAYER_LOCATION, MODIFY_PLAYER_LOCATION_X, MODIFY_PLAYER_LOCATION_Y} from "../actions/types";

const initialState = {
    player: null
};

const playerReducer = (state = initialState, action) => {
    const {type, payload} = action;

    function changeBySign(sign, previousValue, value) {
        switch (sign) {
            case "+":
                return previousValue + value;

            case "-":
                return previousValue - value;

            case "/":
                return previousValue / value;

            case "*":
                return previousValue * value;

            default:
                return previousValue;
        }
    }

    switch (type) {
        case PLAYER_LOGIN:
            return {
                ...state,
                player: {...state.player, name: payload.name}
            };

        case SET_PLAYER_LOCATION:
            return {
                ...state,
                player: {...state.player, locationX: payload.locationX, locationY: payload.locationY}
            };

        case MODIFY_PLAYER_LOCATION_X:
            return {
                ...state,
                player: {...state.player, locationX: changeBySign(payload.sign, state.player.locationX, payload.locationX)}
            };

        case MODIFY_PLAYER_LOCATION_Y:
            return {
                ...state,
                player: {...state.player, locationY: changeBySign(payload.sign, state.player.locationY, payload.locationY)}
            };

        default:
            return state;
    }
};

export {playerReducer};