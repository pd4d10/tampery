import React, { Component, Fragment } from 'react'
import { v4 } from 'uuid'
import { storage } from '../utils'
import { Button, List, Switch } from 'antd'
import { sendMessage } from './utils'
import { Link } from 'react-router-dom'

const examples = [
  {
    name: 'Blank',
    code: require('raw-loader!../examples/blank'),
  },
  {
    name: 'Change User-Agent(Change request headers)',
    code: require('raw-loader!../examples/change-user-agent'),
  },
  {
    name: 'Remove UTM tokens(Change URL and redirect)',
    code: require('raw-loader!../examples/remove-utm-tokens'),
  },
]

export default class Home extends Component {
  state = {
    data: {},
  }

  componentDidMount() {
    this.updateDataFromStorage()
  }

  handleToggleActive = async id => {
    if (this.state.data[id].active) {
      await sendMessage({ type: 'deactivate', id })
    } else {
      await sendMessage({ type: 'activate', id })
    }
    await this.updateDataFromStorage()
  }

  updateDataFromStorage = async () => {
    const data = await storage.get()
    this.setState({ data })
  }

  handleDelete = async () => {
    this.toggleConfirmDelete()
    await sendMessage({ type: 'delete', id: this.state.selectedId })
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
    confirm({
      title: 'Do you want to delete this item?',
      content:
        'This operation will delete this item permanently. If you want to keep the code for future use, disable it instead.',
      onOk() {
        this.handleDelete()
      },
      onCancel() {},
    })
  }

  render() {
    const { state } = this
    const ids = Object.keys(state.data)
    return (
      <div>
        <div>
          {ids.length ? (
            <div style={{ marginTop: 20 }}>
              <List
                bordered
                dataSource={ids}
                renderItem={id => (
                  <List.Item>
                    {state.data[id].name}
                    <Switch
                      checked={state.data[id].active}
                      onChange={() => this.handleToggleActive(id)}
                    />
                    <Link to={`/edit/id=${id}`}>Edit</Link>
                    <Button onClick={this.toggleConfirmDelete}>Delete</Button>
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div>
              <p className="lead">Seems we don't have any scripts yet.</p>
              <p className="lead">
                Click add button at bottom right corner to add a new one :)
              </p>
              <p className="lead">
                <Button color="primary">Add script</Button>
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
