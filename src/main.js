import { createApp } from "vue";
import App from "./App.vue";
import router from './router';

import 'mdui/mdui.css';
import 'mdui';

import listContainer from "./components/list-container.vue";
import pageContainer from "./components/page-container.vue";
import contentContainer from "./components/content-container.vue";
import Title from "./components/title.vue";

const app = createApp(App)

app.component("list-container", listContainer)
app.component("page-container", pageContainer)
app.component("content-container", contentContainer)
app.component("Title", Title)

app.use(router)

app.mount("#app");