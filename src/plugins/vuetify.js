import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#80162B",
        secondary: "#E1E1E1",
        accent: "#47121D",
        success: "#47121D",
        error: "#EE5044",
        teal: "#63BAC0",
        blue: "#196CA2",
        yellow: "#F8C545",
        darkblue: "#032F45",
      },
    },
  },
  icons: {
    iconfont: "mdi", // default - only for display purposes
  },
});
