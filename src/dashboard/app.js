import { HashRouter as Router, Route, Link } from 'react-router-dom'
import React, { Fragment } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import About from './about'
import Home from './home'
import Edit from './edit'

import 'antd/dist/antd.css'
import './app.css'
const { Header, Content, Footer } = Layout

const App = props => (
  <Router>
    <Fragment>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="/">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/about">
              <Link to="/about">About</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/edit/:id" component={Edit} />
          </div>
        </Content>
      </Layout>
    </Fragment>
  </Router>
)

export default App
