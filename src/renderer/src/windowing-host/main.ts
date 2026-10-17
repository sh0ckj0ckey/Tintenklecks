import '../assets/styles/main.css'

import { createApp } from 'vue'
import { applyPlatformAttribute } from '../composables/useEnvironment'
import WindowingHost from './WindowingHost.vue'

applyPlatformAttribute()

createApp(WindowingHost).mount('#app')
