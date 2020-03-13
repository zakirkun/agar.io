import React from "react";
import {connect} from "react-redux";

import styles from "./menu-modal.module.css";
import {openGameField} from "../../../actions/window.action";
import {closeMenuModal} from "../../../actions/window.action";

const MenuModal = (props) => {
    const {modal, modalHeader, modalBody, modalTitle, modalFooter, modalLabel, modalList, modalItem, bodyTitle, bodyItem,
        bodyMenu, bodyButton, bodyButtonTeam, bodyButtonSolo, bodyButtonStats} = styles;

    const {name, isMenuModalOpen, openGameField, closeMenuModal} = props;

    if (!isMenuModalOpen) return null;

    const onSoloButton = (event) => {
        openGameField();
        closeMenuModal();
    };

    return (
        <div className={modal}>
            <div className={modalHeader}>
                <h3 className={modalTitle}>Agar.io</h3>
            </div>

            <div className={modalBody}>
                <h5 className={bodyTitle}>Hello, {name}!</h5>

                <div className={bodyMenu}>
                    <div className={bodyItem}><button className={`${bodyButton} ${bodyButtonTeam}`}>Join team!</button></div>
                    <div className={bodyItem}><button onClick={onSoloButton} className={`${bodyButton} ${bodyButtonSolo}`}>Play solo!</button></div>
                    <div className={bodyItem}><button className={`${bodyButton} ${bodyButtonStats}`}>See your stats</button></div>
                    <div className={bodyItem}><button className={`${bodyButton} ${bodyButtonStats}`}>See all stats</button></div>
                </div>
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
    name: state.userState.name,
    isMenuModalOpen: state.windowState.isMenuModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    openGameField: () => dispatch(openGameField()),
    closeMenuModal: () => dispatch(closeMenuModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuModal);