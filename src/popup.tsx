import { FC, useEffect, useState } from "react";
import { render } from "react-dom";
import { storage } from "./utils";
import { sendMessage } from "./dashboard/utils";
import { AnchorButton, HTMLTable, Switch } from "@blueprintjs/core";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Data } from "./dashboard/context";

const App: FC = () => {
  const [data, setData] = useState<Data>({});
  const updateDataFromStorage = async () => {
    const data = await storage.get<Data>();
    setData(data);
  };
  useEffect(() => {
    updateDataFromStorage();
  }, []);
  const handleToggleActive = async (id: string) => {
    if (data[id].active) {
      await sendMessage({ type: "deactivate", id });
    } else {
      await sendMessage({ type: "activate", id });
    }
    await updateDataFromStorage();
  };
  return (
    <div style={{ padding: 10, minWidth: 400 }}>
      <HTMLTable bordered interactive>
        <tbody>
          {Object.entries(data).map(([id, v]) => {
            return (
              <tr key={id}>
                <td>{v.name}</td>
                <td>
                  <Switch
                    checked={v.active}
                    onChange={() => handleToggleActive(id)}
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
};

const root = document.createElement("div");
document.body.appendChild(root);
render(<App />, root);
