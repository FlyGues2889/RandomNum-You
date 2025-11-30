<script setup>
import 'material-symbols';
import { ref } from 'vue';

import historyChip from '../history-chip.vue';

import 'mdui/mdui.css';
</script>

<template>
  <page-container>
    <content-container>
      <Title title="历史记录" />
      <list-container>
        <template v-slot:title>
          <mdui-list-item nonclickable>
            <span class="out">215988</span>
            <mdui-button-icon slot="icon" disabled>
              <span class="material-symbols-rounded">arrow_forward</span>
            </mdui-button-icon>
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
    </content-container>
  </page-container>
</template>

<style scoped>
span.out {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 2rem;
  color: rgba(var(--mdui-color-primary));
  font-family: 'Nunito';
}
</style>