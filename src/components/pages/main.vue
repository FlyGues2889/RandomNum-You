<template>
  <div class="page-container">
    <h1>数字抽取</h1>

    <div class="dragBar">
      <div class="dragArea">
        <span class="material-symbols-rounded">drag_handle</span>
      </div>
      <div>
        <mdui-fab id="btn" class="mdui-fab">
          <span slot="icon" class="material-symbols-rounded-fill">touch_app</span>
        </mdui-fab>
      </div>
    </div>

    <mdui-dropdown trigger="contextmenu" open-on-pointer>
      <div id="out" slot="trigger">
        <mdui-button variant="text" id="mainTip">
          <span slot="icon" class="material-symbols-rounded">info</span>
          点击右下方按钮开始抽取
        </mdui-button>
      </div>
      <mdui-menu style="border-radius: var(--mdui-shape-corner-large);" dense>
        <mdui-menu-item>
          <span slot="icon" class="material-symbols-rounded">copy_all</span>
          复制
        </mdui-menu-item>
      </mdui-menu>
    </mdui-dropdown>

  </div>
</template>

<script setup>
import 'material-symbols';
</script>

<style scoped>
.page-container {
  padding: 1rem;
}
</style>