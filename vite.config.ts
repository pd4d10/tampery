import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        welcome: "dashboard.html",
      },
    },
  },
  plugins: [
    crx({
      manifest: {
        manifest_version: 3,
        name: "Tampery",
        version: pkg.version,
        description: "Tamper browser requests in flight",
        homepage_url: "https://github.com/pd4d10/tampery",
        icons: {
          "128": "icon.png",
        },
        background: {
          service_worker: "src/background.ts",
        },
        permissions: [
          "webRequest",
          "webRequestBlocking",
          "<all_urls>",
          "storage",
        ],
        action: {
          default_popup: "popup.html",
        },
      },
    }),
  ],
});
