import React, { useEffect } from 'react'
import { Switch, Modal, Divider, Table } from 'antd'
import { Link } from 'react-router-dom'
import { useData } from './hooks'

export const Home = () => {
  const { data, remove, activate, deactivate, loadFromStorage } = useData()

  const dataSource = Object.entries(data).map(([id, value]) => ({
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
          onChange={async () => {
            if (data[record.id].active) {
              await activate(record.id)
            } else {
              await deactivate(record.id)
            }
          }}
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

              Modal.confirm({
                title: 'Do you want to delete this item?',
                content:
                  'This operation will delete this item permanently. If you want to keep the code for future use, disable it instead.',
                onOk: () => {
                  remove(record.id)
                },
                onCancel() {},
              })
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

  useEffect(() => {
    loadFromStorage()
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
