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
  }

  .app-navigation-section-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }

  .app-navigation-section-footer {
    flex: none;
    display: flex;
    flex-direction: column;
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
    gap: 8px;
    margin: 0 8px 0 16px;

    .app-navigation-group-title {
      font-size: 12px;
      font-weight: bold;
      color: var(--tk-color-foreground);
      margin: 12px 12px 4px 12px;
      opacity: 0.5;
    }

    .app-navigation-item {
      display: block;
      padding: 10px 12px;
      text-decoration: none;
      color: var(--tk-color-foreground);
      border-radius: 8px;
      transition: background-color 0.2s;
      font-size: 14px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.tk-navigation-item-exact-active {
        background-color: var(--tk-color-background-deep);
        font-weight: 500;

        &:hover {
          background-color: var(--tk-color-background-deep);
        }
      }
    }
  }
}
</style>
