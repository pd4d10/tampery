/**
 * Allow CORS for every site by adding `Access-Control-Allow-Origin: *` to response headers
 * This script may break some sites, because when it is set to `*`,
 * it does not allow requests to supply credentials like cookies
 * Please change filter.urls before use
 */

export default {
  lifecycle: "onHeadersReceived",
  callback: ({ responseHeaders }) => {
    let hasHeader = false;
    for (let i = 0; i < responseHeaders.length; i++) {
      if (
        responseHeaders[i].name.toLowerCase() === "access-control-allow-origin"
      ) {
        responseHeaders[i].value = "*";
        hasHeader = true;
      }
    }
    if (!hasHeader) {
      responseHeaders.push({
        name: "Access-Control-Allow-Origin",
        value: "*",
      });
    }
    return { responseHeaders }; // Return to change headers
  },
  filter: {
    urls: ["<all_urls>"], // Please change here, only include the sites you want
  },
  extraInfoSpec: [
    "responseHeaders", // Add `responseHeaders` to access response headers
    "blocking", // Add `blocking` here since we want to change response headers
  ],
};
