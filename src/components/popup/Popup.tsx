import React, { FunctionComponent } from "react";
import { browser } from "webextension-polyfill-ts";
import "./styles.scss";
import {Hello} from "@src/components/hello/Hello";
import {Scroller} from "@src/components/scroller/Scroller";

// // // //

export const Popup: FunctionComponent = () => {
    // Sends the `popupMounted` event
    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);

    // Renders the component tree
    return (
        <div className="popup-container">
            <div className="container mx-4 my-4">
                <Hello />
                <hr />
                <Scroller />
            </div>
        </div>
    );
};
