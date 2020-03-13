import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import {App} from "./components/app";
import {store} from "./store";

import "./index.css";

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);