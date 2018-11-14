import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import {
  Container,
  Dropdown,
  DropdownItem,
  Button,
  Navbar,
  NavRouterLink,
  NavbarBrand,
} from 'relaunch'

import { About } from './about'
import { Home } from './home'
import { Edit } from './edit'

import style from 'bootstrap/dist/css/bootstrap.min.css'
import { examples } from './utils'

style // This is a hack for preventing Webpack drop CSS at production mode

export const App = () => {
  return (
    <HashRouter>
      <Container style={{ minHeight: '100%' }}>
        <Route>
          {({ history }) => (
            <Navbar
              theme="light"
              bg="light"
              brand={<NavbarBrand>Tampery</NavbarBrand>}
              right={
                <Dropdown
                  text="Add script"
                  overlay={examples.map((example, index) => (
                    <DropdownItem
                      key={example.name}
                      onClick={async e => {
                        e.preventDefault()
                        history.push(`/add/${index}`)
                      }}
                    >
                      {example.name}
                    </DropdownItem>
                  ))}
                  placement="bottomLeft"
                >
                  <Button theme="primary">Add script</Button>
                </Dropdown>
              }
            >
              <NavRouterLink exact to="/">
                Home
              </NavRouterLink>
              <NavRouterLink to="/about">About</NavRouterLink>
            </Navbar>
          )}
        </Route>

        <div style={{ padding: '20px 50px 0' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Route path="/" exact component={Home} />
            <Route path="/edit/:id" component={Edit} />
            <Route path="/add/:index" component={Edit} />
            <Route path="/about" component={About} />
          </div>
        </div>
      </Container>
    </HashRouter>
  )
}
