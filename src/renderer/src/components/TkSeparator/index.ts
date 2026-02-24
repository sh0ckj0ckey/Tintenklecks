import type { App, Plugin } from 'vue'
import TkSeparator from './TkSeparator.vue'

TkSeparator.install = (app: App) => {
  app.component('TkSeparator', TkSeparator)
}

export { TkSeparator }

export default TkSeparator as typeof TkSeparator & Plugin
