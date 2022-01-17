import React from "react";
import { render, screen } from "./test-utils";
import Home from "@pages/index";

describe("Home Page", () => {
    it("Jest Toy test", () => {
        render(<Home />);
    })
})
