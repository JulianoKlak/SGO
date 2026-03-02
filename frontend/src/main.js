import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading, LocalStorage } from 'quasar'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/src/css/index.sass'
import './css/app.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(Quasar, {
  plugins: { Notify, Dialog, Loading, LocalStorage },
  config: {
    notify: { position: 'top-right' }
  }
})
app.use(pinia)
app.use(router)
app.mount('#app')
