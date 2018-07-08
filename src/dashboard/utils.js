import { message } from 'antd'

export const sendMessage = msg => {
  console.log('sendMessage:', msg)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, response => {
      console.log('Response:', response)
      if (response.code) {
        message.error(response.message)
      } else {
        message.success(response.message)
      }
      resolve()
    })
  })
}
