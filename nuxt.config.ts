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
    "@nuxtjs/i18n",
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
  i18n: {
    defaultLocale: "fr",
    locales: [
      { code: "fr", name: "Français", file: "fr.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Español", file: "es.json" },
      { code: "zh", name: "中文 (简体)", file: "zh.json" },
    ],
  },
  runtimeConfig: {
    public: {
      mediumServiceRoute: process.env.NUXT_PUBLIC_MEDIUM_SERVICE_ROOT,
    },
  },
  css: ["vuetify/styles", "@mdi/font/css/materialdesignicons.css"],

  compatibilityDate: "2024-11-11",
});
