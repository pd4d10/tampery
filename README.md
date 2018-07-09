# Tampery

Tampery is a browser extension to tamper browser requests in flight. It is programmable, so you could write your own script to intercept, block, or modify browser requests.

## Installation

## Examples

- [Change User-Agent](src/examples/change-user-agent.js)
- [Remove Google Analytics UTM tokens](src/examples/remove-google-analytics-utm-tokens.js)

## Technical details

This extension use `chrome.webRequest` API.

For more information, see documentation of `webRequest` API of [Chrome](https://developer.chrome.com/extensions/webRequest) and [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest)

## License

MIT
