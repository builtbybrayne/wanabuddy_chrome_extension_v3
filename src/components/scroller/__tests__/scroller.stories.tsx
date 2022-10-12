import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Scroller } from "../Scroller";
import { Story } from "@src/components/dev";

// // // //

storiesOf("Scroller", module).add("renders", () => {
    return (
        <Story>
            <Scroller />
        </Story>
    );
});
