import { type FC, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { List, Switch } from "antd";

const App: FC = () => {
  const [data, setData] = useState({});
  const updateDataFromStorage = async () => {
    //
  };
  useEffect(() => {
    //
  }, []);
  const handleToggleActive = async (id: string) => {
    if (data[id].active) {
      //
    } else {
      //
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
