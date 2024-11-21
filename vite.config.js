import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from 'vite-plugin-vue-devtools'

import dns from "dns";
dns.setDefaultResultOrder("verbatim");

export default () => {
  const baseURL =
    process.env.APP_ENV === "development" ? "/" : "/2024/project3/t1/";

  return defineConfig({
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
      }),
      vueDevTools()
    ],

    server: {
      host: "localhost",
      port: 8081,
    },
    base: baseURL,
  });
};
