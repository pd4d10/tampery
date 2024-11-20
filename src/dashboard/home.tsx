import { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "./context";
import { Divider, Modal, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Item } from "../utils";
import Form from "@rjsf/antd";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import schema from "../schema/fields.json";

// {
//   title: "Todo",
//   type: "object",
//   required: ["title"],
//   properties: {
//     title: { type: "string", title: "Title", default: "A new task" },
//     done: { type: "boolean", title: "Done?", default: false },
//   },
// };

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
      <Form
        schema={schema.definitions.UpdateRuleOptions}
        validator={validator}
        onChange={(data) => {
          //
        }}
        onSubmit={(data) => {
          //
        }}
        onError={(errors) => {
          //
        }}
      />
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
