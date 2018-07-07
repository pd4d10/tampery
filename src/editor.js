import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { withStyles } from '@material-ui/core/styles'
import { storage } from './utils'
import { v4 } from 'uuid'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import AddIcon from '@material-ui/icons/Add'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'

// import { HashRouter as Router, Route } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'

import './reset.css'

const examples = [
  {
    name: 'Blank',
    code: require('raw-loader!./examples/blank'),
  },
  {
    name: 'Change User-Agent(Change request headers)',
    code: require('raw-loader!./examples/change-user-agent'),
  },
  {
    name: 'Remove UTM tokens(Change URL and redirect)',
    code: require('raw-loader!./examples/remove-utm-tokens'),
  },
]
console.log(examples)

// interface Payload {
//   id: string
//   name: string
//   lifecycle: string
//   code: string
//   filter: string
// }

class App extends Component {
  state = {
    data: {},
    open: false,
    code: '// type your code...\n\n',
    selectedId: null,
  }

  componentDidMount() {
    this.updateDataFromStorage()
  }

  sendMessage = message => {
    console.log('sendMessage:', message)
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, response => {
        console.log('Response:', response)
        if (response.message) {
          alert(response.message)
        } else {
          resolve()
        }
      })
    })
  }

  handleToggleActive = async id => {
    if (this.state.data[id].active) {
      await this.sendMessage({ type: 'deactivate', id })
    } else {
      await this.sendMessage({ type: 'activate', id })
    }
    await this.updateDataFromStorage()
  }

  updateDataFromStorage = async () => {
    const data = await storage.get()
    this.setState({ data })
    const ids = Object.keys(data)
    if (ids.length) {
      this.setState({
        selectedId: ids[0],
        code: this.state.data[ids[0]].code,
      })
    }
  }

  handleSave = async () => {
    await this.sendMessage({
      id: this.state.selectedId,
      type: 'add',
      name: this.state.name,
      code: this.state.code,
      active: true,
    })
    await this.updateDataFromStorage()
  }

  handleDelete = async () => {
    await this.sendMessage({ type: 'delete', id: this.state.selectedId })
    await this.updateDataFromStorage()
  }

  handleAdd = code => {
    const id = v4()
    this.setState({
      open: false,
      selectedId: id,
      data: {
        ...this.state.data,
        [id]: {
          name: 'Untitled',
          active: false,
          code,
        },
      },
      code,
    })
  }

  render() {
    const { state } = this
    const ids = Object.keys(state.data)
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: 250 }}>
          <List>
            {ids.length
              ? ids.map(id => (
                  <ListItem
                    button
                    key={id}
                    onClick={() => {
                      this.setState({ selectedId: id })
                    }}
                  >
                    <ListItemText primary={state.data[id].name} />
                    <ListItemSecondaryAction>
                      <Switch
                        onChange={() => this.handleToggleActive(id)}
                        checked={state.data[id].active}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              : 'No snippets yet'}
          </List>
        </div>
        <div
          style={{
            flexGrow: 1,
            // padding: 20,
          }}
        >
          <div>
            <TextField
              required
              label="Name"
              value={state.name}
              onChange={e => {
                this.setState({ name: e.target.value })
              }}
              // className={classes.textField}
              // fullWidth
              margin="normal"
            />
          </div>
          <div
            style={{ height: document.body.clientHeight - 200, marginTop: 30 }}
          >
            <MonacoEditor
              language="javascript"
              // theme="vs-dark"
              value={state.code}
              options={{ contextmenu: false }}
              onChange={value => {
                this.setState({ code: value })
              }}
              editorDidMount={(editor, monaco) => {
                editor.focus()
              }}
            />
          </div>
          <div style={{ paddingTop: 20, paddingLeft: 63 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSave}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={this.props.classes.add}
          onClick={() => {
            this.setState({ open: true })
          }}
        >
          <AddIcon />
        </Button>
        <Dialog
          onClose={() => {
            this.setState({ open: false })
          }}
          open={state.open}
        >
          <DialogTitle>Add script</DialogTitle>
          <div>
            <List>
              {examples.map(({ name, code }) => (
                <ListItem
                  button
                  key={name}
                  onClick={() => this.handleAdd(code)}
                  key={name}
                >
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </div>
        </Dialog>
      </div>
    )
  }
}

App = withStyles(theme => ({
  // root: {
  //   backgroundColor: theme.palette.background.paper,
  //   width: 500,
  //   position: 'relative',
  //   minHeight: 200,
  // },
  add: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  // fabGreen: {
  //   color: theme.palette.common.white,
  //   backgroundColor: green[500],
  // },
}))(App)

const root = document.createElement('div')
root.style.height = '100%'
document.body.appendChild(root)
render(<App />, root)
