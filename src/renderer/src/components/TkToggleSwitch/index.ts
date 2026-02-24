import type { App, Plugin } from 'vue'
import TkToggleSwitch from './TkToggleSwitch.vue'

TkToggleSwitch.install = (app: App) => {
  app.component('TkToggleSwitch', TkToggleSwitch)
}

export { TkToggleSwitch }

export default TkToggleSwitch as typeof TkToggleSwitch & Plugin
