import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import { Table, Button, Select, Input } from 'antd'
import 'antd/dist/antd.css'

const { Option } = Select

// interface Payload {
//   id: string
//   name: string
//   lifecycle: string
//   code: string
//   filter: string
// }

const storageKey = 'data'

const resourceTypes = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'font',
  'object',
  'xmlhttprequest',
  'ping',
  'csp_report',
  'media',
  'websocket',
  'other',
]

const lifecycles = ['onBeforeSendHeaders']

class List extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    chrome.storage.sync.get([storageKey], items => {
      if (items.data) {
        this.setState({ data: items.data })
      }
    })
  }

  transformToDataSource = data =>
    data.map(item => ({
      ...item,
      key: item.id,
    }))

  columns = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Lifecycle',
      key: 'lifecycle',
    },
    {
      title: 'Filter',
      key: 'filter',
    },
  ].map(item => ({ ...item, dataIndex: item.key }))

  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.props.history.push('/add')
          }}
        >
          Add
        </Button>
        <Table
          dataSource={this.transformToDataSource(this.state.data)}
          columns={this.columns}
        />
      </div>
    )
  }
}

class Add extends Component {
  state = {
    code: '// type your code...\n\n',
  }

  render() {
    const s = this.state
    return (
      <div>
        <MonacoEditor
          width="400"
          height="300"
          language="javascript"
          // theme="vs-dark"
          value={this.state.code}
          options={{
            selectOnLineNumbers: true,
          }}
          onChange={value => {
            this.setState({ code: value })
          }}
          editorDidMount={(editor, monaco) => {
            editor.focus()
          }}
        />
        <Button
          onClick={() => {
            const message = {
              type: 'add',
              code: this.state.code,
            }
            console.log('sendMessage:', message)
            chrome.runtime.sendMessage(message, response => {
              console.log('Response:', response)
              if (response.message) {
              }
            })
          }}
        >
          Submit
        </Button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Route exact path="/" component={List} />
          <Route exact path="/add" component={Add} />
        </Fragment>
      </Router>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
