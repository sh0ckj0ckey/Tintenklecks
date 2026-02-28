import type { App, Plugin } from 'vue'
import TkRadioButtonComp from './TkRadioButton.vue'
import TkRadioButtonsComp from './TkRadioButtons.vue'

type SFCWithInstall<T> = T & Plugin

const TkRadioButton = TkRadioButtonComp as unknown as SFCWithInstall<typeof TkRadioButtonComp>
const TkRadioButtons = TkRadioButtonsComp as unknown as SFCWithInstall<typeof TkRadioButtonsComp>

TkRadioButton.install = (app: App) => {
  app.component('TkRadioButton', TkRadioButton)
}
TkRadioButtons.install = (app: App) => {
  app.component('TkRadioButtons', TkRadioButtons)
}

export { TkRadioButton, TkRadioButtons }

const TkRadio: Plugin = {
  install(app: App) {
    app.component('TkRadioButton', TkRadioButton)
    app.component('TkRadioButtons', TkRadioButtons)
  }
}

export default TkRadio
