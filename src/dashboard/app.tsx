import { HashRouter, Route, Link, Routes, useNavigate } from "react-router-dom";
import React, { FC } from "react";
import { Layout, Menu, Dropdown, Button } from "antd";
import { About } from "./about";
import { Home } from "./home";
import { Edit } from "./edit";
import { examples } from "./utils";
import { DataProvider } from "./context";

const AddScriptButton: FC = () => {
  const navigate = useNavigate();
  return (
    <Dropdown
      menu={{
        items: examples.map((example, index) => ({
          key: index,
          title: example.title,
          onClick: async () => {
            navigate(`/add/${index}`);
          },
        })),
      }}
      placement="bottomLeft"
    >
      <Button type="primary">Add script</Button>
    </Dropdown>
  );
};

export const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <>
          <Layout style={{ minHeight: "100%" }}>
            <div style={{ background: "#fff", padding: "0 50px" }}>
              <div className="logo" />
              <Menu mode="horizontal" defaultSelectedKeys={["/"]}>
                <Menu.Item key="/">
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="/about">
                  <Link to="/about">About</Link>
                </Menu.Item>
                <Menu.Item key="/add" style={{ float: "right" }}>
                  <AddScriptButton />
                </Menu.Item>
              </Menu>
            </div>
            <Layout.Content style={{ padding: "20px 50px 0" }}>
              <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/edit/:id" element={<Edit />} />
                  <Route path="/add/:id" element={<Edit />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </div>
            </Layout.Content>
          </Layout>
        </>
      </HashRouter>
    </DataProvider>
  );
};
