<script setup>
import 'material-symbols';
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Picker from '../../js/Picker.js';
import HistoryService from '../../js/HistoryService.js';
import { snackbar } from 'mdui/functions/snackbar.js';
import ClipboardJS from 'clipboard';
import 'mdui/mdui.css';

const { t } = useI18n();

// 默认配置
const defaultConfig = {
  minNum: 1,
  maxNum: 55,
  isRepeat: false,
  excludeNumbers: '',
  excludeLabels: [],
  lastRandomNumber: '-'
};

// 读取本地存储配置
const storedConfig = JSON.parse(localStorage.getItem('pickerConfig') || JSON.stringify(defaultConfig));

// 响应式变量初始化（基础默认值）
const outNum = ref('-');
const isPicking = ref(false);
const picker = new Picker();
const minNum = ref(storedConfig.minNum || defaultConfig.minNum);
const maxNum = ref(storedConfig.maxNum || defaultConfig.maxNum);
const isRepeat = ref(storedConfig.isRepeat || defaultConfig.isRepeat);
const excludeNumbers = ref(storedConfig.excludeNumbers || defaultConfig.excludeNumbers);
const excludeLabels = ref(storedConfig.excludeLabels || defaultConfig.excludeLabels);
const selectedLabel = ref('null');

// 保存配置到本地存储
function saveConfigToLocal() {
  const config = {
    minNum: minNum.value,
    maxNum: maxNum.value,
    isRepeat: isRepeat.value,
    excludeNumbers: excludeNumbers.value,
    excludeLabels: excludeLabels.value,
    lastRandomNumber: outNum.value
  };
  localStorage.setItem('pickerConfig', JSON.stringify(config));
}

// 更新Picker参数
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

// 监听设置变更，实时保存
watch([minNum, maxNum, isRepeat, excludeNumbers], () => {
  if (!isPicking.value) {
    updatePickerParams();
    saveConfigToLocal();
  }
});

// 生成随机数（开始/停止）
function generateNum() {
  if (isPicking.value) {
    stopPicking();
  } else {
    startPicking();
  }
}

// 开始抽取
function startPicking() {
  updatePickerParams();
  
  isPicking.value = true;
  picker.startPick((currentValue) => {
    if (currentValue !== null) {
      outNum.value = currentValue;
      saveConfigToLocal();
    }
  });
}

// 停止抽取
function stopPicking() {
  picker.stopPick((result) => {
    if (result !== null) {
      outNum.value = result;
      HistoryService.addToHistory({
        number: result,
        timestamp: new Date().toLocaleString()
      });
      saveConfigToLocal();
    }
    isPicking.value = false;
  });
}

// 打开设置弹窗
function showNumSettingsDialog() {
  const dialog = document.querySelector('#numsettings-dialog');
  dialog.open = true;
  excludeLabels.value = storedConfig.excludeLabels || [];
}

// 关闭设置弹窗
function closeSettingsDialog() {
  const dialog = document.querySelector('#numsettings-dialog');
  dialog.open = false;
  
  updatePickerParams();
  saveConfigToLocal();
}

// 保存排除标签
function saveExcludeLabel() {
  const labelName = document.getElementById('exLabel-name').value?.trim();
  const labelContent = document.getElementById('exLabel-content').value?.trim();
  
  if (!labelName || !labelContent) {
    snackbar({ message: t('main.labelNameContentRequired') });
    return;
  }
  
  const newLabel = {
    name: labelName,
    content: labelContent,
    id: Date.now().toString()
  };
  
  excludeLabels.value.push(newLabel);
  saveConfigToLocal();
  
  document.getElementById('exLabel-name').value = '';
  document.getElementById('exLabel-content').value = '';
  
  snackbar({ message: t('main.excludeLabelSaved') });
}

// 切换排除标签
function onLabelChange() {
  if (selectedLabel.value !== 'null') {
    const label = excludeLabels.value.find(l => l.id === selectedLabel.value);
    if (label) {
      excludeNumbers.value = label.content;
    }
  } else {
    excludeNumbers.value = '';
  }
  saveConfigToLocal();
}

// 挂载初始化
onMounted(() => {
  // 初始化剪贴板
  new ClipboardJS('#copyOut', {
    text: function (trigger) {
      const outText = document.getElementById('out').innerText;
      snackbar({ message: t('main.resultCopied') });
      return outText;
    }
  });

  // 初始化最后抽取数字（修复语法错误核心）
  const storedLastNum = storedConfig.lastRandomNumber;
  if (storedLastNum !== '-') {
    const num = Number(storedLastNum);
    outNum.value = isNaN(num) ? '-' : num;
  }

  // 数值范围校验（仅非默认值时校验）
  if (outNum.value !== '-' && (outNum.value < 1 || outNum.value > 999999)) {
    outNum.value = "Error";
    snackbar({
      message: t('main.numberOutOfRange'),
      onActionClick: () => console.log("click action button")
    });
    saveConfigToLocal();
  }

  // 初始化Picker参数
  updatePickerParams();
});
</script>

<template>
  <page-container class="page-container">
    <content-container>
      <mdui-button id="openNumSettings" variant="outlined" @click="showNumSettingsDialog()">
        <span class="material-symbols-rounded" slot="icon">instant_mix</span>
        {{ t('main.pickSettings') }}
      </mdui-button>

      <mdui-tooltip :content="t('main.copyResult')">
        <mdui-button-icon id="copyOut">
          <span class="material-symbols-rounded">content_copy</span>
        </mdui-button-icon>
      </mdui-tooltip>

      <mdui-tooltip :content="t('main.startStopPick')">
        <mdui-fab id="pickBtn" class="mdui-fab" size="large" @click="generateNum">
          <span slot="icon" class="material-symbols-rounded">{{ isPicking ? 'stop' : 'touch_app' }}</span>
        </mdui-fab>
      </mdui-tooltip>

      <div id="out" slot="trigger" v-text="outNum"></div>
    </content-container>

    <mdui-dialog 
      close-on-overlay-click 
      :headline="t('main.pickSettings')" 
      id="numsettings-dialog"
      @close="closeSettingsDialog"
    >
      <span slot="icon" class="material-symbols-rounded">instant_mix</span>
      <mdui-tabs value="tab-1" placement="left-start">
        <mdui-tab value="tab-1">
          <span slot="icon" class="material-symbols-rounded">numbers</span>
          {{ t('main.basic') }}
        </mdui-tab>
        <mdui-tab value="tab-2">
          <span slot="icon" class="material-symbols-rounded">block</span>
          {{ t('main.exclusions') }}
        </mdui-tab>

        <mdui-tab-panel slot="panel" value="tab-1">
          <div class="number-range">
            <mdui-text-field 
              variant="outlined" 
              required 
              class="number-range" 
              :label="t('main.minValue')"
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
              :label="t('main.maxValue')"
              v-model.lazy="maxNum"
              type="number"
              min="1"
              max="999999"
            ></mdui-text-field>
          </div>

          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">repeat</span>
            {{ t('main.allowRepeat') }}
            <mdui-switch 
              slot="end-icon" 
              v-model="isRepeat"
            ></mdui-switch>
          </mdui-list-item>
        </mdui-tab-panel>

        <mdui-tab-panel slot="panel" value="tab-2">
          <mdui-list-item nonclickable>
            <span slot="icon" class="material-symbols-rounded">label</span>
            {{ t('main.selectSavedLabel') }}
            <mdui-select 
              slot="end-icon" 
              v-model="selectedLabel" 
              variant="outlined"
              @change="onLabelChange"
            >
              <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
              <mdui-menu-item value="null">{{ t('main.none') }}</mdui-menu-item>
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
            {{ t('main.excludeNumbers') }}
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
                {{ t('main.newExcludeLabel') }}
                <span slot="icon" class="material-symbols-rounded">new_label</span>
                <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
              </mdui-list-item>
              
              <mdui-list-item nonclickable>
                {{ t('main.labelName') }}
                <mdui-text-field 
                  slot="end-icon" 
                  variant="outlined" 
                  id="exLabel-name"
                  placeholder="例如：已中奖号码"
                ></mdui-text-field>
              </mdui-list-item>
              
              <mdui-list-item nonclickable>
                {{ t('main.excludeContent') }}
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
                  {{ t('main.saveAsNewLabel') }}
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