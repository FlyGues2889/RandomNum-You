<script setup>
import 'material-symbols';
import { ref, onMounted } from 'vue';
import HistoryService from '../../js/HistoryService.js';
import historyChip from '../history-chip.vue';
import Title from '../title.vue';
import ListContainer from '../list-container.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import 'mdui/mdui.css';
import { snackbar } from 'mdui';

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

  snackbar({
    message: t('history.historyCleared'),
    position: 'bottom-start',
    timeout: 2000
  });
}
</script>

<template>
  <page-container>
    <content-container>
      <Title v-html="t('history.title')" />
      <ListContainer>
        <template v-slot:title>
          <mdui-list-item nonclickable>
            <mdui-button-icon slot="icon" disabled>
              <span class="material-symbols-rounded">arrow_forward</span>
            </mdui-button-icon>
            <span class="out">{{ history.length > 0 ? history[0].number : 'None' }}</span>
          </mdui-list-item>
        </template>
        <mdui-list-item nonclickable style="position: sticky;">
          <span slot="icon" class="material-symbols-rounded">history</span>
          {{ t('history.history') }}
          <span slot="description">{{ t('history.desc') + history.length }}</span>

          <mdui-button variant="outlined" slot="end-icon" id="delHistoryBtn" class="mdui-fab" v-if="history.length > 0" @click="clearHistory">
            <span slot="icon" class="material-symbols-rounded">delete</span>
            {{ t('history.clearHistory') }}
          </mdui-button>
        </mdui-list-item>
        <mdui-list-item nonclickable class="pickStatue" v-if="history.length > 0">
          <mdui-list-item nonclickable v-for="(item, index) in history" :key="index" value="{{ index }}">
            <history-chip slot="icon">{{ item.number }}</history-chip>
            <span slot="end-icon" class="timestamp">{{ item.timestamp }}</span>
          </mdui-list-item>
        </mdui-list-item>
        <mdui-list-item nonclickable class="pickStatue" v-else>
          <p style="text-align: center;color: rgba(var(--mdui-color-secondary),0.7);">{{ t('history.empty') }}</p>
        </mdui-list-item>

      </ListContainer>
    </content-container>
    
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

</style>