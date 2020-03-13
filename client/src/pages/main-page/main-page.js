import React, {useEffect, useRef} from "react";

import "./main-page.css";
import {LoginModal} from "../../components/modals/login-modal";
import {MenuModal} from "../../components/modals/menu-modal";
import {GameField} from "../../components/game-field";

const MainPage = () => {
    return (
        <>
            <LoginModal />
            <MenuModal />
            <GameField />
        </>
    );
};

export default MainPage;
