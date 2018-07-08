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
