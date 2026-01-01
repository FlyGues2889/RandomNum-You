<script setup>
import 'material-symbols';
import { ref, watch, onMounted } from 'vue';
import Picker from '../../js/Picker.js';
import HistoryService from '../../js/HistoryService.js';
import { snackbar } from 'mdui/functions/snackbar.js';
import ClipboardJS from 'clipboard';

import 'mdui/mdui.css';

onMounted(() => {
  new ClipboardJS('#copyOut', {
    text: function (trigger) {
      const outText = document.getElementById('out').innerText;
      snackbar({ message: "结果已复制" });
      return outText;
    }
  });
});

const lastNumber = localStorage.getItem('lastRandomNumber');
const outNum = ref(lastNumber ? parseInt(lastNumber) : "-");
const isPicking = ref(false);
const picker = new Picker();

const minNum = ref(1);
const maxNum = ref(55);
const isRepeat = ref(false);
const excludeNumbers = ref('');
const excludeLabels = ref([]);
const selectedLabel = ref('null');

function updatePickerParams() {
  const exNumArr = excludeNumbers.value
    .split(',')
    .map(num => num.trim())
    .filter(num => !isNaN(num) && num !== '');

  picker.setParams({
    minNum: Number(minNum.value),
    maxNum: Number(maxNum.value),
    isRepeat: isRepeat.value,
    exNumArr: exNumArr
  });

  picker.clearExcludeNums();
  if (exNumArr.length > 0) {
    picker.addExcludeNum(exNumArr);
  }
}

updatePickerParams();

watch([minNum, maxNum, isRepeat, excludeNumbers], () => {
  if (!isPicking.value) {
    updatePickerParams();
  }
});

if (lastNumber && (isNaN(lastNumber) || lastNumber < 1 || lastNumber > 999999)) {
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
  updatePickerParams();
  
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
  dialog.open = true;
  
  const savedLabels = JSON.parse(localStorage.getItem('excludeLabels') || '[]');
  excludeLabels.value = savedLabels;
}

function closeSettingsDialog() {
  const dialog = document.querySelector('#numsettings-dialog');
  dialog.open = false;
  
  updatePickerParams();
  
  // snackbar({ message: "设置已保存" });
}

function saveExcludeLabel() {
  const labelName = document.getElementById('exLabel-name').value?.trim();
  const labelContent = document.getElementById('exLabel-content').value?.trim();
  
  if (!labelName || !labelContent) {
    snackbar({ message: "标签名称和内容不能为空" });
    return;
  }
  
  const newLabel = {
    name: labelName,
    content: labelContent,
    id: Date.now().toString()
  };
  
  excludeLabels.value.push(newLabel);
  
  localStorage.setItem('excludeLabels', JSON.stringify(excludeLabels.value));
  
  document.getElementById('exLabel-name').value = '';
  document.getElementById('exLabel-content').value = '';
  
  snackbar({ message: "排除标签已保存" });
}

function onLabelChange() {
  if (selectedLabel.value !== 'null') {
    const label = excludeLabels.value.find(l => l.id === selectedLabel.value);
    if (label) {
      excludeNumbers.value = label.content;
    }
  } else {
    excludeNumbers.value = '';
  }
}
</script>

<template>
  <page-container class="page-container">
    <content-container>
      <mdui-button id="openNumSettings" variant="outlined" @click="showNumSettingsDialog()">
        <span class="material-symbols-rounded" slot="icon">instant_mix</span>
        抽取设置
      </mdui-button>

      <mdui-tooltip content="复制抽取结果">
        <mdui-button-icon id="copyOut">
          <span class="material-symbols-rounded">content_copy</span>
        </mdui-button-icon>
      </mdui-tooltip>

      <mdui-tooltip content="开始 / 结束 抽取">
        <mdui-fab id="pickBtn" class="mdui-fab" size="large" @click="generateNum">
          <span slot="icon" class="material-symbols-rounded">{{ isPicking ? 'stop' : 'touch_app' }}</span>
        </mdui-fab>
      </mdui-tooltip>

      <div id="out" slot="trigger" v-text="outNum"></div>
    </content-container>

    <mdui-dialog 
      close-on-overlay-click 
      headline="抽取设置" 
      id="numsettings-dialog"
      @close="closeSettingsDialog"
    >
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
            <mdui-text-field 
              variant="outlined" 
              required 
              class="number-range" 
              label="最小值"
              v-model.lazy="minNum"
              type="number"
              min="1"
              max="999999"
            ></mdui-text-field>
            <b>&nbsp;&nbsp;-&nbsp;&nbsp;</b>
            <mdui-text-field 
              variant="outlined" 
              required 
              class="number-range" 
              label="最大值"
              v-model.lazy="maxNum"
              type="number"
              min="1"
              max="999999"
            ></mdui-text-field>
          </div>

          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">repeat</span>
            允许重复抽取
            <mdui-switch 
              slot="end-icon" 
              v-model="isRepeat"
            ></mdui-switch>
          </mdui-list-item>
        </mdui-tab-panel>

        <mdui-tab-panel slot="panel" value="tab-2">
          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">label</span>
            选择已保存的标签
            <mdui-select 
              slot="end-icon" 
              v-model="selectedLabel" 
              variant="outlined"
              @change="onLabelChange"
            >
              <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
              <mdui-menu-item value="null">无</mdui-menu-item>
              <mdui-menu-item 
                v-for="label in excludeLabels" 
                :key="label.id" 
                :value="label.id"
              >
                {{ label.name }}
              </mdui-menu-item>
            </mdui-select>
          </mdui-list-item>

          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">block</span>
            排除数字(逗号分隔)
            <mdui-text-field 
              slot="end-icon" 
              variant="outlined" 
              v-model="excludeNumbers"
              placeholder="例如：1,5,8,10"
            ></mdui-text-field>
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
                <mdui-text-field 
                  slot="end-icon" 
                  variant="outlined" 
                  id="exLabel-name"
                  placeholder="例如：已中奖号码"
                ></mdui-text-field>
              </mdui-list-item>
              
              <mdui-list-item nonclickable>
                排除项内容
                <mdui-text-field 
                  slot="end-icon" 
                  variant="outlined" 
                  id="exLabel-content"
                  placeholder="例如：1,5,8,10"
                ></mdui-text-field>
              </mdui-list-item>
              
              <div style="display: flex;justify-content: end;margin-top: 1rem;">
                <mdui-button 
                  id="create-exclude-label" 
                  variant="outlined" 
                  style="margin-right: 1.5rem;"
                  @click="saveExcludeLabel"
                >
                  <span slot="icon" class="material-symbols-rounded">new_label</span>
                  将新建内容保存为新标签
                </mdui-button>
              </div>
            </mdui-collapse-item>
          </mdui-collapse>
        </mdui-tab-panel>
      </mdui-tabs>

      <mdui-button class="close-dialog" slot="action" variant="tonal" @click="closeSettingsDialog">
        <span class="material-symbols-rounded">done</span>
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
  color: rgb(var(--mdui-color-secondary));
  transition: all 0.2s ease-in-out;

  span {
    font-size: 2.25rem;
  }
}

#openNumSettings {
  position: absolute;
  bottom: 3.2rem;
  left: 3.2rem;
}

#copyOut {
  position: absolute;
  bottom: 3.2rem;
  left: 12rem;
  color: rgb(var(--mdui-color-secondary));
}

mdui-tab-panel {
  width: calc(54vw - 1rem);
  min-height: calc(12rem);
  max-height: calc(50vh - 1rem);
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