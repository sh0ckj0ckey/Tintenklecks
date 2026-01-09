<template>
  <div class="tintenklecks-app">
    <div class="tintenklecks-app-navigation"></div>
    <div class="tintenklecks-app-frame"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.tintenklecks-app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .tintenklecks-app-navigation {
    flex: none;
    overflow: hidden;
    width: 280px;
    height: 100%;
    background-color: var(--tk-app-background);
    z-index: 1;
  }

  .tintenklecks-app-frame {
    flex: auto;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: var(--tk-app-background-deep);
    z-index: 2;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  }
}
</style>
