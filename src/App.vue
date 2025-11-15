<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

import 'mdui/mdui.css';
import 'mdui';

import { getCurrentWindow } from '@tauri-apps/api/window';

import './assets/css/index.css';
import './assets/css/font.css';

//============================================================

let win;
const init = async () => {
  win = await getCurrentWindow();
};
init();


function handleMinimize() { win.minimize() };
function handleMaximize() { win.toggleMaximize() };
function handleClose() { win.close() };

function changeSideValue() {
  document.getElementById("navigation-rail").value = this.value ;
}
</script>


<template>
  <mdui-navigation-rail value="main" id="navigation-rail">
    <mdui-button-icon slot="top">
      <span class="material-symbols-rounded">menu</span>
    </mdui-button-icon>

    <mdui-navigation-rail-item value="main" href="/">
      <span slot="icon" class="material-symbols-rounded">numbers</span>
    </mdui-navigation-rail-item>
    <mdui-navigation-rail-item value="history" href="/history">
      <span slot="icon" class="material-symbols-rounded">history</span>
    </mdui-navigation-rail-item value="settings">

    <mdui-button-icon slot="bottom" href="/settings">
      <span class="material-symbols-rounded">settings</span>
    </mdui-button-icon>

  </mdui-navigation-rail>

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

  <main>
    <router-view class="view-container" />
  </main>
</template>


<style scoped>
main {
  height: calc(100vh - 4rem);

  .view-container {
    height: calc(100vh - 6.5rem);
    width: calc(100vw - 7.5rem);
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
    /* margin-left: 1rem; */
    display: flex;
    align-items: center;

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


router-link {
  margin: 0;
  padding: 0;
}

router-link:hover {
  color: #000;
}
</style>