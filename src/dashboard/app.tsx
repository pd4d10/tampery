import { HashRouter, Route, Link, useHistory } from "react-router-dom";
import React, { FC } from "react";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { About } from "./about";
import { Home } from "./home";
import { Edit } from "./edit";
import { examples } from "./utils";
import { DataProvider } from "./context";

const ExampleSelect = Select.ofType<{ name: string; code: string }>();

const AddScriptButton: FC = () => {
  const history = useHistory();
  return (
    <ExampleSelect
      items={examples}
      itemRenderer={(item, i) => {
        return <Link key={item.name} to={`/add/${i}`}></Link>;
      }}
      onItemSelect={(item) => {}}
    >
      Add Script
    </ExampleSelect>
  );
};

export const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <>
          <div style={{ minHeight: "100%" }}>
            <div style={{ background: "#fff", padding: "0 50px" }}>
              <Navbar>
                <NavbarGroup>
                  <NavbarHeading>Tampery</NavbarHeading>
                  <NavbarDivider />
                  <Button icon="home" minimal>
                    <Link to="/">Home</Link>
                  </Button>
                  <Button icon="document" minimal>
                    <Link to="/about">About</Link>
                  </Button>
                </NavbarGroup>
                <NavbarGroup align="right">
                  <AddScriptButton />
                </NavbarGroup>
              </Navbar>
            </div>
            <div style={{ padding: "20px 50px 0" }}>
              <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
                <Route path="/" exact component={Home} />
                <Route path="/edit/:id" component={Edit} />
                <Route path="/add/:index" component={Edit} />
                <Route path="/about" component={About} />
              </div>
            </div>
          </div>
        </>
      </HashRouter>
    </DataProvider>
  );
};
