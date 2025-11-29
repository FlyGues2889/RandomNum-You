<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue"; // 引入生命周期钩子
import { useRoute, useRouter } from "vue-router";
import { getCurrentWindow } from '@tauri-apps/api/window';
// import { invoke } from "@tauri-apps/api/core"; // 如果没用到可以注释掉

import 'mdui/mdui.css';
import 'mdui';

import './assets/css/index.css';
import './assets/css/font.css';
import './assets/css/transitions.css';

import History from "./components/pages/history.vue";

//============================================================

let win;
const isMaximized = ref(false); // 1. 新增：用于存储是否最大化的状态
let unlistenResize; // 用于存储取消监听的函数

// 2. 修改：将初始化逻辑放入 onMounted，并添加监听器
onMounted(async () => {
  win = await getCurrentWindow();
  
  // 初始化时检查当前状态
  isMaximized.value = await win.isMaximized();

  // 监听窗口调整大小事件 (包括最大化/还原)
  // Tauri v2 推荐使用 win.onResized 或类似的事件监听
  unlistenResize = await win.onResized(async () => {
    isMaximized.value = await win.isMaximized();
  });
});

// 组件卸载时清理监听器
onUnmounted(() => {
  if (unlistenResize) {
    unlistenResize();
  }
});

const route = useRoute();
const router = useRouter();
const value = ref('main');

watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case '/':
        value.value = 'main';
        break;
      case '/history':
        value.value = 'history';
        break;
      case '/settings':
        value.value = 'settings';
        break;
    }
  },
  { immediate: true }
);

function handleMinimize() { win.minimize() };

// 3. 修改：handleMaximize 只负责切换，状态由监听器自动更新
function handleMaximize() { 
  win.toggleMaximize();
};

function handleClose() { win.close() };
</script>

<template>
  
  <mdui-top-app-bar data-tauri-drag-region>
    <mdui-top-app-bar-title>RandomNum You</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon @click="handleMinimize" id="appBar-minimize">
      <span class="material-symbols-rounded">minimize</span>
    </mdui-button-icon>
    
    <mdui-button-icon @click="handleMaximize" id="appBar-maximize">
      <span class="material-symbols-rounded" style="transform: scale(0.9);">
        {{ isMaximized ? 'filter_none' : 'crop_square' }}
      </span>
    </mdui-button-icon>

    <mdui-button-icon @click="handleClose" id="appBar-close" style="margin-right: 8px;">
      <span class="material-symbols-rounded">close</span>
    </mdui-button-icon>
  </mdui-top-app-bar>
  
  <mdui-navigation-rail :value="value" id="navigation-rail">
    <mdui-navigation-rail-item value="main" @click="route.path !== '/' && router.push('/')"
      :class="{ 'active-nav-item': value === 'main' }">
      <span slot="icon" class="material-symbols-rounded">numbers</span>
    </mdui-navigation-rail-item>

    <mdui-navigation-rail-item value="history" @click="route.path !== '/history' && router.push('/history')"
      :class="{ 'active-nav-item': value === 'history' }">
      <span slot="icon" class="material-symbols-rounded">history</span>
    </mdui-navigation-rail-item>

    <mdui-navigation-rail-item slot="bottom" value="settings"
      @click="route.path !== '/settings' && router.push('/settings')"
      :class="{ 'active-nav-item': value === 'settings' }">
      <span slot="icon" class="material-symbols-rounded">settings</span>
    </mdui-navigation-rail-item>

  </mdui-navigation-rail>
  <main>
    <router-view v-slot="{ Component, route }">
      <transition name="slide-fade" mode="out-in">
        <component :is="Component" :key="route.path" class="view-container" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
/* 样式保持不变 */
main {
  position: relative; /* Establish positioning context */
  height: calc(100vh - 4rem);
  overflow: hidden; /* Hide scrollbars during animation */
  .view-container {
    height: calc(100vh - 6.5rem);
    width: calc(100vw - 7.5rem);
    overflow: auto; /* Allow scrolling within the page */
    background-color: rgb(var(--mdui-color-surface));
    border-radius: var(--mdui-shape-corner-medium);
    padding: 1.25rem;
  }
}

mdui-navigation-rail {
  margin-top: 4rem;
  z-index: 990;
  background-color: unset;
  div[slot="bottom"] {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

mdui-top-app-bar {
  background-color: unset;
  color: rgb(var(--mdui-color-primary));
  mdui-top-app-bar-title {
    margin-left: 1.2rem;
    font-family: 'Nunito';
    font-size: 1.25rem;
    color: rgb(var(--mdui-color-primary));
    -webkit-app-region: drag;
    user-select: none;
  }
  mdui-button-icon {
    margin: 0;
    transform: scale(0.9);
    color: rgb(var(--mdui-color-primary));
  }
}
</style>