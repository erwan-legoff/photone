// https://nuxt.com/docs/api/configuration/nuxt-config
//https://dev.to/nikitadmitr/configure-eslint-prettier-for-nuxt-3-45f7
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxt/eslint', "vuetify-nuxt-module", '@nuxt/image'],
  pinia: {
    storesDirs: ['./stores/**'],
  },

})