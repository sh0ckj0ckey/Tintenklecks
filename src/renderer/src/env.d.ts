/// <reference types="vite/client" />

import type { WindowingAPI } from '../../shared/windowing-api'

declare global {
  interface Window {
    windowingAPI: WindowingAPI
  }
}

export {}
