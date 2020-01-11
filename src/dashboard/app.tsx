import { HashRouter, Route, Link, useHistory } from 'react-router-dom'
import React, { FC } from 'react'
import { Layout, Menu, Dropdown, Button } from 'antd'

import { About } from './about'
import { Home } from './home'
import { Edit } from './edit'

import style from 'antd/dist/antd.min.css'
import { examples } from './utils'
import { DataProvider } from './context'

style // This is a hack for preventing Webpack drop CSS at production mode
const { Content } = Layout

const AddScriptButton: FC = () => {
  const history = useHistory()
  return (
    <Dropdown
      overlay={
        <Menu>
          {examples.map((example, index) => (
            <Menu.Item key={example.name}>
              <a
                href="#"
                onClick={async e => {
                  e.preventDefault()
                  history.push(`/add/${index}`)
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
  )
}

export const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <>
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
                <Route path="/" exact component={Home} />
                <Route path="/edit/:id" component={Edit} />
                <Route path="/add/:index" component={Edit} />
                <Route path="/about" component={About} />
              </div>
            </Content>
          </Layout>
        </>
      </HashRouter>
    </DataProvider>
  )
}
