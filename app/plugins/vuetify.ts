import { createVuetify, type ThemeDefinition } from "vuetify";

// Define the custom dark theme
const customDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    /* == FOND GLOBAL ====================================================== */
    background: "#041229", // bleu nuit

    /* == FOND DES COMPOSANTS (cartes, feuilles…) ========================= */
    surface: "#212121", // gris “Vuetify”

    /* == RÔLES ============================================================ */
    primary: "#00796B", // teal 700
    secondary: "#546E7A", // blue-grey
    accent: "#03DAC6", // cyan vif
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "customDarkTheme",
      themes: { customDarkTheme },
    },
  });
  app.vueApp.use(vuetify);
});
