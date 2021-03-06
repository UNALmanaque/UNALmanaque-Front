import { createApp } from 'vue';
import axios from 'axios';
import Toaster from '@meforma/vue-toaster';
import VCalendar from 'v-calendar';
import VueApexCharts from "vue3-apexcharts";
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'
import { DraggablePlugin} from '@braks/revue-draggable';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toaster);
app.use(VCalendar, {})
app.use(VueApexCharts)
app.use(DraggablePlugin)
axios.defaults.baseURL = 'http://localhost:8080/';


app.mount('#app');
