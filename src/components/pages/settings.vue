<script setup>
import 'material-symbols';
import { ref } from 'vue';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
import { setTheme } from 'mdui/functions/setTheme.js';

const themeColor = ref("#6750a4")
function setColorTheme(color) {
  themeColor.value = color;
  setColorScheme(color);

  document.body.style.backgroundColor = 'rgba(var(--mdui-color-surface-container))';
}
function resetTheme() {
  setTheme('auto');
  setColorScheme('#6750a4');
}
import 'mdui/mdui.css';
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

          <mdui-button slot="end-icon" v-show="themeColor !== '#006750a4'" class="theme-button" id="defaultTheme"
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

            <mdui-button variant="tonal" style="" onclick="document.querySelector('#customLight').click();">
              <span class="material-symbols-rounded">colorize</span>
            </mdui-button>
            <input type="color" id="customLight" x-bind:value="customLight || '#000000'"
              style="width:0;height:0;opacity:0;pointer-events:none;border:none;padding:0;margin:0;"
              onchange="theme.setCustomLight(this.value);">

            <mdui-segmented-button-group slot="end-icon" style="width: 16rem" selects="single" value="auto"
              id="theme-toggle">
              <mdui-segmented-button class="leftBtn" value="auto" @click="setTheme('auto');">
                <span class="material-symbols-rounded" style="transform: scale(0.7);">brightness_auto</span>
              </mdui-segmented-button>
              <mdui-segmented-button value="auto" @click="setTheme('light');">
                <span class="material-symbols-rounded" style="transform: scale(0.7);">wb_sunny</span>
              </mdui-segmented-button>
              <mdui-segmented-button class="rightBtn" value="auto" @click="setTheme('dark');">
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
            <g id="组_18" data-name="组 18" transform="translate(-2844 -168)">
              <g id="组_16" data-name="组 16" transform="translate(2844 195)">
                <rect id="矩形_7" data-name="矩形 7" width="400" height="400" fill="none" />
                <g id="组_12" data-name="组 12" transform="translate(-199.587 123.82) rotate(-45)">
                  <path id="矩形_14" data-name="矩形 14"
                    d="M20,0H80a20,20,0,0,1,20,20V30A20,20,0,0,1,80,50H0a0,0,0,0,1,0,0V20A20,20,0,0,1,20,0Z"
                    transform="translate(306 359) rotate(90)" fill="currentColor" />
                  <path id="矩形_15" data-name="矩形 15"
                    d="M20,0h80a0,0,0,0,1,0,0V80a20,20,0,0,1-20,20H72A72,72,0,0,1,0,28V20A20,20,0,0,1,20,0Z"
                    transform="translate(106 359)" fill="currentColor" />
                  <path id="矩形_6" data-name="矩形 6" d="M35.049,0A35,35,0,1,1,0,35.049,34.881,34.881,0,0,1,35.049,0Z"
                    transform="translate(351.366 213.836) rotate(90)" fill="currentColor" />
                  <path id="联合_1_-_轮廓" data-name="联合 1 - 轮廓"
                    d="M-749.007,235.567h-50v-50h-80a20,20,0,0,1-20-20v-10a20,20,0,0,1,20-20h110a20,20,0,0,1,20,20Z"
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