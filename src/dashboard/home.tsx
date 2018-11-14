import React, { Component } from 'react'
import {
  Button,
  List,
  Switch,
  Dropdown,
  Menu,
  Modal,
  Divider,
  Table,
} from 'antd'
import { sendMessage, examples } from './utils'
import { Link } from 'react-router-dom'

// const AddScriptButton =

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
    const dataSource = Object.entries(this.props.data).map(([id, value]) => ({
      ...value,
      id,
      key: id,
    }))
    const columns = [
      {
        title: 'Name',
      },
      {
        title: 'Active',
        render: (text, record) => (
          <Switch
            checked={record.active}
            onChange={() => this.handleToggleActive(record.id)}
          />
        ),
      },
      {
        title: 'Actions',
        render: (text, record) => (
          <span>
            <Link to={`/edit/${record.id}`}>Edit</Link>
            <Divider type="vertical" />
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                this.toggleConfirmDelete(record.id)
              }}
            >
              Delete
            </a>
          </span>
        ),
      },
    ].map(item => {
      const key = item.title.toLowerCase()
      return { ...item, key, dataIndex: key }
    })
    return (
      <div>
        <div>
          {dataSource.length ? (
            <div style={{ marginTop: 20 }}>
              <Table columns={columns} dataSource={dataSource} />
            </div>
          ) : (
            <div>
              <p>Seems we don't have any scripts yet.</p>
              <p>Click add button at top right corner to add a new one :)</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
