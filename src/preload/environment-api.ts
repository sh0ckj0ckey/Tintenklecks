import type { EnvironmentAPI } from '../shared/environment-api'
import type { Platform } from '../shared/environment-types'

/**
 * Map `process.platform` to a `Platform`.
 */
function resolvePlatform(): Platform {
  switch (process.platform) {
    case 'win32':
      return 'windows'
    case 'darwin':
      return 'macos'
    case 'linux':
      return 'linux'
    default:
      return 'unknown'
  }
}

const environmentAPI = {
  platform: resolvePlatform()
} satisfies EnvironmentAPI

export { environmentAPI }
