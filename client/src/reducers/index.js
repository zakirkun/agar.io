import {combineReducers} from "redux";

import {windowReducer} from "./window.reducer";
import {playerReducer} from "./player.reducer";
import {gameReducer} from "./game.reducer";

const rootReducer = combineReducers({
    windowState: windowReducer,
    playerState: playerReducer,
    gameState: gameReducer
});

export {rootReducer};