<script setup>
import 'material-symbols';
import { ref, onMounted } from 'vue';
import theme from '../../js/theme.js';
import 'mdui/mdui.css';

const themeColor = ref('#6750a4');
const customLight = ref(null);
// appliedMode: the theme mode already applied to the app
const appliedMode = ref('auto');
// uiSelectedMode: the value bound to the segmented button group's value (controls check animation)
const uiSelectedMode = ref('auto');
// track last clicked value to enable "second click shows check" behavior
const lastClicked = ref(null);

function setColorTheme(color) {
  themeColor.value = color;
  theme.setColor(color);
  document.body.style.backgroundColor = 'rgba(var(--mdui-color-surface-container))';
}

function resetTheme() {
  theme.setMode('auto');
  theme.setColor('#6750a4');

  themeColor.value = '#6750a4';
  themeMode.value = 'auto';
  customLight.value = null;
}

function onCustomLightChange(e) {
  const val = e.target.value;
  customLight.value = val;
  theme.setCustomLight(val);
  theme.setColor(val);
  themeColor.value = val;
}

function setThemeMode(mode) {
  // apply immediately
  theme.setMode(mode);
  appliedMode.value = mode;

  // if user clicked same button twice in a row and ui has not shown selection yet,
  // then update uiSelectedMode to show the check animation on second click
  if (lastClicked.value === mode && uiSelectedMode.value !== mode) {
    uiSelectedMode.value = mode;
  }

  // update lastClicked every time
  lastClicked.value = mode;
}

onMounted(() => {
  const s = theme.init();
  themeColor.value = s.color || '#6750a4';
  customLight.value = s.custom || null;
  appliedMode.value = s.mode || 'auto';
  uiSelectedMode.value = s.mode || 'auto';
});
</script>

<template>
  <page-container>
    <content-container>
      <Title title="设置" />
      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>个性化</mdui-list-subheader>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">palette</span>
          主题
          <span slot="description">切换应用程序光照模式和主题色</span>

          <mdui-button slot="end-icon" v-show="themeColor !== '#6750a4'" class="theme-button" id="defaultTheme"
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

            <mdui-button variant="tonal" style="" @click="document.querySelector('#customLight').click();">
              <span class="material-symbols-rounded">colorize</span>
            </mdui-button>
            <input type="color" id="customLight" :value="customLight || '#000000'"
              style="width:0;height:0;opacity:0;pointer-events:none;border:none;padding:0;margin:0;"
              @change="onCustomLightChange">

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
      </list-container>

      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>关于</mdui-list-subheader>
        </template>
        <mdui-list-item rounded nonclickable>
          <span slot="icon" class="material-symbols-rounded">info</span>
          关于 RandomNum You
          <span slot="description">Version 2.0.0</span>
        </mdui-list-item>
        <div style="margin-left: 2.5rem;" class="mdui-prose">
          <mdui-list-item nonclickable>
            <mdui-list-item rounded>
              使用开源项目
              <span slot="description">Tauri - MDUI - Material Symbols</span>
            </mdui-list-item>
            <mdui-list-item rounded>
              项目存储库
              <span slot="description">https://github.com/FlyGues2889/random-number</span>
            </mdui-list-item>
            <mdui-list-item rounded>
              许可证
              <span slot="description">MIT</span>
            </mdui-list-item>
          </mdui-list-item>
        </div>
        <mdui-list-item rounded nonclickable>
          项目作者
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