import React, {useEffect} from "react";
import {connect} from "react-redux";

import {socket} from "../../utils/socketConnection";
import {openLoginModal} from "../../actions/window.action";
import {MainPage} from "../../pages/main-page";

const App = (props) => {
    const {openLoginModal} = props;

    useEffect(() => {
        openLoginModal();

        window.addEventListener("beforeunload", () => {
            socket.emit("CLIENT:LEAVE_GAME");

            socket.disconnect();
        });
    }, []);

    return (
        <>
            <MainPage />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    openLoginModal: () => dispatch(openLoginModal())
});

export default connect(null, mapDispatchToProps)(App);