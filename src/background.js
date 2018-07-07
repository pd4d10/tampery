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

async function addListener(id, code) {
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

function removeListener(id) {
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
    if (active) addListener(id, code)
  })
}
addListeners()

// Add event listeners: add, delete, ...
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message:', message)
  ;(async function handleMessage() {
    try {
      const { id, name, code, active, type } = message
      const data = await storage.get()
      switch (type) {
        case 'add': {
          removeListener(id)
          await addListener(id, code)
          data[id] = { name, code, active }
          break
        }
        case 'delete': {
          removeListener(id)
          delete data[id]
          break
        }
        case 'deactivate': {
          removeListener(id)
          data[id].active = false
          break
        }
        case 'activate': {
          await addListener(id, data[id].code)
          data[id].active = true
          break
        }
      }
      await storage.set(data)
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
