import * as React from "react";
import { Hello } from "../Hello";
import renderer from "react-test-renderer";

it("component renders", () => {
    const tree = renderer.create(<Hello />).toJSON();
    expect(tree).toMatchSnapshot();
});
