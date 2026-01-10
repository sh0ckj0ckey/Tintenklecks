<template>
  <header class="app-title-bar">
    <div class="app-title-bar-drag-region" @dblclick="toggleMaximizeAppWindow">
      <span>Tintenklecks Gallery</span>
    </div>

    <div class="app-title-bar-caption-buttons">
      <button class="app-title-bar-caption-button" @click="minimizeAppWindow">
        <IconWindowMinimize class="app-title-bar-caption-button-icon" />
      </button>

      <button class="app-title-bar-caption-button" @click="toggleMaximizeAppWindow">
        <IconWindowMaximize v-if="!isAppWindowMaximized" class="app-title-bar-caption-button-icon" />
        <IconWindowRestore v-else class="app-title-bar-caption-button-icon" />
      </button>

      <button class="app-title-bar-caption-button close" @click="closeAppWindow">
        <IconWindowClose class="app-title-bar-caption-button-icon" />
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import IconWindowClose from '@renderer/components/TkIcons/IconWindowClose.vue'
import IconWindowMaximize from '@renderer/components/TkIcons/IconWindowMaximize.vue'
import IconWindowMinimize from '@renderer/components/TkIcons/IconWindowMinimize.vue'
import IconWindowRestore from '@renderer/components/TkIcons/IconWindowRestore.vue'

const isAppWindowMaximized = ref<boolean>(false)

let cleanupListener: (() => void) | undefined

onMounted(() => {
  cleanupListener = window.appWindowAPI.onWindowStateChange((state) => {
    isAppWindowMaximized.value = state === 'maximized'
  })
})

onBeforeUnmount(() => {
  if (cleanupListener) {
    cleanupListener()
  }
})

const minimizeAppWindow = (): void => {
  window.appWindowAPI.minimize()
}

const toggleMaximizeAppWindow = (): void => {
  window.appWindowAPI.maximize()
}

const closeAppWindow = (): void => {
  window.appWindowAPI.close()
}
</script>

<style scoped>
.app-title-bar {
  flex: none;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .app-title-bar-drag-region {
    flex: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 16px;
    font-size: 14px;
    font-weight: 400;
    -webkit-app-region: drag;
  }

  .app-title-bar-caption-buttons {
    flex: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    -webkit-app-region: no-drag;

    .app-title-bar-caption-button {
      width: 48px;
      height: 100%;
      border: none;
      background-color: transparent;
      color: var(--tk-color-foreground);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: default;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--tk-color-background);
      }

      &.close {
        &:hover {
          background-color: #e81123;
          color: white;
        }
      }

      .app-title-bar-caption-button-icon {
        width: 10px;
        height: 10px;
        object-fit: contain;
      }
    }
  }
}
</style>
