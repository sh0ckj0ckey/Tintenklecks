<template>
  <nav class="app-navigation">
    <div class="app-navigation-section-header">
      <template v-for="(group, index) in headerGroups" :key="index">
        <div class="app-navigation-group">
          <div v-if="group.title" class="app-navigation-group-title">{{ group.title }}</div>

          <router-link v-for="item in group.items" :key="item.routeName" :to="{ name: item.routeName }" class="app-navigation-item">
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </template>
    </div>

    <div class="app-navigation-section-separator"></div>

    <div class="app-navigation-section-body">
      <template v-for="(group, index) in menuGroups" :key="index">
        <div class="app-navigation-group">
          <div v-if="group.title" class="app-navigation-group-title">{{ group.title }}</div>

          <router-link v-for="item in group.items" :key="item.routeName" :to="{ name: item.routeName }" class="app-navigation-item">
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </template>
    </div>

    <div class="app-navigation-section-separator"></div>

    <div class="app-navigation-section-footer">
      <template v-for="(group, index) in footerGroups" :key="index">
        <div class="app-navigation-group">
          <div v-if="group.title" class="app-navigation-group-title">{{ group.title }}</div>

          <router-link v-for="item in group.items" :key="item.routeName" :to="{ name: item.routeName }" class="app-navigation-item">
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { RouteName } from '@renderer/router'

const headerGroups = [
  {
    title: '',
    items: [{ label: 'Home', routeName: RouteName.Home }]
  }
]

const menuGroups = [
  {
    title: 'Basic Input',
    items: [
      { label: 'Button', routeName: RouteName.Buttons },
      { label: 'HyperlinkButton', routeName: RouteName.HyperlinkButtons },
      { label: 'ToggleButton', routeName: RouteName.ToggleButtons }
    ]
  },
  {
    title: 'Dialogs and Popups',
    items: [{ label: 'Popup', routeName: RouteName.Popup }]
  },
  {
    title: 'Status and Info',
    items: [{ label: 'Toast', routeName: RouteName.Toast }]
  }
]

const footerGroups = [
  {
    title: '',
    items: [{ label: 'Settings', routeName: RouteName.Settings }]
  }
]
</script>

<style scoped>
.app-navigation {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .app-navigation-section-header {
    flex: none;
    display: flex;
    flex-direction: column;
    margin: 0 8px 8px 8px;
  }

  .app-navigation-section-footer {
    flex: none;
    display: flex;
    flex-direction: column;
    margin: 8px 8px 8px 8px;
  }

  .app-navigation-section-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    margin: 0 4px 0 8px;

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      border-radius: 8px;
      box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.3);
      background-color: #ffffff04;
    }

    /* --- 3. 滑块样式 (保留你的 3D 凸起设计) --- */
    &::-webkit-scrollbar-thumb {
      border-radius: 999px; /* 保持与轨道一致的胶囊形 */
      background-color: transparent; /* 默认隐藏 */

      /* 利用 border 留出间距，让滑块悬浮在轨道里 */
      /* 轨道 border 是 4px，滑块这里设 3px，总共留白 7px，滑块实体剩 2px (太细了) */
      /* 调整策略：让滑块稍微填满一点轨道 */
      border: 4px solid transparent;
      background-clip: content-box;

      box-shadow: none;
      transition:
        background-color 0.3s,
        box-shadow 0.3s;
    }

    /* --- 4. 交互逻辑：默认隐藏，移入显示 --- */

    /* 只有鼠标移入容器时，才显示滑块颜色 */
    &:hover {
      &::-webkit-scrollbar-thumb {
        /* 滑块基础色：米色/浅灰 */
        background-color: #dcdcd9;

        /* 你的凸起效果外阴影 */
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      /* 悬停在滑块上变亮 */
      &::-webkit-scrollbar-thumb:hover {
        background-color: #e8e8e5;
      }

      /* 按下滑块变暗 */
      &::-webkit-scrollbar-thumb:active {
        background-color: #c8c8c5;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .app-navigation-section-separator {
    flex: none;
    border: 0;
    height: 2px;
    background-image:
      linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 50%, transparent),
      linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15) 50%, transparent);
    background-position: top, bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }

  .app-navigation-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .app-navigation-group-title {
      font-size: 12px;
      color: var(--tk-color-foreground);
      margin: 12px 12px 2px 12px;
      opacity: 0.5;
    }

    .app-navigation-item {
      display: block;
      padding: 8px 12px;
      text-decoration: none;
      color: var(--tk-color-foreground);
      border-radius: 8px;
      transition: background-color 0.2s;
      font-size: 14px;
      -webkit-user-drag: none;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.tk-navigation-item-exact-active {
        background-color: var(--tk-color-background-deep);

        &:hover {
          background-color: var(--tk-color-background-deep);
        }
      }
    }
  }
}
</style>
