import './assets/styles/main.css'

import { createApp } from 'vue'
import { router } from './router'
import { applyEnvironmentDataAttributes } from './composables/useEnvironment'
import App from './App.vue'

applyEnvironmentDataAttributes()

createApp(App).use(router).mount('#app')
