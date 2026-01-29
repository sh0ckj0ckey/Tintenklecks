import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '@renderer/pages/HomePage.vue'
import SettingsPage from '@renderer/pages/SettingsPage.vue'
import TkButtonsPage from '@renderer/pages/TkButtonsPage.vue'
import TkHyperlinkButtonsPage from '@renderer/pages/TkHyperlinkButtonsPage.vue'
import TkToggleButtonsPage from '@renderer/pages/TkToggleButtonsPage.vue'
import TkPopupPage from '@renderer/pages/TkPopupPage.vue'
import TkToastPage from '@renderer/pages/TkToastPage.vue'

export const RouteName = {
  Home: 'Home',
  Settings: 'Settings',
  Buttons: 'Buttons',
  HyperlinkButtons: 'HyperlinkButtons',
  ToggleButtons: 'ToggleButtons',
  Popup: 'Popup',
  Toast: 'Toast'
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
    path: '/buttons',
    name: RouteName.Buttons,
    component: TkButtonsPage
  },
  {
    path: '/hyperlink-buttons',
    name: RouteName.HyperlinkButtons,
    component: TkHyperlinkButtonsPage
  },
  {
    path: '/toggle-buttons',
    name: RouteName.ToggleButtons,
    component: TkToggleButtonsPage
  },
  {
    path: '/popup',
    name: RouteName.Popup,
    component: TkPopupPage
  },
  {
    path: '/toast',
    name: RouteName.Toast,
    component: TkToastPage
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'tk-navigation-item-active',
  linkExactActiveClass: 'tk-navigation-item-exact-active'
})
