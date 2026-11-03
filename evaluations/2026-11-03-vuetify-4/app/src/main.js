import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { criarRouter } from './router.js'
import { criarVuetify } from './vuetify.js'

createApp(App).use(createPinia()).use(criarRouter()).use(criarVuetify()).mount('#app')
