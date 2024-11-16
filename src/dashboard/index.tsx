import React from "react";
import { render } from "react-dom";
import { App } from "./app";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

// style // This is a hack for preventing Webpack drop CSS at production mode

const root = document.createElement("div");
root.style.height = "100%";
document.body.appendChild(root);
render(<App />, root);
