import {combineReducers} from "redux";

import {windowReducer} from "./window.reducer";
import {playerReducer} from "./player.reducer";

const rootReducer = combineReducers({
    windowState: windowReducer,
    playerState: playerReducer
});

export {rootReducer};