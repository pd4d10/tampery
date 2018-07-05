// import { upperFirst } from 'lodash-es'
import { v4 } from 'uuid'

// chrome.webRequest.onSendHeaders.addListener(
//   details => {
//     console.log('onSendHeaders', details, data)
//     // data[details.tabId] = {
//     //   request: details.requestHeaders,
//     // }
//   },
//   filter,
//   ['requestHeaders'],
// )

// import ua from './examples/user-agent'
import qs from './examples/remove-query-string'
// checkPayload(ua)
// chrome.webRequest[ua.lifecycle].addListener(ua.context, ua.filter, ua.options)
const { payload } = qs
chrome.webRequest[payload.lifecycle].addListener(
  payload.context,
  payload.filter,
  payload.options,
)

function checkPayload(payload) {
  // return true
}

chrome.browserAction.onClicked.addListener(tab => {
  window.open(chrome.runtime.getURL('dist/editor.html'))
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message:', message)
  ;(async () => {
    try {
      switch (message.type) {
        case 'add':
          const blob = new Blob([message.code], { type: 'text/javascript' })
          const url = URL.createObjectURL(blob)

          // https://github.com/webpack/webpack/pull/7034
          const {
            default: payload,
          } = await import(/* webpackIgnore: true */ url)
          checkPayload(payload)

          chrome.webRequest[payload.lifecycle].addListener(
            payload.context,
            payload.filter,
            payload.options,
          )

          // chrome.storage.sync.set()
          break
        case 'delete':
          break
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
