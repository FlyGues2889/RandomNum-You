<script setup>
import 'material-symbols';
import { ref, onMounted } from 'vue';
import HistoryService from '../../js/HistoryService.js';
import historyChip from '../history-chip.vue';
import Title from '../title.vue';
import ListContainer from '../list-container.vue';

import 'mdui/mdui.css';

const history = ref([]);

onMounted(() => {
  loadHistory();
});

function loadHistory() {
  history.value = HistoryService.getHistory();
}

function clearHistory() {
  HistoryService.clearHistory();
  history.value = [];
}
</script>

<template>
  <page-container>
    <content-container>
      <Title title="历史记录" />
      <ListContainer>
        <template v-slot:title>
          <mdui-list-item nonclickable>
            <span class="out">{{ history.length > 0 ? history[0].number : '暂无记录' }}</span>
            <mdui-button-icon slot="icon" disabled>
              <span class="material-symbols-rounded">arrow_forward</span>
            </mdui-button-icon>
          </mdui-list-item>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">history</span>
          抽取记录
        </mdui-list-item>
        <div style="margin-left: 3.2rem;" v-if="history.length > 0">
          <div v-for="(item, index) in history" :key="index" style="margin-bottom: 0.5rem;">
            <history-chip>{{ item.number }}</history-chip>
            <span class="timestamp">{{ item.timestamp }}</span>
          </div>
        </div>
        <div v-else style="margin-left: 3.2rem; color: #888;">
          <p>暂无抽取记录</p>
        </div>

        <mdui-list-item v-if="history.length > 0" @click="clearHistory" style="color: #f44336;">
          <span slot="start" class="material-symbols-rounded">delete</span>
          清空历史记录
        </mdui-list-item>
      </ListContainer>
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

.timestamp {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
</style>