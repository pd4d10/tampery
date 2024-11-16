import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "./context";
import { HTMLTable, Divider, Switch, Alert } from "@blueprintjs/core";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const { data, remove, activate, deactivate, loadFromStorage } =
    useContext(DataContext);

  const dataSource = Object.entries(data).map(([id, value]) => ({
    ...value,
    id,
    key: id,
  }));

  return (
    <div>
      <div>
        {dataSource.length ? (
          <div style={{ marginTop: 20 }}>
            <HTMLTable interactive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([id, v]) => (
                  <tr key={id}>
                    <td>{v.name}</td>
                    <td>
                      <Switch
                        checked={v.active}
                        onChange={async () => {
                          if (v.active) {
                            await deactivate(id);
                          } else {
                            await activate(id);
                          }
                          await loadFromStorage();
                        }}
                      />
                    </td>
                    <td>
                      <span>
                        <Link to={`/edit/${id}`}>Edit</Link>
                        <Divider />
                        <Alert
                          isOpen={open}
                          onConfirm={async () => {
                            await remove(id);
                            await loadFromStorage();
                          }}
                        >
                          Do you want to delete this item? This operation will
                          delete this item permanently. If you want to keep the
                          code for future use, disable it instead.
                        </Alert>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpen(true);
                          }}
                        >
                          Delete
                        </a>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
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
