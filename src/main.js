import { createApp } from 'vue';
import axios from 'axios';
import Toaster from '@meforma/vue-toaster';
import VCalendar from 'v-calendar';

import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toaster);
app.use(VCalendar, {})

axios.defaults.baseURL = 'http://localhost:8080/';

app.mount('#app');
