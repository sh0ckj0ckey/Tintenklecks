import type { App, Plugin } from 'vue'
import TkMarquee from './TkMarquee.vue'

TkMarquee.install = (app: App) => {
  app.component('TkMarquee', TkMarquee)
}

export { TkMarquee }

export default TkMarquee as typeof TkMarquee & Plugin
