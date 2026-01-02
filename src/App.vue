<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useI18n } from 'vue-i18n';

import 'mdui/mdui.css';
import 'mdui';

import './assets/css/index.css';
import './assets/css/font.css';
import './assets/css/transitions.css';

import History from "./components/pages/history.vue";

//============================================================

const { t } = useI18n();

let win;
const isMaximized = ref(false);
let unlistenResize;

onMounted(async () => {
  win = await getCurrentWindow();

  isMaximized.value = await win.isMaximized();

  unlistenResize = await win.onResized(async () => {
    isMaximized.value = await win.isMaximized();
  });
});

onUnmounted(() => {
  if (unlistenResize) {
    unlistenResize();
  }
});

onMounted(() => {
  document.body.style.margin = '0';
  document.body.style.backgroundColor = 'rgba(var(--mdui-color-surface-container))';
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

function handleMaximize() {
  win.toggleMaximize();
};

function handleClose() { win.close() };
</script>

<template>

  <mdui-top-app-bar data-tauri-drag-region>
    <mdui-top-app-bar-title>{{ t('app.title') }}</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon @click="handleMinimize" id="appBar-minimize">
      <span class="material-symbols-rounded">minimize</span>
    </mdui-button-icon>

    <mdui-button-icon @click="handleMaximize" id="appBar-maximize">
      <span class="material-symbols-rounded" style="transform: scale(0.9);">
        {{ isMaximized ? 'ad_group' : 'crop_square' }}
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
div#app {
  user-select: none;

  background-color: rgba(var(--mdui-color-primary-container), 0.4);

}

main {
  position: relative;
  height: calc(100vh - 4rem);
  overflow: hidden;

  .view-container {
    height: calc(100vh - 7rem);
    width: calc(100vw - 8rem);
    padding: 1.25rem;

    background-color: rgb(var(--mdui-color-surface), 0.7);
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