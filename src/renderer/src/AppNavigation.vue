<template>
  <nav class="app-navigation">
    <div class="app-navigation-section-header">
      <template v-for="(group, index) in headerGroups" :key="index">
        <div class="app-navigation-group">
          <div v-if="group.title" class="app-navigation-group-title">{{ group.title }}</div>

          <router-link v-for="item in group.items" :key="item.routeName" :to="{ name: item.routeName }" class="app-navigation-item">
            <component :is="item.icon" v-if="item.icon" class="app-navigation-item-icon fluent-icon" />
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
            <component :is="item.icon" v-if="item.icon" class="app-navigation-item-icon" />
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
            <component :is="item.icon" v-if="item.icon" class="app-navigation-item-icon fluent-icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
import { RouteName } from '@renderer/router'
import TkSeparator from '@renderer/components/TkSeparator/TkSeparator.vue'
import IconNavigationHome from '@renderer/components/TkIcons/IconHome.vue'
import IconNavigationSetting from '@renderer/components/TkIcons/IconSetting.vue'
import IconNavigationButton from '@renderer/components/TkIcons/navigation/IconNavigationButton.vue'
import IconNavigationHyperlinkButton from '@renderer/components/TkIcons/navigation/IconNavigationHyperlinkButton.vue'
import IconNavigationToggleButton from '@renderer/components/TkIcons/navigation/IconNavigationToggleButton.vue'
import IconNavigationCheckBox from '@renderer/components/TkIcons/navigation/IconNavigationCheckBox.vue'
import IconNavigationToggleSwitch from '@renderer/components/TkIcons/navigation/IconNavigationToggleSwitch.vue'
import IconNavigationPopup from '@renderer/components/TkIcons/navigation/IconNavigationPopup.vue'
import IconNavigationSeparator from '@renderer/components/TkIcons/navigation/IconNavigationSeparator.vue'
import IconNavigationToast from '@renderer/components/TkIcons/navigation/IconNavigationToast.vue'
import IconNavigationMarquee from '@renderer/components/TkIcons/navigation/IconNavigationMarquee.vue'

type NavigationGroup = {
  title: string
  items: NavigationItem[]
}

type NavigationItem = {
  label: string
  routeName: string
  icon: Component
}

const headerGroups: NavigationGroup[] = [
  {
    title: '',
    items: [{ label: 'Home', routeName: RouteName.Home, icon: IconNavigationHome }]
  }
]

const menuGroups: NavigationGroup[] = [
  {
    title: 'Basic Input',
    items: [
      { label: 'Button', routeName: RouteName.Button, icon: IconNavigationButton },
      { label: 'HyperlinkButton', routeName: RouteName.HyperlinkButton, icon: IconNavigationHyperlinkButton },
      { label: 'ToggleButton', routeName: RouteName.ToggleButton, icon: IconNavigationToggleButton },
      { label: 'CheckBox', routeName: RouteName.CheckBox, icon: IconNavigationCheckBox },
      { label: 'ToggleSwitch', routeName: RouteName.ToggleSwitch, icon: IconNavigationToggleSwitch }
    ]
  },
  {
    title: 'Dialogs and Popups',
    items: [{ label: 'Popup', routeName: RouteName.Popup, icon: IconNavigationPopup }]
  },
  {
    title: 'Layout',
    items: [{ label: 'Separator', routeName: RouteName.Separator, icon: IconNavigationSeparator }]
  },
  {
    title: 'Status and Info',
    items: [{ label: 'Toast', routeName: RouteName.Toast, icon: IconNavigationToast }]
  },
  {
    title: 'Motion',
    items: [{ label: 'Marquee', routeName: RouteName.Marquee, icon: IconNavigationMarquee }]
  }
]

const footerGroups: NavigationGroup[] = [
  {
    title: '',
    items: [{ label: 'Settings', routeName: RouteName.Settings, icon: IconNavigationSetting }]
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
    padding: 8px 12px 8px 8px;
    margin-right: 4px;
    gap: 12px;
  }

  .app-navigation-section-footer {
    flex: none;
    display: flex;
    flex-direction: column;
    padding: 8px 12px 8px 8px;
    margin-right: 4px;
    gap: 12px;
  }

  .app-navigation-section-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding: 12px 4px 8px 8px;
    margin-right: 4px;
    gap: 12px;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      margin: 8px 0;
      background-color: transparent;
      border-radius: 4px;
      box-shadow: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ffffff20;
      border: 2px solid transparent;
      border-radius: 4px;
      background-clip: content-box;
    }

    &:hover {
      &::-webkit-scrollbar-track {
        margin: 8px 0;
        background-color: #ffffff08;
        border-radius: 4px;
        box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ffffff18;
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: #ffffff26;
      }

      &::-webkit-scrollbar-thumb:active {
        background-color: #ffffff20;
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
      margin: 0 12px 2px 12px;
      opacity: 0.5;
    }

    .app-navigation-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 4px;
      background-color: transparent;
      color: var(--tk-color-foreground);
      font-size: 14px;
      text-decoration: none;
      -webkit-user-drag: none;
      cursor: default;
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0),
        inset 1px 1px 0 rgba(255, 255, 255, 0),
        inset -1px -1px 0 rgba(255, 255, 255, 0);
      transition:
        transform 0.2s,
        background-color 0.2s,
        color 0.2s,
        box-shadow 0.2s;

      .app-navigation-item-icon {
        flex: none;
        width: 24px;
        height: 24px;
        opacity: 0.75;

        &.fluent-icon {
          flex: none;
          width: 16px;
          height: 16px;
          opacity: 0.75;
          margin: 0 4px;
        }
      }

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
