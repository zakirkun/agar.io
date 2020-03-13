import {
    LOGIN_MODAL_OPEN,
    LOGIN_MODAL_CLOSE,
    MENU_MODAL_OPEN,
    MENU_MODAL_CLOSE,
    GAME_FIELD_OPEN,
    GAME_FIELD_CLOSE
} from "./types";

const openLoginModal = () => ({
    type: LOGIN_MODAL_OPEN
});

const closeLoginModal = () => ({
    type: LOGIN_MODAL_CLOSE
});

const openMenuModal = () => ({
    type: MENU_MODAL_OPEN
});

const closeMenuModal = () => ({
    type: MENU_MODAL_CLOSE
});

const openGameField = () => ({
    type: GAME_FIELD_OPEN
});

const closeGameField = () => ({
    type: GAME_FIELD_CLOSE
});

export {openLoginModal, closeLoginModal, openMenuModal, closeMenuModal, openGameField, closeGameField};
