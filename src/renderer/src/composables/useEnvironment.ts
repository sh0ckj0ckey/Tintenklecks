import type { Platform } from '../../../shared/environment-types'

/*
 * The host environment never changes while a renderer is alive, so it is read
 * as a plain value instead of a reactive ref.
 * The bridge is optional so that a document without the preload still renders.
 */

const platform: Platform = window.environmentAPI?.platform ?? 'unknown'

/**
 * Read the host environment of the current window.
 */
export function useEnvironment(): { platform: Platform } {
  return { platform: platform }
}

/**
 * Apply environment data attributes to the document element.
 *
 * These attributes belong to one document, so every renderer entry point has to call this function.
 */
export function applyEnvironmentDataAttributes(): void {
  document.documentElement.setAttribute('data-platform', platform)
}
