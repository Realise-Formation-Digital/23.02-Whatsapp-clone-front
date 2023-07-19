import { createApp } from 'vue'
import App from './App.vue'
import router from "./libs/router.js";
import vuetify from "./libs/vuetify.js";
import dayjs from 'dayjs';
import utcPlugin from 'dayjs-plugin-utc';
import pinia from './libs/pinia.js'
dayjs.extend(utcPlugin);

createApp(App).use(router).use(vuetify).use(pinia).mount('#app')
