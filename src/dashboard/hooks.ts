import { useState, useEffect } from 'react'
import { sendMessage } from './utils'
import { storage } from '../utils'

type Data = {
  [id: string]: any
}

export const useData = () => {
  const [data, setData] = useState<Data>({})

  const loadFromStorage = async () => {
    const newData = await storage.get()
    setData(newData)
  }

  useEffect(() => {
    loadFromStorage()
  }, [])

  const activate = async (id: string) => {
    await sendMessage({ type: 'activate', id })
    await loadFromStorage()
  }

  const deactivate = async (id: string) => {
    await sendMessage({ type: 'deactivate', id })
    await loadFromStorage()
  }

  const remove = async (id: string) => {
    await sendMessage({ type: 'delete', id })
    await loadFromStorage()
  }

  const add = async (
    id: string,
    name: string,
    code: string,
    active: boolean,
  ) => {
    await sendMessage({
      type: 'add',
      id,
      name,
      code,
      active,
    })
    await loadFromStorage()
  }

  return { data, activate, deactivate, remove, add, loadFromStorage }
}
