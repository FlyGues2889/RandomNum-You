import { createApp } from "vue";
import App from "./App.vue";
import router from './router';

import 'mdui/mdui.css';
import 'mdui';

import listContainer from "./components/list-container.vue";
import pageContainer from "./components/page-container.vue";

const app = createApp(App)

app.component("list-container", listContainer)
app.component("page-container", pageContainer)

app.use(router)

app.mount("#app");