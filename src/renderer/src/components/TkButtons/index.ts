import type { App, Plugin } from 'vue'
import TkButton from './TkButton.vue'
import TkHyperlinkButton from './TkHyperlinkButton.vue'
import TkToggleButton from './TkToggleButton.vue'

TkButton.install = (app: App) => {
  app.component('TkButton', TkButton)
}
TkHyperlinkButton.install = (app: App) => {
  app.component('TkHyperlinkButton', TkHyperlinkButton)
}
TkToggleButton.install = (app: App) => {
  app.component('TkToggleButton', TkToggleButton)
}

export { TkButton, TkHyperlinkButton, TkToggleButton }

const TkButtons: Plugin = {
  install(app: App) {
    app.component('TkButton', TkButton)
    app.component('TkHyperlinkButton', TkHyperlinkButton)
    app.component('TkToggleButton', TkToggleButton)
  }
}

export default TkButtons
