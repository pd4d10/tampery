import { type FC, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { storage } from "./utils";
import { sendMessage } from "./dashboard/utils";
import { Data } from "./dashboard/context";
import { List, Switch } from "antd";

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
      <List
        // header={<div>Header</div>}
        footer={
          <a
            href={chrome.runtime.getURL("dist/dashboard.html")}
            target="_blank"
          >
            Open dashboard
          </a>
        }
        bordered
        dataSource={Object.keys(data)}
        renderItem={(id) => (
          <List.Item>
            <div style={{ flexGrow: 1 }}>{data[id].name}</div>
            <Switch
              checked={data[id].active}
              onChange={() => handleToggleActive(id)}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<App />);
