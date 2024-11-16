/**
 * An exmaple script which does nothing
 *
 * chrome.webRequest[{{lifecycle}}].addListener(
 *   {{callback}},
 *   {{filter}},
 *   {{extraInfoSpec}},
 * )
 *
 * For more information, please see webRequest documentation:
 * https://developer.chrome.com/extensions/webRequest
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest
 */

export default {
  lifecycle: "onBeforeSendHeaders",
  callback: () => {
    // Do something here
  },
  filter: {
    urls: ["<all_urls>"],
    // type: ['main_frame'],
  },
  extraInfoSpec: [
    // 'blocking',
  ],
};
