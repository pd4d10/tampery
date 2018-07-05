import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { withStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import AddIcon from '@material-ui/icons/Add'
import { HashRouter as Router, Route } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'

// interface Payload {
//   id: string
//   name: string
//   lifecycle: string
//   code: string
//   filter: string
// }

const storageKey = 'data'

class Container extends Component {
  state = {
    data: [],
    code: '// type your code...\n\n',
  }

  componentDidMount() {
    // chrome.storage.sync.get([storageKey], items => {
    //   if (items.data) {
    //     this.setState({ data: items.data })
    //   }
    // })
  }

  // transformToDataSource = data =>
  //   data.map(item => ({
  //     ...item,
  //     key: item.id,
  //   }))

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: 250 }}>
          <List>
            <ListItem button>
              <ListItemText primary="Wi-Fi" />
              <ListItemSecondaryAction>
                <Switch onChange={() => {}} checked={true} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
        <div style={{ flexGrow: 1 }}>
          <MonacoEditor
            // width="400"
            // height="300"
            language="javascript"
            // theme="vs-dark"
            value={this.state.code}
            options={
              {
                // selectOnLineNumbers: true,
              }
            }
            onChange={value => {
              this.setState({ code: value })
            }}
            editorDidMount={(editor, monaco) => {
              editor.focus()
            }}
          />
        </div>
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={this.props.classes.add}
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
          <AddIcon />
        </Button>
      </div>
    )
  }
}

Container = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: 'relative',
    minHeight: 200,
  },
  add: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  // fabGreen: {
  //   color: theme.palette.common.white,
  //   backgroundColor: green[500],
  // },
}))(Container)

class Add extends Component {
  render() {
    // const s = this.state
    return <div />
  }
}

class App extends Component {
  render() {
    return (
      // <Router>
      //   <Fragment>
      //     <Route exact path="/" component={Container} />
      //     <Route exact path="/add" component={Add} />
      //   </Fragment>
      // </Router>
      <Container />
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
