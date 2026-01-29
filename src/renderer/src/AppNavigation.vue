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

  .app-navigation-section-header {
    flex: none;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 24px;
  }

  .app-navigation-section-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 24px;
  }

  .app-navigation-section-footer {
    flex: none;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 24px;
  }

  .app-navigation-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .app-navigation-group-title {
      font-size: 12px;
      color: #888;
      font-weight: bold;
      padding-left: 12px;
      margin-bottom: 4px;
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
