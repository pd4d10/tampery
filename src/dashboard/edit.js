import React, { Component } from 'react'
import { Input, Button, Form } from 'antd'
import { v4 } from 'uuid'
import MonacoEditor from 'react-monaco-editor'
import { sendMessage, examples } from './utils'

export default class Edit extends Component {
  state = {
    id: null,
    name: '',
    code: '',
  }

  handleSave = async e => {
    // e.preventDefault()
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

  handleCancel = () => {
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
        const item = this.props.data[id]

        // Fix reload page, data doesn't be loaded into state at first time
        if (item) {
          const { name, code } = this.props.data[id]
          this.setState({ id, name, code })
        }
        break
      }
    }
  }

  render() {
    const { state } = this
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 16,
          offset: 4,
        },
      },
    }

    return (
      <Form>
        <Form.Item {...formItemLayout} label="Name" required>
          <Input
            value={state.name}
            onChange={e => {
              this.setState({ name: e.target.value })
            }}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Code">
          <div style={{ border: '1px solid #eee' }}>
            <MonacoEditor
              language="javascript"
              // theme="vs-dark"
              height={400}
              // width={600}
              value={state.code}
              options={{ contextmenu: false, scrollBeyondLastLine: false }}
              onChange={value => {
                this.setState({ code: value })
              }}
              editorDidMount={(editor, monaco) => {
                // editor.focus()
              }}
            />
          </div>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSave}>
            Save
          </Button>{' '}
          <Button onClick={this.handleCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    )
  }
}
