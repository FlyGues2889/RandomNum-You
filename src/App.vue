<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router"; // 导入路由相关实例
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from "@tauri-apps/api/core";

import 'mdui/mdui.css';
import 'mdui';

import './assets/css/index.css';
import './assets/css/font.css';

import History from "./components/pages/history.vue";

//============================================================

let win;
const init = async () => {
  win = await getCurrentWindow();
};
init();

const route = useRoute();
const router = useRouter(); // 初始化路由跳转实例（核心修改）
const value = ref('main');

// 监听路由变化，同步导航选中状态（原有逻辑不变）
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
function handleMaximize() { win.toggleMaximize() };
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
      <span class="material-symbols-rounded" style="transform: scale(0.9);">ad_group</span>
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
    <router-view class="view-container" />
  </main>
</template>

<style scoped>
main {
  height: calc(100vh - 4rem);

  overflow: auto;

  .view-container {
    height: calc(100vh - 6.5rem);
    width: calc(100vw - 7.5rem);
    background-color: rgb(var(--mdui-color-surface));
    border-radius: var(--mdui-shape-corner-medium);
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