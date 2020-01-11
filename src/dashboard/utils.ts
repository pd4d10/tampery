import * as types from '../types'
import { Toaster } from '@blueprintjs/core'

export const sendMessage = (msg: types.Message) => {
  console.log('sendMessage:', msg)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, response => {
      console.log('Response:', response)
      if (response.code) {
        const t = Toaster.create()
        t.show({ intent: 'warning', message: response.message })
        reject(response.message)
      } else {
        const t = Toaster.create()
        t.show({ intent: 'success', message: response.message })
        resolve()
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
