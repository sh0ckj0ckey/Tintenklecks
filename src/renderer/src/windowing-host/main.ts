import '../assets/styles/main.css'

// Initialize renderer-level windowing host listeners before signaling readiness.
import '../composables/useWindowingHost'

import { createApp } from 'vue'
import { applyEnvironmentDataAttributes } from '../composables/useEnvironment'
import WindowingHost from './WindowingHost.vue'
import { windowingComponents } from './windowing-components'

applyEnvironmentDataAttributes()

createApp(WindowingHost, { componentRegistry: windowingComponents }).mount('#app')
