import {
    LOGIN_MODAL_OPEN,
    LOGIN_MODAL_CLOSE,
    MENU_MODAL_OPEN,
    MENU_MODAL_CLOSE,
    GAME_FIELD_CLOSE, GAME_FIELD_OPEN
} from "../actions/types";

const initialState = {
    isLoginModalOpen: false,
    isMenuModalOpen: false,
    isGameFieldOpen: false
};

const windowReducer = (state = initialState, action) => {
    const {type} = action;

    switch (type) {
        case LOGIN_MODAL_OPEN:
            return {
                ...state,
                isLoginModalOpen: true
            };

        case LOGIN_MODAL_CLOSE:
            return {
                ...state,
                isLoginModalOpen: false
            };

        case MENU_MODAL_OPEN:
            return {
                ...state,
                isMenuModalOpen: true
            };

        case MENU_MODAL_CLOSE:
            return {
                ...state,
                isMenuModalOpen: false
            };

        case GAME_FIELD_OPEN:
            return {
                ...state,
                isGameFieldOpen: true
            };

        case GAME_FIELD_CLOSE:
            return {
                ...state,
                isGameFieldOpen: false
            };

        default:
            return state;
    }
};

export {windowReducer};