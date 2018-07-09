/**
 * Change all requests' User-Agent to iOS Safari
 */

const myUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'

export default {
  lifecycle: 'onBeforeSendHeaders',
  callback: ({ requestHeaders }) => {
    for (var i = 0; i < requestHeaders.length; ++i) {
      if (requestHeaders[i].name.toLowerCase() === 'user-agent') {
        requestHeaders[i].value = myUserAgent
        break
      }
    }
    return { requestHeaders }
  },
  filter: {
    urls: ['<all_urls>'],
  },
  extraInfoSpec: [
    'requestHeaders',
    'blocking', // Add `blocking` here since we want to change request headers
  ],
}
