/// <reference types="vite/client" />

export interface AppWindowAPI {
  close: () => void
  minimize: () => void
  maximize: () => void
  onWindowStateChange: (callback: (state: 'maximized' | 'normal') => void) => () => void
}

declare global {
  interface Window {
    appWindowAPI: AppWindowAPI
  }
}
