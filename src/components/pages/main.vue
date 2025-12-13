<script setup>
import 'material-symbols';
import { ref, onMounted } from 'vue';
import Picker from '../../js/Picker.js';
import HistoryService from '../../js/HistoryService.js';

import 'mdui/mdui.css';

// Load the last displayed number from localStorage, fallback to default
const lastNumber = localStorage.getItem('lastRandomNumber');
const outNum = ref(lastNumber ? parseInt(lastNumber) : 215988);
const isPicking = ref(false);
const picker = new Picker();

// Set default parameters for the picker - allowing repeats to enable multiple picks
picker.setParams({
  minNum: 100000,    // Minimum 6-digit number
  maxNum: 999999,    // Maximum 6-digit number
  pickTime: 2000,    // 2 seconds of animation
  isManned: false,   // Auto-stop after pickTime
  isRepeat: true     // Allow repeating numbers so we can pick multiple times
});

// Ensure the outNum is within the valid range if it was loaded from storage
if (outNum.value < 100000 || outNum.value > 999999) {
  outNum.value = 215988; // Reset to default if out of range
  localStorage.setItem('lastRandomNumber', '215988');
}

function generateNum() {
  if (isPicking.value) {
    // Stop picking and get final result
    stopPicking();
  } else {
    // Start picking with animation
    startPicking();
  }
}

function startPicking() {
  isPicking.value = true;
  picker.startPick((currentValue) => {
    if (currentValue !== null) {
      outNum.value = currentValue;
      // Save the current animated number to localStorage so it persists if user switches pages
      localStorage.setItem('lastRandomNumber', currentValue.toString());
    }
  });

  // Since the picker automatically stops after pickTime in auto mode,
  // we need to set a timeout to update our UI state accordingly
  setTimeout(() => {
    // At this point the picker should have stopped automatically
    // but if the user didn't manually stop it, we need to update the UI
    if (isPicking.value) {
      isPicking.value = false;
    }
  }, picker.pickTime + 50); // Small buffer to ensure picker has stopped
}

function stopPicking() {
  picker.stopPick((result) => {
    if (result !== null) {
      outNum.value = result;
      // Save the number to localStorage
      localStorage.setItem('lastRandomNumber', result.toString());
      // Add the result to history
      HistoryService.addToHistory({
        number: result,
        timestamp: new Date().toLocaleString()
      });
    }
    isPicking.value = false;
  });
}
</script>

<template>
  <page-container class="page-container">
    <content-container>
      <mdui-button id="openNumSettings" variant="outlined">
        <span class="material-symbols-rounded" slot="icon">instant_mix</span>
        抽取设置
      </mdui-button>

      <mdui-fab id="btn" class="mdui-fab" size="large" @click="generateNum">
        <span slot="icon" class="material-symbols-rounded">{{ isPicking ? 'stop' : 'touch_app' }}</span>
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

    </content-container>
  </page-container>
</template>

<style scoped>
.page-container {
  position: relative;
}

.content-container {
  width: calc(100% - 4.5rem);
  max-width: 72rem;

  margin: 0;

  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#out {
  text-align: center;
  font-size: 24vh;
  font-family: 'Nunito';
  color: rgb(var(--mdui-color-secondary));
}

#btn {
  position: absolute;
  bottom: 2rem;
  right: 2rem;

  background-color: rgb(var(--mdui-color-secondary-container));

  transition: all 0.2s ease-in-out;

  span {
    font-size: 2.25rem;
  }
}

#openNumSettings {
  position: absolute;
  bottom: 3.2rem;
  left: 3.2rem;

  transition: all 0.2s ease-in-out;
}
</style>