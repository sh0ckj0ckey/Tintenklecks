import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '@renderer/pages/HomePage.vue'
import SettingsPage from '@renderer/pages/SettingsPage.vue'
import TkButtonPage from '@renderer/pages/TkButtonPage.vue'
import TkHyperlinkButtonPage from '@renderer/pages/TkHyperlinkButtonPage.vue'
import TkToggleButtonPage from '@renderer/pages/TkToggleButtonPage.vue'
import TkPopupPage from '@renderer/pages/TkPopupPage.vue'
import TkSeparatorPage from '@renderer/pages/TkSeparatorPage.vue'
import TkToastPage from '@renderer/pages/TkToastPage.vue'
import TkMarqueePage from '@renderer/pages/TkMarqueePage.vue'

export const RouteName = {
  Home: 'Home',
  Settings: 'Settings',
  Button: 'Button',
  HyperlinkButton: 'HyperlinkButton',
  ToggleButton: 'ToggleButton',
  Popup: 'Popup',
  Separator: 'Separator',
  Toast: 'Toast',
  Marquee: 'Marquee'
} as const

const routes = [
  {
    path: '/',
    redirect: { name: RouteName.Home }
  },
  {
    path: '/home',
    name: RouteName.Home,
    component: HomePage
  },
  {
    path: '/settings',
    name: RouteName.Settings,
    component: SettingsPage
  },
  {
    path: '/button',
    name: RouteName.Button,
    component: TkButtonPage
  },
  {
    path: '/hyperlink-button',
    name: RouteName.HyperlinkButton,
    component: TkHyperlinkButtonPage
  },
  {
    path: '/toggle-button',
    name: RouteName.ToggleButton,
    component: TkToggleButtonPage
  },
  {
    path: '/popup',
    name: RouteName.Popup,
    component: TkPopupPage
  },
  {
    path: '/separator',
    name: RouteName.Separator,
    component: TkSeparatorPage
  },
  {
    path: '/toast',
    name: RouteName.Toast,
    component: TkToastPage
  },
  {
    path: '/marquee',
    name: RouteName.Marquee,
    component: TkMarqueePage
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'tk-navigation-item-active',
  linkExactActiveClass: 'tk-navigation-item-exact-active'
})
