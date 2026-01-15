<template>
  <header :class="['app-title-bar', { 'app-title-bar-blurred': !isAppWindowFocused }]">
    <div class="app-title-bar-navigation-buttons">
      <TkHyperlinkButton v-if="canGoBack" :emboss="false" class="app-title-bar-navigation-button" @click="tryGoBack">
        <IconWindowBack class="app-title-bar-navigation-button-icon" />
      </TkHyperlinkButton>
    </div>

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
import { useBackNavigation } from '@renderer/composables/useBackNavigation'
import TkHyperlinkButton from './components/TkButtons/TkHyperlinkButton.vue'
import IconWindowClose from '@renderer/components/TkIcons/IconWindowClose.vue'
import IconWindowMaximize from '@renderer/components/TkIcons/IconWindowMaximize.vue'
import IconWindowMinimize from '@renderer/components/TkIcons/IconWindowMinimize.vue'
import IconWindowRestore from '@renderer/components/TkIcons/IconWindowRestore.vue'
import IconWindowBack from '@renderer/components/TkIcons/IconWindowBack.vue'

const { canGoBack, tryGoBack } = useBackNavigation()

const isAppWindowMaximized = ref<boolean>(false)
const isAppWindowFocused = ref<boolean>(true)

let cleanupWindowStateListener: (() => void) | null = null
let cleanupWindowFocusListener: (() => void) | null = null

onMounted(() => {
  cleanupWindowStateListener = window.appWindowAPI.onWindowStateChange((state) => {
    isAppWindowMaximized.value = state === 'maximized'
  })
  cleanupWindowFocusListener = window.appWindowAPI.onWindowFocusChange((isFocused) => {
    isAppWindowFocused.value = isFocused
  })
})

onBeforeUnmount(() => {
  cleanupWindowStateListener?.()
  cleanupWindowFocusListener?.()
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
  opacity: 1;

  &.app-title-bar-blurred {
    opacity: 0.7;
  }

  .app-title-bar-navigation-buttons {
    flex: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    -webkit-app-region: no-drag;

    .app-title-bar-navigation-button {
      height: calc(100% - 10px);
      aspect-ratio: 1 / 1;
      margin-left: 5px;
      border: none;
      border-radius: 4px;
      background-color: transparent;
      color: var(--tk-color-foreground);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: default;
      transition:
        background-color 0.2s,
        color 0.2s;

      &:hover {
        background-color: var(--tk-color-background-deep);
        color: var(--tk-color-foreground);
      }

      &:active {
        background-color: #ffffff06;
        color: var(--tk-color-foreground);
      }

      .app-title-bar-navigation-button-icon {
        width: 11px;
        height: 11px;
        object-fit: contain;
      }
    }
  }

  .app-title-bar-drag-region {
    flex: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 12px;
    font-size: 12px;
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
      transition:
        background-color 0.2s,
        color 0.2s;

      &:hover {
        background-color: #ffffff09;
        color: var(--tk-color-foreground);
      }

      &:active {
        background-color: var(--tk-color-background-deep);
        color: var(--tk-color-foreground);
      }

      &.close {
        &:hover {
          background-color: #c42c1d;
          color: white;
        }

        &:active {
          background-color: #af291a;
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
