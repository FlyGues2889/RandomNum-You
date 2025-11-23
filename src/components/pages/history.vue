<script setup>
import 'material-symbols';
import { ref } from 'vue';

import historyChip from '../history-chip.vue';

import 'mdui/mdui.css';
</script>

<template>
  <page-container>
    <div class="content-container">
      <h1>历史记录</h1>
      <list-container>
        <template v-slot:title>
          <mdui-list-item nonclickable>
            <span class="out" slot="icon">215988</span>
            <span slot="description">当前结果</span>
          </mdui-list-item>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">history</span>
          抽取记录
        </mdui-list-item>
        <div style="margin-left: 3.2rem;">          
          <history-chip>123</history-chip>
        </div>
      </list-container>
    </div>
  </page-container>
</template>

<style scoped>
span.out {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(var(--mdui-color-primary));
  font-family: 'Nunito';
}
</style>