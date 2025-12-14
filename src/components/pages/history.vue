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
            <span class="out">{{ history.length > 0 ? history[0].number : 'None' }}</span>
            <mdui-button-icon slot="icon" disabled>
              <span class="material-symbols-rounded">arrow_forward</span>
            </mdui-button-icon>
          </mdui-list-item>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">history</span>
          抽取记录
        </mdui-list-item>
        <mdui-list-item nonclickable class="pickStatue" v-if="history.length > 0">
          <mdui-list-item nonclickable v-for="(item, index) in history" :key="index" style="margin-bottom: 0.5rem;">
            <history-chip slot="icon">{{ item.number }}</history-chip>
            <span slot="end-icon" class="timestamp">{{ item.timestamp }}</span>
          </mdui-list-item>
        </mdui-list-item>
        <mdui-list-item nonclickable class="pickStatue" v-else>
          <p style="text-align: center;color: rgba(var(--mdui-color-secondary),0.7);">暂无抽取记录</p>
        </mdui-list-item>

      </ListContainer>
    </content-container>

    <mdui-fab extended id="delHistoryBtn" class="mdui-fab" v-if="history.length > 0" @click="clearHistory">
      <span slot="icon" class="material-symbols-rounded">delete</span>
      清空历史记录
    </mdui-fab>
  </page-container>
</template>

<style scoped>
.page-container {
  position: relative;
}

span.out {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 2rem;
  color: rgba(var(--mdui-color-primary));
  font-family: 'Nunito';
}

.pickStatue {
  margin-left: 1.5rem;

  mdui-list-item {
    color: rgba(var(--mdui-color-secondary), 0.7);
  }
}

.timestamp {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: rgba(var(--mdui-color-secondary), 0.7);
}

#delHistoryBtn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;

  background-color: rgb(var(--mdui-color-secondary-container));

  transition: all 0.2s ease-in-out;
}
</style>