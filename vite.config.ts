import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";

export default defineConfig({
  plugins: [
    crx({
      manifest: {
        manifest_version: 2,
        name: "Tampery",
        version: "0.0.4",
        minimum_chrome_version: "63",
        description: "Tamper browser requests in flight",
        homepage_url: "https://github.com/pd4d10/tampery",
        icons: {
          "128": "icon.png",
        },
        background: {
          scripts: ["src/background.ts"],
        },
        permissions: [
          "webRequest",
          "webRequestBlocking",
          "<all_urls>",
          "storage",
        ],
        browser_action: {
          default_popup: "popup.html",
        },
      },
    }),
  ],
});
