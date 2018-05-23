import React, { Component } from 'react'
import { render } from 'react-dom'
import MonacoEditor from 'react-monaco-editor'
import { Table, Button } from 'antd'
import 'antd/dist/antd.css'

// interface Payload {
//   id: string
//   name: string
//   lifecycle: string
//   code: string
//   filter: string
// }

const storageKey = 'data'

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
            this.props.onAdd()
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
    name: '',
    code: '// type your code...\n\n',
    lifecycle: '',
    filter: '',
  }

  render() {
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
            chrome.runtime.sendMessage({
              type: 'add',
              payload: {
                level: 'sendHeaders',
                code: 'console.log(details)',
              },
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
  state = {
    isAddPage: false,
  }

  render() {
    return (
      <div>
        {this.state.isAddPage ? (
          <Add
            onBack={() => {
              this.setState({ isAddPage: false })
            }}
          />
        ) : (
          <List
            onAdd={() => {
              this.setState({ isAddPage: true })
            }}
          />
        )}
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
