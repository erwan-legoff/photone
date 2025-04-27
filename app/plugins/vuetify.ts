import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

// Define the custom dark theme
const customDarkTheme: ThemeDefinition = {
  dark: true, // Indique que c'est un thème sombre
  colors: {
    // Vos couleurs de fond
    background: "#041229", // Garde ce fond que vous aimez

    // --- COULEUR DE SURFACE (ENCORE À DÉFINIR) ---
    // Votre ancienne couleur surface (#4870b0) n'est pas utilisée ici.
    // Il est important de définir une couleur 'surface' qui soit
    // légèrement plus claire que le 'background' pour la hiérarchie visuelle.
    // Je vais laisser la ligne commentée pour l'instant, mais pensez à la définir.
    // Une suggestion pour rester dans les tons bleus et légèrement plus clair que #041229 pourrait être #1A2B41 ou un gris très foncé.
    // surface: '#1A2B41', // <-- Suggestion : un bleu très foncé légèrement plus clair

    // Vos couleurs de rôle principales
    primary: "#00796B", // <-- Suggestion pour un cyan/teal "canard" plus terne (Teal 700)
    secondary: "#546E7A", // Votre bleu-gris pour la couleur secondaire
    accent: "#03DAC6", // <-- Votre cyan vif devient la couleur d'accent

    // Couleurs d'état (erreur, info, succès, avertissement) - Utilisent les valeurs par défaut de Vuetify si non définies
    // error: '#FF5252', // Rouge Material Design A700 par défaut
    // info: '#2196F3', // Bleu Material Design 500 par défaut
    // success: '#4CAF50', // Vert Material Design 500 par défaut
    // warning: '#FB8C00', // Orange Material Design 600 par défaut

    // Couleurs "on-*" pour le texte/icônes sur les fonds colorés.
    // Vuetify les génère automatiquement, mais vous pouvez les écraser si besoin.
    // Par exemple, pour garantir un texte clair sur le fond et la surface, et foncé sur primary/accent vifs :
    // 'on-background': '#E0E0E0',
    // 'on-surface': '#E0E0E0',
    // 'on-primary': '#FFFFFF', // Souvent blanc sur les teals sombres/moyens
    // 'on-secondary': '#E0E0E0',
    // 'on-accent': '#000000', // Souvent noir sur les accents très vifs
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
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
