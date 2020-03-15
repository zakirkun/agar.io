import React from "react";
import {connect} from "react-redux";

import {LoginModal} from "../../components/modals/login-modal";
import {MenuModal} from "../../components/modals/menu-modal";
import {GameField} from "../../components/game-field";

const MainPage = (props) => {
    const {isGameFieldOpen, isLoginModalOpen, isMenuModalOpen} = props;

    const gameField = isGameFieldOpen ? <GameField /> : null;
    const loginModal = isLoginModalOpen ? <LoginModal /> : null;
    const menuModal = isMenuModalOpen ? <MenuModal /> : null;

    return (
        <>
            {gameField}
            {loginModal}
            {menuModal}
        </>
    );
};

const mapStateToProps = (state) => ({
    isGameFieldOpen: state.windowState.isGameFieldOpen,
    isLoginModalOpen: state.windowState.isLoginModalOpen,
    isMenuModalOpen: state.windowState.isMenuModalOpen
});

export default connect(mapStateToProps, null)(MainPage);
