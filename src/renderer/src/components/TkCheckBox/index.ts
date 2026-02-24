import type { App, Plugin } from 'vue'
import TkCheckBox from './TkCheckBox.vue'

TkCheckBox.install = (app: App) => {
  app.component('TkCheckBox', TkCheckBox)
}

export { TkCheckBox }

export default TkCheckBox as typeof TkCheckBox & Plugin
