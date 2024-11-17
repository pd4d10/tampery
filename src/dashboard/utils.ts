/// <reference types="vite/client" />
import * as types from "../types";
import { message } from "antd";
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
        message.warning(response.message);
        reject(response.message);
      } else {
        message.success(response.message);
        resolve(null);
      }
    });
  });
};

export const examples = [
  { title: "Blank", code: exampleBlank },
  { title: "Change User-Agent", code: exampleChangeUserAgent },
  {
    title: "Remove Google Analytics UTM tokens",
    code: exampleRemoveGoogleAnalyticsUtmTokens,
  },
  { title: "Allow CORS", code: exampleAllowCors },
];
