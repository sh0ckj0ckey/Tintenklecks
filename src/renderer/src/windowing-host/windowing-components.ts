import type { Component } from 'vue'

/**
 * Static registry of components available to managed windows.
 *
 * Each key is a stable component ID used by the windowing protocol,
 * and each value is the corresponding Vue component.
 *
 * Asynchronous components are recommended for non-trivial window content
 * to enable lazy loading, but synchronous components are also supported.
 */
export type WindowingComponentRegistry = Readonly<Record<string, Component>>

/**
 * Components available to managed windows.
 *
 * Window components may be located anywhere in the application.
 * Add each component using a stable component ID.
 */
export const windowingComponents = {
  /*
   * Recommended asynchronous registration:
   *
   * preview: defineAsyncComponent(
   *   () => import('../features/preview/PreviewWindow.vue')
   * ),
   *
   * Synchronous registration is also supported:
   *
   * settings: SettingsWindow
   */
} satisfies WindowingComponentRegistry
