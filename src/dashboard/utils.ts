/// <reference types="vite/client" />
import exampleBlank from "../examples/blank.jsonc?raw";
import exampleChangeUserAgent from "../examples/change-user-agent.jsonc?raw";
import exampleAllowCors from "../examples/allow-cors.jsonc?raw";

export const examples = [
  { title: "Blank", code: exampleBlank },
  { title: "Change User-Agent", code: exampleChangeUserAgent },
  { title: "Allow CORS", code: exampleAllowCors },
];
