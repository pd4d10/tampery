import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { v4 } from 'uuid'
import MonacoEditor from 'react-monaco-editor'
import {
  Button,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Jumbotron,
  ModalFooter,
  Input,
  Container,
  Collapse,
} from 'reactstrap'
import Toggle from 'react-toggle'
import { storage } from './utils'

import 'react-toggle/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './editor.css'

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
    name: '',
    code: '',
    selectedId: null,
    confirmDeleteModalOpen: false,
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
        name: this.state.data[ids[0]].name,
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
    this.toggleEdit()
  }

  handleDelete = async () => {
    this.toggleConfirmDelete()
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
      name: 'Untitled',
      code,
    })
  }

  toggleConfirmDelete = () => {
    this.setState({
      confirmDeleteModalOpen: !this.state.confirmDeleteModalOpen,
    })
  }

  toggleEdit = id => {
    if (this.state.open) {
      this.setState({ open: false })
    } else {
      const selected = this.state.data[id]
      this.setState({
        open: true,
        selectedId: id,
        name: selected.name,
        code: selected.code,
      })
    }
  }

  render() {
    const { state } = this
    const ids = Object.keys(state.data)
    return (
      <div>
        <Modal
          isOpen={state.confirmDeleteModalOpen}
          toggle={this.toggleConfirmDelete}
        >
          <ModalHeader>Confirm</ModalHeader>
          <ModalBody>
            This operation will delete this item permanently. If you want to
            keep the code for future use, disable it instead.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleDelete}>
              Delete
            </Button>{' '}
            <Button color="secondary" onClick={this.toggleConfirmDelete}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={state.open}
          toggle={this.toggleEdit}
          className="edit-modal"
        >
          <ModalHeader>Edit</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="script-name">Name</Label>
              <Input
                id="script-name"
                value={state.name}
                onChange={e => {
                  this.setState({ name: e.target.value })
                }}
              />
            </FormGroup>
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSave}>
              Save
            </Button>{' '}
            <Button color="secondary" onClick={this.toggleEdit}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Navbar dark color="dark" expand="md">
          <NavbarBrand href="#">Dashboard</NavbarBrand>
          <Collapse navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/components/">About</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container>
          {ids.length ? (
            <div style={{ marginTop: 20 }}>
              <ListGroup>
                {ids.map(id => (
                  <ListGroupItem
                    key={id}
                    onClick={() => {
                      this.setState({ selectedId: id })
                    }}
                  >
                    {state.data[id].name}
                    <div style={{ float: 'right' }}>
                      <Toggle
                        checked={state.data[id].active}
                        onChange={() => this.handleToggleActive(id)}
                      />
                      <Button
                        outline
                        size="sm"
                        color="primary"
                        onClick={() => this.toggleEdit(id)}
                      >
                        Edit
                      </Button>{' '}
                      <Button
                        outline
                        size="sm"
                        color="danger"
                        onClick={this.toggleConfirmDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          ) : (
            <Jumbotron>
              <p className="lead">Seems we don't have any scripts yet.</p>
              <p className="lead">
                Click add button at bottom right corner to add a new one :)
              </p>
              <p className="lead">
                <Button color="primary">Add script</Button>
              </p>
            </Jumbotron>
          )}
        </Container>
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
