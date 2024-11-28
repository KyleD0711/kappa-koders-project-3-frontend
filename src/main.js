import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import vuetify from "./plugins/vuetify.js";
import { createPinia } from "pinia";

import vueformConfig from "../vueform.config.js";
import Vueform from "@vueform/vueform";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(Vueform, vueformConfig);
app.mount("#app");
