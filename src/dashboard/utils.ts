/// <reference types="vite/client" />
import * as types from "../types";
import { Toaster } from "@blueprintjs/core";
import exampleBlank from "../examples/blank?raw";
import exampleChangeUserAgent from "../examples/change-user-agent?raw";
import exampleRemoveGoogleAnalyticsUtmTokens from "../examples/remove-google-analytics-utm-tokens?raw";
import exampleAllowCors from "../examples/allow-cors?raw";

export const sendMessage = (msg: types.Message) => {
  console.log("sendMessage:", msg);
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (response) => {
      console.log("Response:", response);
      if (response.code) {
        const t = Toaster.create();
        t.show({ intent: "warning", message: response.message });
        reject(response.message);
      } else {
        const t = Toaster.create();
        t.show({ intent: "success", message: response.message });
        resolve();
      }
    });
  });
};

export const examples = [
  { name: "Blank", code: exampleBlank },
  { name: "Change User-Agent", code: exampleChangeUserAgent },
  {
    name: "Remove Google Analytics UTM tokens",
    code: exampleRemoveGoogleAnalyticsUtmTokens,
  },
  { name: "Allow CORS", code: exampleAllowCors },
];
