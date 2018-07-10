/**
 * This script remove Google Analytics UTM tokens
 * https://github.com?utm_source=xxx&utm_medium=email -> https://github.com
 */

export default {
  lifecycle: 'onBeforeRequest',
  callback: details => {
    const url = new URL(details.url)
    const keys = url.searchParams.keys()
    const keysToBeDeleted = []
    for (const key of keys) {
      if (key.startsWith('utm_')) {
        keysToBeDeleted.push(key)
      }
    }
    keysToBeDeleted.forEach(key => {
      url.searchParams.delete(key)
    })

    // Only redirect if the new URL is different with the old
    const newUrl = url.toString()
    if (newUrl != details.url) {
      return { redirectUrl: newUrl }
    }
  },
  filter: {
    urls: ['<all_urls>'],
    types: [
      // Only do removal at main frame,
      // because we don't care URL of XHR, images or any other resources
      'main_frame',
    ],
  },
  extraInfoSpec: [
    'blocking', // Add `blocking` here so we can do redirect
  ],
}
