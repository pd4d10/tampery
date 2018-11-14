import React, { useState, useEffect } from 'react'
import { Input, Button, Form } from 'antd'
import { v4 } from 'uuid'
import MonacoEditor from 'react-monaco-editor'
import { examples } from './utils'
import { useData } from './hooks'

export const Edit = props => {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const { add } = useData()

  useEffect(() => {
    switch (props.match.path) {
      case '/add/:index': {
        const id = v4()
        const { name, code } = examples[props.match.params.index]
        setId(id)
        setName(name)
        setCode(code)
        break
      }
      case '/edit/:id': {
        const { id } = props.match.params
        const item = props.data[id]

        // Fix reload page, data doesn't be loaded into state at first time
        if (item) {
          const { name, code } = props.data[id]
          setId(id)
          setName(name)
          setCode(code)
        }
        break
      }
    }
  })

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
          value={name}
          onChange={e => {
            setName(e.target.value)
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
            value={code}
            options={{ contextmenu: false, scrollBeyondLastLine: false }}
            onChange={value => {
              setCode(value)
            }}
            editorDidMount={(editor, monaco) => {
              // editor.focus()
            }}
          />
        </div>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          onClick={async e => {
            // e.preventDefault()
            await add(id, name, code, true)
            props.history.push('/')
          }}
        >
          Save
        </Button>{' '}
        <Button
          onClick={() => {
            props.history.push('/')
          }}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}
