import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import VueSelect from "vs-vue3-select";
import router from "./router"
import 'vs-vue3-select/dist/vs-vue3-select.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
})
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.component('vs-vue3-select', VueSelect)
app.mount('#app')
