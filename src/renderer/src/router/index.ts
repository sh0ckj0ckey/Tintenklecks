import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '@renderer/pages/HomePage.vue'
import SettingsPage from '@renderer/pages/SettingsPage.vue'
import TkButtonsPage from '@renderer/pages/TkButtonsPage.vue'
import TkPopupPage from '@renderer/pages/TkPopupPage.vue'
import TkToastPage from '@renderer/pages/TkToastPage.vue'

export const RouteName = {
  Home: 'Home',
  Settings: 'Settings',
  Buttons: 'Buttons',
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
  routes
})
