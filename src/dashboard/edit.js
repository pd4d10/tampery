import React, { Component } from 'react'
import { Input, Button, message } from 'antd'
import { v4 } from 'uuid'

import MonacoEditor from 'react-monaco-editor'
import { storage } from '../utils'
import { sendMessage } from './utils'
import { examples } from './constants'

export default class Edit extends Component {
  state = {
    id: null,
    name: '',
    code: '',
  }

  handleSave = async () => {
    await sendMessage({
      type: 'add',
      id: this.state.id,
      name: this.state.name,
      code: this.state.code,
      active: true,
    })
    await this.props.updateDataFromStorage()
    this.props.history.push('/')
  }

  componentDidMount() {
    switch (this.props.match.path) {
      case '/add/:index': {
        const id = v4()
        const { name, code } = examples[this.props.match.params.index]
        this.setState({ id, name, code })
        break
      }
      case '/edit/:id': {
        const { id } = this.props.match.params
        const { name, code } = this.props.data[id]
        this.setState({ id, name, code })
        break
      }
    }
  }

  render() {
    console.log(this.props)
    const { state } = this
    return (
      <div>
        <Input
          value={state.name}
          onChange={e => {
            this.setState({ name: e.target.value })
          }}
        />
        <MonacoEditor
          language="javascript"
          // theme="vs-dark"
          height={400}
          // width={600}
          value={state.code}
          options={{ contextmenu: false }}
          onChange={value => {
            this.setState({ code: value })
          }}
          editorDidMount={(editor, monaco) => {
            // editor.focus()
          }}
        />
        <Button onClick={this.handleSave}>Save</Button>
      </div>
    )
  }
}
