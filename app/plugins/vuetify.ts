import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
      background: '#041229',
      surface: '#5379b8',
      // primary: '#6200EE',
      'primary-darken-1': '#3700B3',
      // secondary: '#03DAC6',
      // 'secondary-darken-1': '#018786',
      // error: '#B00020',
      // info: '#2196F3',
      // success: '#4CAF50',
      // warning: '#FB8C00',
    },
  }

  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'customDarkTheme',
      themes: {
        customDarkTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
