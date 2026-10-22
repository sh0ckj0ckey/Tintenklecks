import '../assets/styles/main.css'

import { createApp } from 'vue'
import { applyEnvironmentDataAttributes } from '../composables/useEnvironment'
import WindowingHost from './WindowingHost.vue'

applyEnvironmentDataAttributes()

createApp(WindowingHost).mount('#app')
