<script setup>
import 'material-symbols';
import { ref, watch } from 'vue';

import 'mdui/mdui.css';

const outNum = ref(714213);

function generateNum() {
  outNum.value = Math.floor(Math.random() * 900000) + 100000;
}
</script>

<template>
  <page-container>
    <div class="content-container">
      <mdui-fab id="btn" class="mdui-fab"size="large" @click="generateNum">
        <span slot="icon" class="material-symbols-rounded">touch_app</span>
      </mdui-fab>

      <mdui-dropdown trigger="contextmenu" open-on-pointer>
        <div id="out" slot="trigger" v-text="outNum"></div>
        <mdui-menu style="border-radius: var(--mdui-shape-corner-large);" dense>
          <mdui-menu-item>
            <span slot="icon" class="material-symbols-rounded">copy_all</span>
            复制
          </mdui-menu-item>
        </mdui-menu>
      </mdui-dropdown>

    </div>
  </page-container>
</template>

<style scoped>

#out {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: 24vh;
  font-family: 'Nunito';
  color: rgb(var(--mdui-color-secondary));
}

#btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;

  background-color: rgb(var(--mdui-color-secondary-container));

  span {
    font-size: 2.25rem;
  }
}
</style>