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


const vuetify = createVuetify({
  theme: {
    defaultTheme: 'lightTheme',
    themes:{
      lightTheme: {
        dark: false,
        colors: {
          primary: "#f00",
          secondary: "#00f",
          accent: "#000fff",
          success: "#fff000",
          white: "#00f",
          "dark-grey": "#0f0f0f",
          "light-grey": "#0ffff0",
          "rich-black": "#04080F",
          "light-blue": "#708E9A",
          "background": "#E9ECEA",
          "slider-text": "#403f3f",
          "resume-title": "#403f3f",
          "section-0": "#403f3f",
          "panel-background": "#00f",
          yellow: "#0f0",
          text: "#000"
        },
      },
      darkTheme: {
        dark: true,
        colors: {
          primary: "#403f3f",
          secondary: "#4c4c4c",
          accent: "#F9C633",
          success: "#47121D",
          white: "#FDFFF7",
          "dark-grey": "#403F3F",
          "light-grey": "#8C8A8A",
          "rich-black": "#04080F",
          "light-blue": "#708E9A",
          "background": "#262626",
          "slider-text": "#fdfff7",
          "resume-title": "#fdfff7",
          "section-0": "#fdfff7",
          "section-1": "#4c4c4c",
          "panel-background": "#f00",
          yellow: "#F9C633",
          text: "#000"
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});


export default vuetify;
