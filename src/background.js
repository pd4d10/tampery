import { storage } from './utils'

// Save lifecycle and callback reference for removal
const mapper = {}

const LIFECYCLES = [
  'onBeforeRequest',
  'onBeforeSendHeaders',
  'onSendHeaders',
  'onHeadersReceived',
  'onAuthRequired',
  'onBeforeRedirect',
  'onResponseStarted',
  'onCompleted',
  'onErrorOccurred',
]

async function addListener(id, name, code) {
  if (!name || typeof name !== 'string') {
    throw new Error('Please specify a name')
  }

  const blob = new Blob([code], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob)

  // Do not compile dynamic import here
  // https://github.com/webpack/webpack/pull/7034
  const { default: payload } = await import(/* webpackIgnore: true */ url)

  if (!LIFECYCLES.includes(payload.lifecycle)) {
    throw new Error('Invalid lifecycle')
  }
  if (typeof payload.callback !== 'function') {
    throw new Error('callback should be a function')
  }
  if (!payload.filter) {
    throw new Error('Lack of filter')
  }
  if (!payload.extraInfoSpec) {
    throw new Error('Lack of extraInfoSpec')
  }

  chrome.webRequest[payload.lifecycle].addListener(
    payload.callback,
    payload.filter,
    payload.extraInfoSpec,
  )
  console.log('Listener added:', id)
  mapper[id] = {
    lifecycle: payload.lifecycle,
    callback: payload.callback,
  }
}

function removeListener(id) {
  if (!mapper[id]) return
  const { lifecycle, callback } = mapper[id]
  chrome.webRequest[lifecycle].removeListener(callback)
  console.log('Listener removed:', id)
  delete mapper[id]
}

// Add listeners already stored at sync
async function addListeners() {
  const data = await storage.get()
  Object.entries(data).forEach(([id, { name, code, active }]) => {
    if (active) addListener(id, name, code)
  })
}
addListeners()

// Apply change sync from remote
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log('Storage change:', changes, areaName)
  if (areaName === 'sync' && changes.data) {
    // Remove all deleted listener
    Object.entries(changes.data.oldValue || {}).forEach(([id]) => {
      if (!changes.data.newValue[id]) {
        removeListener(id)
      }
    })
    // Apply new active state
    Object.entries(changes.data.newValue).forEach(
      ([id, { name, code, active }]) => {
        if (active && !mapper[id]) {
          addListener(id, name, code)
        } else if (!active && mapper[id]) {
          removeListener(id)
        }
      },
    )
  }
})

// Add event listeners: add, delete, ...
async function handleMessage(msg, sendResponse) {
  try {
    const { id, name, code, active, type } = msg
    const data = await storage.get()
    removeListener(id) // Always remove the old listener
    switch (type) {
      case 'add': {
        await addListener(id, name, code)
        data[id] = { name, code, active }
        break
      }
      case 'delete': {
        delete data[id]
        break
      }
      case 'deactivate': {
        data[id].active = false
        break
      }
      case 'activate': {
        await addListener(id, data[id].name, data[id].code)
        data[id].active = true
        break
      }
    }
    await storage.set(data)
    sendResponse({ code: 0, message: `${type} success` })
  } catch (err) {
    console.error(err)
    sendResponse({
      code: 1,
      message: err.message,
    })
  }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message:', message)
  handleMessage(message, sendResponse)
  return true
})
