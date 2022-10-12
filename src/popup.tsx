import * as React from "react";
import * as ReactDOM from "react-dom";
import { browser } from "webextension-polyfill-ts";
import { Popup } from "./components/popup/Popup";
import "./scss/app.scss";

// // // //

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
    ReactDOM.render(<Popup />, document.getElementById("popup"));
});
