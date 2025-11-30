<script setup>
import 'material-symbols';
import { ref } from 'vue';

import 'mdui/mdui.css';
</script>

<template>
  <page-container>
    <content-container>
      <Title title="设置" />
      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>抽取设置</mdui-list-subheader>
        </template>
        <mdui-list-item nonclickable>
          <div class="number-range">
            <mdui-text-field class="number-range" label="最小值" v-model="min"></mdui-text-field>
            <b>&nbsp;&nbsp;-&nbsp;&nbsp;</b>
            <mdui-text-field class="number-range" label="最大值" v-model="max"></mdui-text-field>
          </div>
        </mdui-list-item>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">block</span>
          排除数字范围
          <span slot="description">抽取过程中要排除的数字</span>

          <mdui-button slot="end-icon" variant="tonal">
            <span class="material-symbols-rounded">open_in_new</span>
          </mdui-button>
        </mdui-list-item>
        <mdui-list-item nonclickable style="text-align: left;">
          <span slot="icon" class="material-symbols-rounded">access_time</span>
          时间延迟
          <mdui-select slot="end-icon" variant="outlined" id="settime">
            <span slot="end-icon" class="material-symbols-rounded">keyboard_arrow_down</span>
            <mdui-menu-item value="500">0.50s</mdui-menu-item>
            <mdui-menu-item value="750">0.75s</mdui-menu-item>
            <mdui-menu-item value="1000">1s</mdui-menu-item>
            <mdui-menu-item value="1500">1.50s</mdui-menu-item>
            <mdui-menu-item value="2000">2s</mdui-menu-item>
            <mdui-menu-item value="5000">5s</mdui-menu-item>
          </mdui-select>

        </mdui-list-item>

        <mdui-list-item nonclickable style="text-align: left;padding: 0;">
          <span slot="icon" class="material-symbols-rounded">back_hand</span>
          启用手动抽取
          <span slot="description">手动点击抽取按钮/回车/空格键以启停</span>
          <mdui-switch slot="end-icon">
          </mdui-switch>
        </mdui-list-item>

        <mdui-list-item nonclickable style="text-align: left;">
          <span slot="icon" class="material-symbols-rounded">repeat</span>
          周期内不重复
          <label for="repeat"></label>
          <mdui-switch slot="end-icon">
          </mdui-switch>
        </mdui-list-item>
      </list-container>
      <list-container>
        <template v-slot:title>
          <mdui-list-subheader>个性化</mdui-list-subheader>
        </template>
        <mdui-list-item nonclickable>
          <span slot="icon" class="material-symbols-rounded">palette</span>
          主题
          <span slot="description">切换应用程序光照模式和主题色</span>
          <mdui-segmented-button-group slot="end-icon" style="width: 16rem" selects="single" value="auto"
            x-data="{ theme: localStorage.getItem('theme') || 'light' }" x-model="theme"
            x-init="$watch('theme', value => { theme.setTheme(value); })" :value="theme" id="theme-toggle">
            <mdui-segmented-button class="leftBtn" value="auto" onclick="theme.setTheme('auto');">
              <span class="material-symbols-rounded-fill" style="transform: scale(0.7);">brightness_auto</span>
            </mdui-segmented-button>
            <mdui-segmented-button value="auto" onclick="theme.setTheme('light');">
              <span class="material-symbols-rounded-fill" style="transform: scale(0.7);">wb_sunny</span>
            </mdui-segmented-button>
            <mdui-segmented-button class="rightBtn" value="auto" onclick="theme.setTheme('dark');">
              <span class="material-symbols-rounded-fill" style="transform: scale(0.7);">brightness_2</span>
            </mdui-segmented-button>
          </mdui-segmented-button-group>

        </mdui-list-item>
        <div style="margin-left: 2.5rem;">
          <mdui-list-item nonclickable>
            <mdui-button-icon class="theme-button" id="cyanTheme" style="background-color: #006874;"
              onclick="theme.setLight('cyanTheme');"></mdui-button-icon>
            <mdui-button-icon class="theme-button" id="purpleTheme" style="background-color: #6750a4;"
              onclick="theme.setLight('purpleTheme');"></mdui-button-icon>
            <mdui-button-icon class="theme-button" id="greenTheme" style="background-color: #006e1c;"
              onclick="theme.setLight('greenTheme');"></mdui-button-icon>

            <mdui-button class="theme-button" id="defaultTheme" variant="outlined"
              onclick="theme.setLight('defaultTheme');">
              <span class="material-symbols-rounded">settings_backup_restore</span>
            </mdui-button>
            <mdui-tooltip variant="rich" placement="bottom"
              x-data="{ customLight: localStorage.getItem('customLight') }">
              <mdui-button variant="tonal" style="position: absolute;right: 2rem;"
                onclick="document.querySelector('#customLight').click();">
                <span class="material-symbols-rounded">colorize</span>
              </mdui-button>
              <input type="color" id="customLight" x-bind:value="customLight || '#000000'"
                style="width:0;height:0;opacity:0;pointer-events:none;border:none;padding:0;margin:0;position: absolute;right: 2rem;top: 3rem;"
                onchange="theme.setCustomLight(this.value);">
              <div slot="headline">自定义主题色</div>
              <div slot="content" id="customLightTip" x-text="customLight || '暂无'"
                style="color: rgb(var(--mdui-color-primary));">
              </div>
            </mdui-tooltip>
          </mdui-list-item>
        </div>

      </list-container>
    </content-container>
  </page-container>
</template>

<style scoped>
mdui-segmented-button-group {
  mdui-segmented-button {
    width: 0.4rem;
    margin: 0 0.05rem;

    border-radius: var(--mdui-shape-corner-small);
    color: rgb(var(--mdui-color-primary));
    background-color: rgb(var(--mdui-color-secondary-container));
    border: none;

    transition: all 0.2s;
  }

  mdui-segmented-button.leftBtn {
    border-radius: var(--mdui-shape-corner-extra-large) var(--mdui-shape-corner-small) var(--mdui-shape-corner-small) var(--mdui-shape-corner-extra-large);
  }

  mdui-segmented-button.rightBtn {
    border-radius: var(--mdui-shape-corner-small) var(--mdui-shape-corner-extra-large) var(--mdui-shape-corner-extra-large) var(--mdui-shape-corner-small);
  }

  mdui-segmented-button[selected] {
    width: 1.6rem;
    border-radius: var(--mdui-shape-corner-extra-large);
    color: rgb(var(--mdui-color-surface));
    background-color: rgb(var(--mdui-color-primary));
  }
}

list-container {
  padding-bottom: 5rem;
}

mdui-list-subheader {
  margin-left: 0.1rem;
  height: 1.25rem;

  font-size: 1rem;
  color: rgb(var(--mdui-color-secondary));
  line-height: unset;
}

mdui-select,
mdui-text-field {
  line-height: 1.375rem;
  max-width: 16em;
}

mdui-text-field.shaped::part(container) {
  border-radius: var(--mdui-shape-corner-large);
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

div.number-range {
  margin: 0.5rem 0;

  display: flex;
  justify-content: center;
  align-items: center;
}

b {
  font-size: 2rem;
  font-weight: bold;
  color: rgb(var(--mdui-color-secondary));
}
</style>