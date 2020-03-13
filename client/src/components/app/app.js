import React, {useEffect} from "react";
import {connect} from "react-redux";

import {openLoginModal} from "../../actions/window.action";
import {MainPage} from "../../pages/main-page";

const App = (props) => {
    const {openLoginModal} = props;

    useEffect(() => {
        openLoginModal();
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