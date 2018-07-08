import { message } from 'antd'

export const sendMessage = msg => {
  console.log('sendMessage:', msg)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, response => {
      console.log('Response:', response)
      if (response.code) {
        reject(response.message)
        message.error(response.message)
      } else {
        resolve()
        message.success(response.message)
      }
    })
  })
}

export const examples = [
  {
    name: 'Blank',
    code: require('raw-loader!../examples/blank'),
  },
  {
    name: 'Change User-Agent(Change request headers)',
    code: require('raw-loader!../examples/change-user-agent'),
  },
  {
    name: 'Remove UTM tokens(Change URL and redirect)',
    code: require('raw-loader!../examples/remove-utm-tokens'),
  },
]
