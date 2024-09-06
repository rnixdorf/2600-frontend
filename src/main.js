import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import VueSelect from "vs-vue3-select";
import router from "./router"
import 'vs-vue3-select/dist/vs-vue3-select.css';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('vs-vue3-select', VueSelect)
app.mount('#app')
