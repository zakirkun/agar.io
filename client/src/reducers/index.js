import {combineReducers} from "redux";

import {windowReducer} from "./window.reducer";
import {userReducer} from "./user.reducer";
import {gameReducer} from "./game.reducer";

const rootReducer = combineReducers({
    windowState: windowReducer,
    userState: userReducer,
    gameState: gameReducer
});

export {rootReducer};