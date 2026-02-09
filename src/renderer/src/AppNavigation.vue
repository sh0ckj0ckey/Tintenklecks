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

    <TkSeparator orientation="horizontal" />

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

    <TkSeparator orientation="horizontal" />

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
import TkSeparator from '@renderer/components/TkSeparator/TkSeparator.vue'

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
    margin: 0 20px 8px 8px;
  }

  .app-navigation-section-footer {
    flex: none;
    display: flex;
    flex-direction: column;
    margin: 8px 20px 10px 8px;
  }

  .app-navigation-section-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin: 0 4px 0 8px;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      border-radius: 4px;
      box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);
      background-color: #ffffff03;
      margin: 8px 0;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: #ffffff03;
      border: 2px solid transparent;
      background-clip: content-box;
      box-shadow: none;
      transition:
        background-color 0.3s,
        box-shadow 0.3s;
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: #dcdcd9;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: #e8e8e5;
      }

      &::-webkit-scrollbar-thumb:active {
        background-color: #c8c8c5;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
      }
    }
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
      border-radius: 4px;
      padding: 8px 12px;
      color: var(--tk-color-foreground);
      font-size: 14px;
      text-decoration: none;
      -webkit-user-drag: none;
      background-color: transparent;
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0),
        inset 1px 1px 0 rgba(255, 255, 255, 0),
        inset -1px -1px 0 rgba(255, 255, 255, 0);
      transition:
        transform 0.2s,
        background-color 0.2s,
        color 0.2s,
        box-shadow 0.2s;

      &:hover:not(.tk-navigation-item-exact-active) {
        color: var(--tk-color-foreground);
        background-color: color-mix(in srgb, var(--tk-color-background-deep), transparent 36%);
        transform: translateY(-1px);
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.2),
          inset 1px 1px 0 rgba(255, 255, 255, 0.02),
          inset -1px -1px 0 rgba(255, 255, 255, 0.01);
      }

      &:active:not(.tk-navigation-item-exact-active) {
        color: color-mix(in srgb, var(--tk-color-foreground), #000 20%);
        background-color: var(--tk-color-background-deep);
        transform: translateY(1px);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.2),
          inset 1px 1px 0 rgba(255, 255, 255, 0.02),
          inset -1px -1px 0 rgba(255, 255, 255, 0.01);
      }

      &:focus-visible {
        outline: 2px dashed currentColor;
        outline-offset: 2px;
      }

      &.tk-navigation-item-exact-active {
        color: var(--tk-color-foreground);
        background-color: var(--tk-color-background-deep);
        transform: translateY(0);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.2),
          inset 1px 1px 0 rgba(255, 255, 255, 0.02),
          inset -1px -1px 0 rgba(255, 255, 255, 0.01);
      }
    }
  }
}
</style>
