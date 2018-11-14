import React, { Component } from 'react'
import { render } from 'react-dom'
import { List, Switch } from 'antd'
import { storage } from './utils'
import style from 'antd/dist/antd.min.css'
import { sendMessage } from './dashboard/utils'

style // This is a hack for preventing Webpack drop CSS at production mode

class App extends Component {
  state = {
    data: {},
  }
  componentDidMount() {
    this.updateDataFromStorage()
  }
  updateDataFromStorage = async () => {
    const data = await storage.get()
    this.setState({ data })
  }
  handleToggleActive = async id => {
    if (this.state.data[id].active) {
      await sendMessage({ type: 'deactivate', id })
    } else {
      await sendMessage({ type: 'activate', id })
    }
    await this.updateDataFromStorage()
  }
  render() {
    return (
      // If we set margin here the popup will be very long
      <div style={{ padding: 10, minWidth: 400 }}>
        <List
          // header={<div>Header</div>}
          footer={
            <a
              href={chrome.runtime.getURL('dist/dashboard.html')}
              target="_blank"
            >
              Open dashboard
            </a>
          }
          bordered
          dataSource={Object.keys(this.state.data)}
          renderItem={id => (
            <List.Item>
              <div style={{ flexGrow: 1 }}>{this.state.data[id].name}</div>
              <Switch
                checked={this.state.data[id].active}
                onChange={() => this.handleToggleActive(id)}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
