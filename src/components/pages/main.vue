<script setup>
import 'material-symbols';
import { ref } from 'vue';
import Picker from '../../js/Picker.js';
import HistoryService from '../../js/HistoryService.js';
import { snackbar } from 'mdui/functions/snackbar.js';

import 'mdui/mdui.css';

const lastNumber = localStorage.getItem('lastRandomNumber');
const outNum = ref(lastNumber ? parseInt(lastNumber) : "-");
const isPicking = ref(false);
const picker = new Picker();

picker.setParams({
  minNum: 1,
  maxNum: 999999,
  pickTime: 2000,
  isRepeat: false
});

if (outNum.value < 1 || outNum.value > 999999) {
  outNum.value = "Error";
  snackbar({
    message: "Error: last displayed number is out of range",
    onActionClick: () => console.log("click action button")
  });
  localStorage.setItem('lastRandomNumber', '-');
}

function generateNum() {
  if (isPicking.value) {
    stopPicking();
  } else {
    startPicking();
  }
}

function startPicking() {
  isPicking.value = true;
  picker.startPick((currentValue) => {
    if (currentValue !== null) {
      outNum.value = currentValue;

      localStorage.setItem('lastRandomNumber', currentValue.toString());
    }
  });

}

function stopPicking() {
  picker.stopPick((result) => {
    if (result !== null) {
      outNum.value = result;
      
      localStorage.setItem('lastRandomNumber', result.toString());
      HistoryService.addToHistory({
        number: result,
        timestamp: new Date().toLocaleString()
      });
    }
    isPicking.value = false;
  });
}

function showNumSettingsDialog() {
  const dialog = document.querySelector('#numsettings-dialog');
  const closeBtn = dialog.querySelector('.close-dialog');
  dialog.open = true;
  closeBtn.addEventListener('click', () => {
    dialog.open = false;
  });
}
</script>

<template>
  <page-container class="page-container">
    <content-container>
      <mdui-button id="openNumSettings" variant="outlined" @click="showNumSettingsDialog()">
        <span class="material-symbols-rounded" slot="icon">instant_mix</span>
        抽取设置
      </mdui-button>

      <mdui-fab id="pickBtn" class="mdui-fab" size="large" @click="generateNum">
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

    <mdui-dialog close-on-overlay-click headline="抽取设置" id="numsettings-dialog">
      <span slot="icon" class="material-symbols-rounded">instant_mix</span>
      <mdui-tabs value="tab-1" placement="left-start">
        <mdui-tab value="tab-1">
          <span slot="icon" class="material-symbols-rounded">numbers</span>
          基本
        </mdui-tab>
        <mdui-tab value="tab-2">
          <span slot="icon" class="material-symbols-rounded">block</span>
          排除项
        </mdui-tab>

        <mdui-tab-panel slot="panel" value="tab-1">
          <div class="number-range">
            <mdui-text-field variant="outlined" required class="number-range" label="最小值" v-model="minNum"></mdui-text-field>
            <b>&nbsp;&nbsp;-&nbsp;&nbsp;</b>
            <mdui-text-field variant="outlined" required class="number-range" label="最大值" v-model="maxNum"></mdui-text-field>
          </div>

          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">access_time</span>
            时间延迟
            <mdui-select slot="end-icon" variant="outlined" id="settime" value="2000">
              <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
              <mdui-menu-item value="500">0.50s</mdui-menu-item>
              <mdui-menu-item value="750">0.75s</mdui-menu-item>
              <mdui-menu-item value="1000">1s</mdui-menu-item>
              <mdui-menu-item value="1500">1.50s</mdui-menu-item>
              <mdui-menu-item value="2000">2s</mdui-menu-item>
              <mdui-menu-item value="5000">5s</mdui-menu-item>
            </mdui-select>

          </mdui-list-item>

          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">repeat</span>
            周期内不重复
            <mdui-switch slot="end-icon" value="{{ isRepeat }}">
            </mdui-switch>
          </mdui-list-item>
        </mdui-tab-panel>

        <mdui-tab-panel slot="panel" value="tab-2">
          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">label</span>
            选择已保存的标签
            <mdui-select slot="end-icon" value="null" variant="outlined">
              <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
              <mdui-menu-item value="null">无</mdui-menu-item>
            </mdui-select>
          </mdui-list-item>

          <mdui-collapse accordion>
            <mdui-collapse-item>
              <mdui-list-item slot="header" rounded>
                新建排除项标签
                <span slot="icon" class="material-symbols-rounded">new_label</span>
                <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
              </mdui-list-item>
              <mdui-list-item nonclickable>
                标签名称
                <mdui-text-field slot="end-icon" variant="outlined" id="exLabel-name"></mdui-text-field>
              </mdui-list-item>
              <mdui-list-item nonclickable>
                排除项内容
                <mdui-text-field slot="end-icon" variant="outlined" id="exLabel-content">
                </mdui-text-field>
              </mdui-list-item>
              <div style="display: flex;justify-content: end;margin-top: 1rem;">
                <mdui-button id="create-exclude-label" variant="outlined" style="margin-right: 1.5rem;"
                  onclick="saveExcludeLabel();showSettingsSavedSnackbar()">
                  <span slot="icon" class="material-symbols-rounded">new_label</span>
                  将新建内容保存为新标签
                </mdui-button>
              </div>
            </mdui-collapse-item>
          </mdui-collapse>
        </mdui-tab-panel>
      </mdui-tabs>

      <mdui-button class="close-dialog" slot="action" variant="tonal">
        <span class="material-symbols-rounded" slot="icon">done</span>
        确定
      </mdui-button>
    </mdui-dialog>
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

#pickBtn {
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

mdui-tab-panel {
  width: calc(54vw - 1rem);
  height: calc(50vh - 1rem);

  margin: 0 0.5rem;

  div.number-range {
    width: 100%;

    margin-bottom: 2rem;
    margin-top: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  b {
    font-size: 2rem;
    font-weight: bold;
    color: rgb(var(--mdui-color-secondary));
  }

  mdui-text-field.number-range {
    width: 10rem;
    height: 4.8rem;
  }

  mdui-text-field.number-range::part(input) {
    display: flex;
    justify-content: center;

    font-size: 2rem;
    font-family: 'Nunito';
    font-weight: bold;
    color: rgb(var(--mdui-color-secondary));
  }

  mdui-list-container {
    margin: 2rem 0;
  }

  mdui-select,
  mdui-text-field {
    line-height: 1.375rem;
    max-width: 16em;
  }
}

list-container {
  padding-bottom: 5rem;
}

mdui-collapse {
  margin-top: 1rem;
}
</style>