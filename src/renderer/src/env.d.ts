/// <reference types="vite/client" />

import type { EnvironmentAPI } from '../../shared/environment-api'
import type { WindowingAPI } from '../../shared/windowing-api'

declare global {
  interface Window {
    environmentAPI: EnvironmentAPI
    windowingAPI: WindowingAPI
  }
}

export {}
