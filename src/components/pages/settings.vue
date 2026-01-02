<script setup>
import 'material-symbols';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import theme from '../../js/theme.js';
import 'mdui/mdui.css';
import { snackbar } from 'mdui';

const { t } = useI18n();

// 背景图片设置
const backgroundImageEnabled = ref(localStorage.getItem('backgroundImageSwitch') === 'true');

const defaultThemeColor = '#3a699c';
const storedTheme = JSON.parse(localStorage.getItem('appTheme')) || {
  color: defaultThemeColor,
  customColor: defaultThemeColor,
  mode: 'auto'
};

const themeColor = ref(storedTheme.color);
const customLight = ref(storedTheme.customColor);
const appliedMode = ref(storedTheme.mode);
const uiSelectedMode = ref(storedTheme.mode);
const lastClicked = ref(null);
const customColorInput = ref(null);
const currentLocale = ref(localStorage.getItem('rny.locale') || 'zh');

function setLocale(locale) {
  currentLocale.value = locale;
  localStorage.setItem('rny.locale', locale);
  window.location.reload(); // 重新加载应用以应用语言更改
}

function saveThemeToLocal() {
  const themeConfig = {
    color: themeColor.value,
    customColor: customLight.value,
    mode: appliedMode.value
  };
  localStorage.setItem('appTheme', JSON.stringify(themeConfig));
}

function setColorTheme(color) {
  themeColor.value = color;
  theme.setColor(color);
  document.body.style.backgroundColor = 'rgba(var(--mdui-color-surface-container))';
  saveThemeToLocal();
}

function resetTheme() {
  theme.setMode('auto');
  theme.setColor(defaultThemeColor);
  
  themeColor.value = defaultThemeColor;
  customLight.value = defaultThemeColor;
  appliedMode.value = 'auto';
  uiSelectedMode.value = 'auto';
  
  saveThemeToLocal();

  snackbar({
    message: t('app.resetTheme'),
    
    timeout: 2000
  });
}

function onCustomLightChange(e) {
  const val = e.target.value;
  customLight.value = val;
  setColorTheme(val);

  snackbar({
    message: t('app.appliedCustomColor'),
    
    timeout: 2000
  });
}

function openColorPicker() {
  if (customColorInput.value) {
    customColorInput.value.click();
  }
}

function setThemeMode(mode) {
  theme.setMode(mode);
  appliedMode.value = mode;
  
  if (lastClicked.value === mode && uiSelectedMode.value !== mode) {
    uiSelectedMode.value = mode;
  }
  
  lastClicked.value = mode;
  saveThemeToLocal();
}

onMounted(() => {
  const s = theme.init();
  themeColor.value = storedTheme.color || s.color || defaultThemeColor;
  customLight.value = storedTheme.customColor || s.custom || s.color || defaultThemeColor;
  appliedMode.value = storedTheme.mode || s.mode || 'auto';
  uiSelectedMode.value = storedTheme.mode || s.mode || 'auto';
  
  theme.setColor(themeColor.value);
  theme.setMode(appliedMode.value);
});
</script>

<template>
  <page-container>
    <content-container>
      <Title :title="t('app.settings')" />

      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>{{ t('app.general') }}</mdui-list-subheader>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">language</span>
          {{ t('app.language') }}
          <mdui-select variant="outlined" slot="end-icon" :value="currentLocale" @change="setLocale($event.target.value)">
            <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
            <mdui-menu-item value="zh">简体中文</mdui-menu-item>
            <mdui-menu-item value="zh-Hant">繁體中文</mdui-menu-item>
            <mdui-menu-item value="en">English</mdui-menu-item>
          </mdui-select>
        </mdui-list-item>
      </list-container>

      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>{{ t('app.personalization') }}</mdui-list-subheader>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">palette</span>
          {{ t('app.theme') }}
          <span slot="description">{{ t('app.themeDescription') }}</span>
          <mdui-button slot="end-icon" v-show="themeColor !== '#3a699c'" class="theme-button" id="defaultTheme"
            variant="outlined" @click="resetTheme()">
            <span class="material-symbols-rounded">reset_settings</span>
          </mdui-button>
        </mdui-list-item>
        <div style="margin-left: 2.5rem;">
          <mdui-list-item nonclickable>
            <mdui-button-icon class="theme-button" id="cyanTheme" style="background-color: #006874;"
              @click="setColorTheme('#006874');"></mdui-button-icon>
            <mdui-button-icon class="theme-button" id="greenTheme" style="background-color: #006e1c;"
              @click="setColorTheme('#006e1c');"></mdui-button-icon>

            <mdui-button variant="tonal" style="" @click="openColorPicker()">
              <span class="material-symbols-rounded">colorize</span>
            </mdui-button>
            
            <input 
              type="color" 
              id="customLight" 
              ref="customColorInput"
              v-model="customLight"
              style="
                position: absolute; 
                width:0; 
                height:0; 
                opacity:0; 
                z-index: -1; 
                pointer-events:none;
              "
              @change="onCustomLightChange"
            >

            <mdui-segmented-button-group slot="end-icon" style="width: 16rem" selects="single" :value="uiSelectedMode"
              id="theme-toggle">
              <mdui-segmented-button class="leftBtn" value="auto" @click="setThemeMode('auto');">
                <span class="material-symbols-rounded" style="transform: scale(0.7);">brightness_auto</span>
              </mdui-segmented-button>
              <mdui-segmented-button value="light" @click="setThemeMode('light');">
                <span class="material-symbols-rounded" style="transform: scale(0.7);">wb_sunny</span>
              </mdui-segmented-button>
              <mdui-segmented-button class="rightBtn" value="dark" @click="setThemeMode('dark');">
                <span class="material-symbols-rounded" style="transform: scale(0.7);">brightness_2</span>
              </mdui-segmented-button>
            </mdui-segmented-button-group>
          </mdui-list-item>
        </div>

        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">image</span>
          {{ t('app.backgroundImage') }}
          <span slot="description">{{ t('app.backgroundImageDescription') }}</span>
          <mdui-button slot="end-icon" variant="text" @click="theme.backgroundImageChoose()">
            {{ t('app.selectImage') }}
          </mdui-button>
          <mdui-switch 
            slot="end-icon" 
            id="backgroundImage" 
            v-model="backgroundImageEnabled"
            @change="theme.backgroundImageSwitchChange()"
          />
        </mdui-list-item>
      </list-container>



      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>{{ t('app.about') }}</mdui-list-subheader>
        </template>
        <mdui-list-item rounded nonclickable>
          <span slot="icon" class="material-symbols-rounded">info</span>
          {{ t('app.about') }} RandomNum You
          <span slot="description">{{ t('app.aboutDescription', { version: '2.0.0' }) }}</span>
        </mdui-list-item>
        <div style="margin-left: 2.5rem;" class="mdui-prose">
          <mdui-list-item nonclickable>
            <mdui-list-item rounded>
              {{ t('app.openSource') }}
              <span slot="description">{{ t('app.openSourceDescription') }}</span>
            </mdui-list-item>
            <mdui-list-item rounded>
              {{ t('app.repository') }}
              <span slot="description">https://github.com/FlyGues2889/random-number</span>
            </mdui-list-item>
            <mdui-list-item rounded>
              {{ t('app.license') }}
              <span slot="description">MIT</span>
            </mdui-list-item>
          </mdui-list-item>
        </div>
        <mdui-list-item rounded nonclickable>
          {{ t('app.author') }}
          <svg slot="icon" xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 400 400"
            style="margin-left: -0.1rem;">
            <g transform="translate(-2844 -168)">
              <g transform="translate(2844 195)">
                <rect width="400" height="400" fill="none" />
                <g transform="translate(-199.587 123.82) rotate(-45)">
                  <path d="M20,0H80a20,20,0,0,1,20,20V30A20,20,0,0,1,80,50H0a0,0,0,0,1,0,0V20A20,20,0,0,1,20,0Z"
                    transform="translate(306 359) rotate(90)" fill="currentColor" />
                  <path d="M20,0h80a0,0,0,0,1,0,0V80a20,20,0,0,1-20,20H72A72,72,0,0,1,0,28V20A20,20,0,0,1,20,0Z"
                    transform="translate(106 359)" fill="currentColor" />
                  <path d="M35.049,0A35,35,0,1,1,0,35.049,34.881,34.881,0,0,1,35.049,0Z"
                    transform="translate(351.366 213.836) rotate(90)" fill="currentColor" />
                  <path d="M-749.007,235.567h-50v-50h-80a20,20,0,0,1-20-20v-10a20,20,0,0,1,20-20h110a20,20,0,0,1,20,20Z"
                    transform="translate(1005.007 123.433)" fill="currentColor" />
                </g>
              </g>
            </g>
          </svg>
          <span slot="description">By FlyGues Studio</span>
        </mdui-list-item>

        <div style="margin-left: 2.5rem;" class="mdui-prose">
          <mdui-list-item rounded href="https://github.com/FlyGues2889" target="_blank">
            FlyGues2889
            <mdui-avatar src="http://q1.qlogo.cn/g?b=qq&nk=2037432889&s=100" slot="icon"></mdui-avatar>
            <span slot="description">https://github.com/FlyGues2889</span>
          </mdui-list-item>
          <mdui-list-item rounded href="https://github.com/Echoes678" target="_blank">
            Echoes678
            <mdui-avatar src="http://q1.qlogo.cn/g?b=qq&nk=2040244628&s=100" slot="icon"></mdui-avatar>
            <span slot="description">https://github.com/Echoes678</span>
          </mdui-list-item>
        </div>
      </list-container>
    </content-container>
  </page-container>
</template>
<style scoped>
mdui-list-subheader {
  margin-left: 0.1rem;
  height: 1.25rem;
  font-size: 1rem;
  color: rgb(var(--mdui-color-secondary));
  line-height: unset;
}

.theme-button {
  margin-right: 0.2rem;
}
</style>