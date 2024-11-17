/// <reference types="vite/client" />
import * as types from "../types";
import { message } from "antd";
import exampleBlank from "../examples/blank.jsonc?raw";
import exampleChangeUserAgent from "../examples/change-user-agent.jsonc?raw";
import exampleAllowCors from "../examples/allow-cors.jsonc?raw";

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
  { title: "Allow CORS", code: exampleAllowCors },
];
