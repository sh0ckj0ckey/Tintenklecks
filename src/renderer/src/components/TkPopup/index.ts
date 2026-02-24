import type { App, Plugin } from 'vue'
import TkPopup from './TkPopup.vue'

TkPopup.install = (app: App) => {
  app.component('TkPopup', TkPopup)
}

export { TkPopup }

export default TkPopup as typeof TkPopup & Plugin
