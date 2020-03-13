import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

import {rootReducer} from "./reducers";

const preloadedState = {};

const middlewares = [thunk];

const store = createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(...middlewares)));

export {store};