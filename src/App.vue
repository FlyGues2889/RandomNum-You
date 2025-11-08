<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

import 'mdui/mdui.css';
import 'mdui';

import { getCurrentWindow } from '@tauri-apps/api/window';

import './css/index.css';

//============================================================

let win;
const init = async () => {
  win = await getCurrentWindow();
};
init();

const handleMinimize = async () => {
  await win.minimize();
};

const handleMaximize = async () => {
  const isMax = await win.isMaximized();
  if (isMax) {
    await win.unmaximize();
  } else {
    await win.maximize();
  }
};

const handleClose = async () => {
  try {
    await win.close();
  } catch (err) {
  }
};
</script>


<template>
  <mdui-navigation-rail value="main">
    <mdui-button-icon slot="top">
      <span class="material-symbols-rounded">menu</span>
    </mdui-button-icon>

    <mdui-navigation-rail-item value="main">
      <router-link slot="icon" to="/">
        <span class="material-symbols-rounded">numbers</span>
      </router-link>
    </mdui-navigation-rail-item value="history">
    <mdui-navigation-rail-item>
      <router-link slot="icon" to="/history">
        <span class="material-symbols-rounded">history</span>
      </router-link>
    </mdui-navigation-rail-item value="settings">

    <div slot="bottom">
      <mdui-button-icon class="loading" disabled>
        <mdui-circular-progress style="width: 50%;"></mdui-circular-progress>
      </mdui-button-icon>

      <mdui-button-icon>
        <router-link to="/settings">
          <span class="material-symbols-rounded">settings</span>
        </router-link>
      </mdui-button-icon>
    </div>

  </mdui-navigation-rail>

  <mdui-top-app-bar data-tauri-drag-region>
    <mdui-top-app-bar-title>RandomNum You</mdui-top-app-bar-title>

    <div style="flex-grow: 1"></div>

    <mdui-button-icon @click="handleMinimize">
      <span class="material-symbols-rounded">minimize</span>
    </mdui-button-icon>
    <mdui-button-icon @click="handleMaximize">
      <span class="material-symbols-rounded" style="font-size: 1.2rem;">crop_square</span>
    </mdui-button-icon>
    <mdui-button-icon @click="handleClose" style="margin-right: 8px;">
      <span class="material-symbols-rounded">close</span>
    </mdui-button-icon>
  </mdui-top-app-bar>

  <main>
    <router-view class="view-container" />
  </main>
</template>


<style scoped>
main {
  height: calc(100vh - 4rem);

  .view-container {
    height: calc(100vh - 7rem);
    width: calc(100vw - 8rem);
    background-color: rgb(var(--mdui-color-surface));
    border-radius: var(--mdui-shape-corner-small);
  }
}

mdui-navigation-rail {
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
  margin-left: 5.1rem;

  background-color: unset;
  color: rgb(var(--mdui-color-primary));


  mdui-top-app-bar-title {
    /* opacity: 0.8; */
    margin-left: 1rem;
    display: flex;
    align-items: center;

    font-family: 'Manrope';
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


router-link {
  margin: 0;
}
</style>