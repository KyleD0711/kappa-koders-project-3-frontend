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
    defaultTheme: 'darkTheme',
    themes:{
      lightTheme: {
        dark: false,
        colors: {
          primary: "#f00",
          secondary: "#00f",
          accent: "#000fff",
          success: "#fff000",
          white: "#00f",
          darkGrey: "#0f0f0f",
          lightGrey: "#0ffff0",
          richBlack: "#04080F",
          lightBlue: "#708E9A",
          background: "#E9ECEA",
          sliderText: "#403f3f",
          resumeTitle: "#403f3f",
          section0: "#403f3f",
          panelBackground: "#00f",
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
