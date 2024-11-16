import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "./context";
import { Divider, Modal, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const { data, remove, activate, deactivate, loadFromStorage } =
    useContext(DataContext);

  const dataSource = Object.entries(data).map(([id, value]) => ({
    ...value,
    id,
    key: id,
  }));

  const records: ColumnsType = [
    { title: "Name" },
    {
      title: "Active",
      render: (text, record) => (
        <Switch
          checked={record.active}
          onChange={async () => {
            if (data[record.id].active) {
              await deactivate(record.id);
            } else {
              await activate(record.id);
            }
            await loadFromStorage();
          }}
        />
      ),
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
                  await remove(record.id);
                  await loadFromStorage();
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
