import {USER_LOGIN} from "../actions/types";

const initialState = {
    name: null
};

const userReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case USER_LOGIN:
            return {
                ...state,
                name: payload.name
            };

        default:
            return state;
    }
};

export {userReducer};