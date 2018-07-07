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

async function handleAdd(id, code) {
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
  if (!payload.options) {
    throw new Error('Lack of options')
  }

  chrome.webRequest[payload.lifecycle].addListener(
    payload.callback,
    payload.filter,
    payload.options,
  )
  console.log('Listener added:', id)
  mapper[id] = {
    lifecycle: payload.lifecycle,
    callback: payload.callback,
  }
}

function handleDelete(id) {
  if (!mapper[id]) return
  const { lifecycle, callback } = mapper[id]
  chrome.webRequest[lifecycle].removeListener(callback)
  console.log('Listener removed:', id)
  delete mapper[id]
}

// Browser action click
chrome.browserAction.onClicked.addListener(tab => {
  window.open(chrome.runtime.getURL('dist/editor.html'))
})

// Add listeners already stored at sync
async function addListeners() {
  const data = await storage.get()
  Object.entries(data).forEach(([id, { code, active }]) => {
    if (active) handleAdd(id, code)
  })
}
addListeners()

// Add event listeners: add, delete, ...
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message:', message)
  ;(async function handleMessage() {
    try {
      switch (message.type) {
        case 'add': {
          handleDelete(message.id)
          await handleAdd(message.id, message.code)
          const data = await storage.get()
          data[message.id] = { code: message.code, active: message.active }
          await storage.set(data)
          break
        }
        case 'delete': {
          handleDelete(message.id)
          const data = await storage.get()
          delete data[message.id]
          await storage.set(data)
          break
        }
        case 'deactivate': {
          handleDelete(message.id)
          const data = await storage.get()
          data[message.id].active = false
          await storage.set(data)
          break
        }
        case 'activate': {
          const data = await storage.get()
          handleAdd(message.id, data[message.id].code)
          data[message.id].active = true
          await storage.set(data)
          break
        }
      }
      sendResponse({ message: '' })
    } catch (err) {
      console.error(err)
      sendResponse({
        message: err.message,
      })
    }
  })()

  return true
})
