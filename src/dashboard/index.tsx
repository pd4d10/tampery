import { render } from "react-dom";
import { App } from "./app";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const root = document.createElement("div");
root.style.height = "100%";
document.body.appendChild(root);
render(<App />, root);
