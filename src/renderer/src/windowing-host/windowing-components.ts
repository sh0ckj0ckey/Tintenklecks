import type { Component } from 'vue'

/**
 * Static registry of components available to managed windows.
 *
 * Each key is a stable component ID used by the windowing protocol,
 * and each value resolves the corresponding Vue component.
 */
export type WindowingComponentRegistry = Readonly<Record<string, () => Component | Promise<Component>>>

/**
 * Components available to managed windows.
 *
 * Window components may be located anywhere in the application.
 * Add each component to this registry using a stable component ID.
 */
export const windowingComponents = {
  /*
   * Examples:
   *
   * settings: () => SettingsWindow,
   *
   * preview: async () => {
   *   const module = await import('../features/preview/PreviewWindow.vue')
   *   return module.default
   * }
   */
} satisfies WindowingComponentRegistry
