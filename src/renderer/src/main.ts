import './assets/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

// Set OS attribute for CSS
const params = new URLSearchParams(window.location.search)
const os = params.get('os') || 'unknown'
document.documentElement.setAttribute('data-os', os)

createApp(App).use(router).mount('#app')
