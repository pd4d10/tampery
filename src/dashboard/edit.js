import React, { Component } from 'react'
import { Input } from 'antd'
import MonacoEditor from 'react-monaco-editor'
import { storage } from '../utils'
import { sendMessage } from './utils'

export default class Edit extends Component {
  state = {
    data: {},
    name: '',
    code: '',
  }

  handleSave = async () => {
    await sendMessage({
      id: this.props.match.params.id,
      type: 'add',
      name: this.state.name,
      code: this.state.code,
      active: true,
    })
  }

  updateDataFromStorage = async () => {
    const { id } = this.props.match.params
    const data = await storage.get()
    this.setState({
      data,
      name: data[id].name,
      code: data[id].code,
    })
  }

  componentDidMount() {
    this.updateDataFromStorage()
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
