/**
 * Vuetify3 Plugin
 */
import { createVuetify } from "vuetify";

// Misc
import { loadFonts } from "./webfontloader";
loadFonts();

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: "#04080F",
    secondary: "#FDFFF7",
    accent: "#F9C633",
    success: "#47121D",
    white: "#FDFFF7",
    "dark-grey": "#403F3F",
    "light-grey": "#8C8A8A",
    "rich-black": "#04080F",
    "light-blue": "#708E9A",
    yellow: "#F9C633"
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

export default vuetify;
