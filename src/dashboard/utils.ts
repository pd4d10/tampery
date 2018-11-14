import { message } from 'antd'
import * as types from '../types'

export const sendMessage = (msg: types.Message) => {
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
    name: 'Change User-Agent',
    code: require('raw-loader!../examples/change-user-agent'),
  },
  {
    name: 'Remove Google Analytics UTM tokens',
    code: require('raw-loader!../examples/remove-google-analytics-utm-tokens'),
  },
  {
    name: 'Allow CORS',
    code: require('raw-loader!../examples/allow-cors'),
  },
]
