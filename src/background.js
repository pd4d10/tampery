chrome.webRequest.onSendHeaders.addListener(
  details => {
    console.log('onSendHeaders', details, data)
    data[details.tabId] = {
      request: details.requestHeaders,
    }
  },
  filter,
  ['requestHeaders'],
)
