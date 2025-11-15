<script setup>
import 'material-symbols';
import { ref } from 'vue';

import 'mdui/mdui.css';
</script>

<template>
  <div class="page-container">
    <div class="content-container">
      <h1>历史记录</h1>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .content-container {
    width: calc(100% - 4.5rem);
    max-width: 72rem;
    min-height: calc(100% - 2rem);

    margin: 1rem 2.25rem;
  }
}
</style>