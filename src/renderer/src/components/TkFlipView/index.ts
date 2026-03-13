import type { App, Plugin, Component } from 'vue'
import TkFlipViewComp from './TkFlipView.vue'

type SFCWithInstall<T> = T & Plugin

const TkFlipView = TkFlipViewComp as unknown as SFCWithInstall<typeof TkFlipViewComp>

TkFlipView.install = (app: App) => {
  app.component('TkFlipView', TkFlipView as Component)
}

export { TkFlipView }
export default TkFlipView
