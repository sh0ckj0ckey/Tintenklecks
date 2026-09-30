import './assets/styles/main.css'

import { createApp } from 'vue'
import { router } from './router'
import { applyPlatformAttribute } from './composables/useEnvironment'
import App from './App.vue'

applyPlatformAttribute()

createApp(App).use(router).mount('#app')
