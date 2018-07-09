# Tampery

Tampery is a browser extension to tamper browser requests in flight. It is **programmable**, which means you could write your own script to intercept, block, or modify browser requests. There is also a dashboard to manage all scripts.

## Installation

Install it from [Chrome Web Store](https://chrome.google.com/webstore/detail/tampery/bipnikifgdamlhpdkkmoaiokbgfkeapl)

## Examples

- [Change User-Agent](src/examples/change-user-agent.js)
- [Remove Google Analytics UTM tokens](src/examples/remove-google-analytics-utm-tokens.js)

## Usage

Tampery use `chrome.webRequest` API under the hood. Basically, every script should export an object as `default`, which has `lifecycle`, `callback`, `filter` and `extraInfoSpec` as keys.

```js
export default {
  lifecycle: 'onBeforeSendHeaders',
  callback: () => {
    // Do things here
  },
  filter: {
    urls: ['<all_urls>'],
    // type: ['main_frame'],
  },
  extraInfoSpec: [
    // 'blocking',
  ],
}
```

Take a look at [examples](#examples) to understand it quickly.

For more information, see documentation of `webRequest` API of [Chrome](https://developer.chrome.com/extensions/webRequest) and [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest)

## License

MIT
