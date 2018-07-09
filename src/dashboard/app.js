import { HashRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import React, { Fragment, Component } from 'react'
import { Layout, Menu, Breadcrumb, Dropdown, Button } from 'antd'
import { storage } from '../utils'

import About from './about'
import Home from './home'
import Edit from './edit'

import style from 'antd/dist/antd.min.css'
import { examples } from './utils'

style // This is a hack for preventing Webpack drop CSS at production mode
const { Header, Content, Footer } = Layout

const AddScriptButton = withRouter(props => (
  <Dropdown
    overlay={
      <Menu>
        {examples.map((example, index) => (
          <Menu.Item key={example.name}>
            <a
              href="#"
              onClick={async e => {
                e.preventDefault()
                props.history.push(`/add/${index}`)
              }}
            >
              {example.name}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    }
    placement="bottomLeft"
  >
    <Button type="primary">Add script</Button>
  </Dropdown>
))

export default class App extends Component {
  state = {
    data: {},
  }

  updateData = data => {
    this.setState({ data })
  }

  updateDataFromStorage = async () => {
    const data = await storage.get()
    this.setState({ data })
  }

  componentDidMount() {
    this.updateDataFromStorage()
  }

  render() {
    const extraProps = {
      data: this.state.data,
      updateData: this.updateData,
      updateDataFromStorage: this.updateDataFromStorage,
    }

    return (
      <Router>
        <Fragment>
          <Layout style={{ minHeight: '100%' }}>
            <div style={{ background: '#fff', padding: '0 50px' }}>
              <div className="logo" />
              <Menu mode="horizontal" defaultSelectedKeys={['/']}>
                <Menu.Item key="/">
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="/about">
                  <Link to="/about">About</Link>
                </Menu.Item>
                <Menu.Item key="/add" style={{ float: 'right' }}>
                  <AddScriptButton />
                </Menu.Item>
              </Menu>
            </div>
            <Content style={{ padding: '20px 50px 0' }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Route
                  path="/"
                  exact
                  component={props => <Home {...props} {...extraProps} />}
                />
                <Route
                  path="/edit/:id"
                  component={props => <Edit {...props} {...extraProps} />}
                />
                <Route
                  path="/add/:index"
                  component={props => <Edit {...props} {...extraProps} />}
                />
                <Route path="/about" component={About} />
              </div>
            </Content>
          </Layout>
        </Fragment>
      </Router>
    )
  }
}
