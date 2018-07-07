

export const sendMessage = message => {
  console.log('sendMessage:', message)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      console.log('Response:', response)
      if (response.message) {
        alert(response.message)
      } else {
        resolve()
      }
    })
  })
}
