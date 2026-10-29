import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { VAlert, VApp, VAppBar, VBtn, VCard, VCardText, VCol, VContainer, VForm, VList, VListItem, VMain, VProgressCircular, VProgressLinear, VRow, VTextField } from 'vuetify/components'
import { Ripple } from 'vuetify/directives'
import 'vuetify/styles'
import App from './App.vue'
import { router } from './router.js'

const vuetify = createVuetify({
  components: { VAlert, VApp, VAppBar, VBtn, VCard, VCardText, VCol, VContainer, VForm, VList, VListItem, VMain, VProgressCircular, VProgressLinear, VRow, VTextField },
  directives: { Ripple },
  theme: { themes: { light: { colors: { success: '#2E7D32', 'on-success': '#FFFFFF' }, variables: { 'medium-emphasis-opacity': 0.75 } } } },
  defaults: { VBtn: { variant: 'flat', color: 'primary' }, VTextField: { variant: 'outlined' } },
})
createApp(App).use(createPinia()).use(vuetify).use(router).mount('#app')
