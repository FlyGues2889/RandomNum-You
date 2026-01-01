import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "mdui/mdui.css";
import "mdui";
import theme from "./js/theme.js";

import listContainer from "./components/list-container.vue";
import pageContainer from "./components/page-container.vue";
import contentContainer from "./components/content-container.vue";
import Title from "./components/title.vue";

const app = createApp(App);

app.component("list-container", listContainer);
app.component("page-container", pageContainer);
app.component("content-container", contentContainer);
app.component("Title", Title);

app.use(router);
// apply saved theme before mounting
theme.init();

app.mount("#app");
