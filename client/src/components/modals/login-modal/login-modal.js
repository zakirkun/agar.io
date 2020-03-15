import React, {useState} from "react";
import {connect} from "react-redux";

import {loginPlayer} from "../../../actions/player.action";
import {closeLoginModal} from "../../../actions/window.action";
import {openMenuModal} from "../../../actions/window.action";
import styles from "./login-modal.module.css";

const LoginModal = (props) => {
    const {modal, modalHeader, modalBody, modalTitle, modalFooter, modalLabel, modalList, modalItem,
        modalButtonGithub, modalButtonGuest, modalInput, modalButton, modalMenu} = styles;

    const {isLoginModalOpen, loginPlayer, closeLoginModal, openMenuModal} = props;

    const [name, setName] = useState("");

    if (!isLoginModalOpen) return null;

    const onNameChange = (event) => setName(event.currentTarget.value);

    const onFormSubmit = (event) => {
        event.preventDefault();

        if (!name) return;

        loginPlayer({name});
        closeLoginModal();
        openMenuModal();
    };

    return (
        <div className={modal}>
            <div className={modalHeader}>
                <h3 className={modalTitle}>Agar.io</h3>
            </div>

            <div className={modalBody}>
                <form className={modalMenu} onSubmit={onFormSubmit}>
                    <button className={`${modalButton} ${modalButtonGithub}`}>Login with GitHub</button>
                    <button type="submit" className={`${modalButton} ${modalButtonGuest}`}>Play as guest</button>
                    <input className={modalInput} type="text" placeholder="Enter your name here" value={name} onChange={onNameChange}/>
                </form>
            </div>

            <div className={modalFooter}>
                <span className={modalLabel}>How to play:</span>

                <ul className={modalList}>
                    <li className={modalItem}>Move your mouse on the screen to move character</li>
                    <li className={modalItem}>Absorb orbs by running over them in order to grow your character</li>
                    <li className={modalItem}>The larger you get the slower you are</li>
                    <li className={modalItem}>Objective: Absorb other players to get even larger but not lose speed</li>
                    <li className={modalItem}>The larger player absorbs the smaller player</li>
                </ul>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isLoginModalOpen: state.windowState.isLoginModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    loginPlayer: (payload) => dispatch(loginPlayer(payload)),
    closeLoginModal: () => dispatch(closeLoginModal()),
    openMenuModal: () => dispatch(openMenuModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);