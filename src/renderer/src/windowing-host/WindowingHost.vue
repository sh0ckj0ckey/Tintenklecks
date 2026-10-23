<template>
  <main class="windowing-host">
    <component :is="currentComponent" v-if="currentComponent" v-bind="currentProps" />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { Component } from 'vue'
import type { WindowContentProps } from '../../../shared/windowing-types'
import type { WindowingComponentRegistry } from './windowing-components'

/*
 * Initialize the renderer-level window state and event listeners.
 *
 * These listeners are shared by all window content components and follow the lifetime of this renderer.
 */
import '../composables/useWindowingHost'

const props = defineProps<{
  /**
   * Static registry of components available to managed windows.
   */
  componentRegistry: WindowingComponentRegistry
}>()

const currentComponent = shallowRef<Component | null>(null)
const currentProps = shallowRef<WindowContentProps>({})

/*
 * Register the update listener during setup, before signaling readiness, so the initial content update cannot be missed.
 */
const unsubscribeUpdate = window.windowingAPI.onUpdate((notification) => {
  if (notification.component !== undefined) {
    const componentId = notification.component

    /*
     * Only properties owned directly by the registry are valid component IDs.
     * This prevents inherited properties such as "constructor" and "toString" from being treated as registered components.
     */
    const isRegistered = Object.prototype.hasOwnProperty.call(props.componentRegistry, componentId)

    if (!isRegistered) {
      console.error(`[WindowingHost] Window component "${componentId}" is not registered.`)

      /*
       * Ignore the whole update so props intended for an unknown component are not applied to the currently rendered component.
       */
      return
    }

    const component = props.componentRegistry[componentId]

    if (!component) {
      console.error(`[WindowingHost] Window component "${componentId}" is invalid.`)
      return
    }

    currentComponent.value = component
  }

  /*
   * An omitted props field preserves the current props.
   * An explicitly supplied empty object clears them.
   */
  if (notification.props !== undefined) {
    currentProps.value = notification.props
  }
})

onMounted(() => {
  /*
   * The host is ready after it has mounted and registered its update listener.
   */
  window.windowingAPI.ready({})
})

onBeforeUnmount(() => {
  unsubscribeUpdate()
})
</script>

<style scoped>
.windowing-host {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
