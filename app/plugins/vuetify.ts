import { createVuetify, type ThemeDefinition } from "vuetify";

// Define the custom dark theme
const customDarkTheme: ThemeDefinition = {
  dark: true, // Indique que c'est un thème sombre
  colors: {
    // Vos couleurs de fond
    background: "#041229", // Garde ce fond que vous aimez
    // Vos couleurs de rôle principales
    primary: "#00796B", // <-- Suggestion pour un cyan/teal "canard" plus terne (Teal 700)
    secondary: "#546E7A", // Votre bleu-gris pour la couleur secondaire
    accent: "#03DAC6", // <-- Votre cyan vif devient la couleur d'accent
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: "customDarkTheme",
      themes: {
        customDarkTheme,
        // Définition basique du thème 'dark' par défaut de Vuetify pour le basculement
        dark: {
          dark: true,
          colors: {
            background: "#121212",
            surface: "#212121",
            primary: "#64B5F6",
            secondary: "#424242",
            accent: "#FF4081",
            error: "#FF5252",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FB8C00",
          },
        },
      },
    },
    // ... autres configurations
  });
  app.vueApp.use(vuetify);
});
