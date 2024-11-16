import React, { Component } from "react";
import { render } from "react-dom";
import { storage } from "./utils";
import { sendMessage } from "./dashboard/utils";
import { AnchorButton, HTMLTable, Switch } from "@blueprintjs/core";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

class App extends Component {
  state = {
    data: {},
  };
  componentDidMount() {
    this.updateDataFromStorage();
  }
  updateDataFromStorage = async () => {
    const data = await storage.get();
    this.setState({ data });
  };
  handleToggleActive = async (id) => {
    if (this.state.data[id].active) {
      await sendMessage({ type: "deactivate", id });
    } else {
      await sendMessage({ type: "activate", id });
    }
    await this.updateDataFromStorage();
  };
  render() {
    return (
      // If we set margin here the popup will be very long
      <div style={{ padding: 10, minWidth: 400 }}>
        <HTMLTable bordered interactive>
          <tbody>
            {Object.entries(this.state.data).map(([id, v]) => {
              return (
                <tr key={id}>
                  <td>{v.name}</td>
                  <td>
                    <Switch
                      checked={v.active}
                      onChange={() => this.handleToggleActive(id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </HTMLTable>
        <AnchorButton
          href={chrome.runtime.getURL("dist/dashboard.html")}
          target="_blank"
        >
          Open dashboard
        </AnchorButton>
      </div>
    );
  }
}

const root = document.createElement("div");
document.body.appendChild(root);
render(<App />, root);
