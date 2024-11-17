import { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "./context";
import { Divider, Modal, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Item } from "../utils";

export const Home = () => {
  const {
    state: { byId, disabledRules },
    dispatch,
  } = useContext(DataContext);

  const dataSource = Object.entries(byId).map(([id, item]) => ({
    ...item,
    id: parseInt(id),
    key: id,
  }));

  const records: ColumnsType<Item & { id: number }> = [
    { title: "Title" },
    {
      title: "Enabled",
      render: (text, record) => {
        const enabled = !disabledRules.includes(record.id);

        return (
          <Switch
            checked={enabled}
            onChange={async () => {
              dispatch({
                type: enabled ? "disable" : "enable",
                payload: record.id,
              });
            }}
          />
        );
      },
    },
    {
      title: "Actions",
      render: (text, record) => (
        <span>
          <Link to={`/edit/${record.id}`}>Edit</Link>
          <Divider type="vertical" />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();

              Modal.confirm({
                title: "Do you want to delete this item?",
                content:
                  "This operation will delete this item permanently. If you want to keep the code for future use, disable it instead.",
                onOk: async () => {
                  dispatch({ type: "remove", payload: record.id });
                },
                onCancel() {},
              });
            }}
          >
            Delete
          </a>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div>
        {dataSource.length ? (
          <div style={{ marginTop: 20 }}>
            <Table columns={records} dataSource={dataSource} />
          </div>
        ) : (
          <div>
            <p>Seems we don't have any scripts yet.</p>
            <p>Click add button at top right corner to add a new one :)</p>
          </div>
        )}
      </div>
    </div>
  );
};
