import React from "react";
import  ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import {App} from "./components";

import styles from "./style/styles.css"

ReactDOM.render(
    <BrowserRouter>
    <App />
    </BrowserRouter>,
    document.getElementById('app')
        // "start": "react-scripts --openssl-legacy-provider start",
)