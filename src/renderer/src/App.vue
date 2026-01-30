<template>
  <div class="tintenklecks-app">
    <div class="tintenklecks-app-navigation">
      <AppNavigation />
    </div>
    <div class="tintenklecks-app-frame" :style="{ backgroundImage: texture.paperTexture.value }">
      <router-view />
    </div>
    <AppTitleBar class="tintenklecks-app-title-bar" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { RouteName } from '@renderer/router'
import { useTexture } from '@renderer/composables/useTexture'
import AppTitleBar from './AppTitleBar.vue'
import AppNavigation from './AppNavigation.vue'

const texture = useTexture({
  opacity: 0.15,
  scale: 1.2,
  seed: null
})

const router = useRouter()

onMounted(async () => {
  await router.replace({ name: RouteName.Home })
})
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
    display: flex;
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
