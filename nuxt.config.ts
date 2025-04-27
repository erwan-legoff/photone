// https://nuxt.com/docs/api/configuration/nuxt-config
//https://dev.to/nikitadmitr/configure-eslint-prettier-for-nuxt-3-45f7
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error it's for vuetify
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  // Configuration des plugins
  plugins: ["~/plugins/api.ts"],

  build: {
    transpile: ["vuetify"],
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: "2024-11-11",
});
