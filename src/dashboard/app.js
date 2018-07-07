import { HashRouter as Router, Route, Link } from 'react-router-dom'
import React, { Fragment } from 'react'
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Collapse,
} from 'reactstrap'
import About from './about'
import Home from './home'
import './app.css'
import 'react-toggle/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => (
  <Router>
    <Fragment>
      <Navbar dark color="dark" expand="md">
        <NavbarBrand href="#">Dashboard</NavbarBrand>
        <Collapse navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link to="/">Home</Link>
              {/* <NavLink href="/components/">Home</NavLink> */}
            </NavItem>
            <NavItem>
              <Link to="/about">About</Link>
              {/* <NavLink href="/components/">About</NavLink> */}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
    </Fragment>
  </Router>
)

export default App
