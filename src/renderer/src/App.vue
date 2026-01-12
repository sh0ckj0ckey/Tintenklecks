<template>
  <div class="tintenklecks-app">
    <div class="tintenklecks-app-navigation"></div>
    <div class="tintenklecks-app-frame">
      <router-view />
    </div>
    <AppTitleBar class="tintenklecks-app-title-bar" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteName } from '@renderer/router'
import AppTitleBar from './AppTitleBar.vue'

const router = useRouter()

router.push({ name: RouteName.Toast })
</script>

<style scoped>
.tintenklecks-app {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .tintenklecks-app-navigation {
    flex: none;
    overflow: hidden;
    width: 232px;
    height: 100%;
    padding-top: var(--tk-title-bar-height);
    box-sizing: border-box;
    background-color: var(--tk-color-background);
    z-index: 1;
  }

  .tintenklecks-app-frame {
    flex: auto;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding-top: var(--tk-title-bar-height);
    box-sizing: border-box;
    background-color: var(--tk-color-background-deep);
    z-index: 2;
    box-shadow: -4px 0 16px 2px rgba(0, 0, 0, 0.1);
  }

  .tintenklecks-app-title-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--tk-title-bar-height);
    z-index: var(--tk-z-app-title-bar);
  }
}
</style>
