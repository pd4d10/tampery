import { upperFirst } from 'lodash-es'
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

chrome.browserAction.onClicked.addListener(tab => {
  window.open(chrome.runtime.getURL('dist/editor.html'))
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'add':
      const { level, code, filter } = message.payload
      chrome.webRequest['on' + upperFirst(level)].addListener(
        new Function('details', code),
        { urls: ['<all_urls>'] },
        ['requestHeaders'],
      )
      break
  }
})
