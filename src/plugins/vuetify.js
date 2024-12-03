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
          secondary: "#a5b2ab",
          tertiary: "#91A198",
          accent: "#000fff",
          success: "#fff000",
          richBlack: "#04080F",
          lightBlue: "#708E9A",
          background: "#E9ECEA",
          sliderText: "#403f3f",
          resumeTitle: "#403f3f",
          section0: "#C2C4C3",
          section1: "#777E7A",
          panelBackground: "#666",
          yellow: "#0f0",
          text: "#141514",
          chatUser: "#d9d9d9",
          chatAI: "#999"
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
          darkGrey: "#403F3F",
          lightGrey: "#8C8A8A",
          richBlack: "#04080F",
          lightBlue: "#708E9A",
          background: "#262626",
          sliderText: "#fdfff7",
          resumeTitle: "#fdfff7",
          section0: "#333",
          section1: "#4c4c4c",
          panelBackground: "#666",
          yellow: "#F9C633",
          text: "#141514",
           chatUser: "#8b8b8b",
          chatAI: "#999"
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});


export default vuetify;
