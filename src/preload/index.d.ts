import type { WindowingAPI } from './windowing-api'

declare global {
  interface Window {
    windowingAPI: WindowingAPI
  }
}

export {}
