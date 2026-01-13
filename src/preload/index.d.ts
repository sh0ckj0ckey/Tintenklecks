declare global {
  interface Window {
    appWindowAPI: {
      close: () => void
      minimize: () => void
      maximize: () => void
      onWindowStateChange: (callback: (state: 'maximized' | 'normal') => void) => () => void
      onWindowFocusChange: (callback: (isFocused: boolean) => void) => () => void
    }
  }
}
