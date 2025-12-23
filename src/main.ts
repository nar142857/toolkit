import { createApp } from 'vue'
import './index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)
app.use(TDesign)
app.use(createPinia())
app.mount('#app')
