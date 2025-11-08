import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/pages/main.vue'
import HistoryPage from '../components/pages/history.vue'
import SettingsPage from '../components/pages/settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',          // URL 路径（首页）
      name: 'home',
      component: MainPage // 对应页面组件
    },
    {
      path: '/history',     // 历史记录页路径
      name: 'history',
      component: HistoryPage
    },
    {
      path: '/settings',     // 设置页路径
      name:'settings',
      component: SettingsPage
    }
  ]
})

export default router