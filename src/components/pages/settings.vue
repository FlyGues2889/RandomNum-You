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
            <mdui-icon slot="checked-icon" name=""></mdui-icon>
          </mdui-switch>
        </mdui-list-item>

        <mdui-list-item nonclickable style="text-align: left;">
          <span slot="icon" class="material-symbols-rounded">repeat</span>
          周期内不重复
          <label for="repeat"></label>
          <mdui-switch slot="end-icon">
            <mdui-icon slot="checked-icon" name=""></mdui-icon>
          </mdui-switch>
        </mdui-list-item>

      </list-container>
    </content-container>
  </page-container>
</template>

<style scoped>
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