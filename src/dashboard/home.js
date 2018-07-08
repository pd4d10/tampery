import React, { Component, Fragment } from 'react'
import { Button, List, Switch, Dropdown, Menu, Modal } from 'antd'
import { sendMessage } from './utils'
import { Link } from 'react-router-dom'
import { examples } from './constants'

export default class Home extends Component {
  handleToggleActive = async id => {
    if (this.props.data[id].active) {
      await sendMessage({ type: 'deactivate', id })
    } else {
      await sendMessage({ type: 'activate', id })
    }
    await this.props.updateDataFromStorage()
  }

  handleDelete = async id => {
    await sendMessage({ type: 'delete', id })
    await this.props.updateDataFromStorage()
  }

  handleAdd = async (e, index) => {
    e.preventDefault()
    this.props.history.push(`/add/${index}`)
  }

  toggleConfirmDelete = id => {
    Modal.confirm({
      title: 'Do you want to delete this item?',
      content:
        'This operation will delete this item permanently. If you want to keep the code for future use, disable it instead.',
      onOk: () => {
        this.handleDelete(id)
      },
      onCancel() {},
    })
  }

  render() {
    const ids = Object.keys(this.props.data)
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
                    {this.props.data[id].name}
                    <Switch
                      checked={this.props.data[id].active}
                      onChange={() => this.handleToggleActive(id)}
                    />
                    <Link to={`/edit/${id}`}>Edit</Link>
                    <Button onClick={() => this.toggleConfirmDelete(id)}>
                      Delete
                    </Button>
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
                <Dropdown
                  overlay={
                    <Menu>
                      {examples.map((example, index) => (
                        <Menu.Item key={example.name}>
                          <a href="#" onClick={e => this.handleAdd(e, index)}>
                            {example.name}
                          </a>
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button>Add script</Button>
                </Dropdown>
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
