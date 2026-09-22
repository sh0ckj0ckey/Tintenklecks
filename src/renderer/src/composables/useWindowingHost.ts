import { ref, computed, onScopeDispose } from 'vue'
import type { ComputedRef } from 'vue'
import type { WindowPosition, WindowBounds, WindowState } from '../../../shared/windowing-types'

type Unsubscribe = () => void

type EventHandler<T> = (payload: T | undefined) => void

export interface WindowingHostHandle {
  windowBounds: ComputedRef<WindowBounds | null>
  isMinimized: ComputedRef<boolean>
  isMaximized: ComputedRef<boolean>
  isFullscreen: ComputedRef<boolean>
  isVisible: ComputedRef<boolean>
  isTopmost: ComputedRef<boolean>
  isFocused: ComputedRef<boolean>
  onEvent<T = unknown>(type: string, handler: EventHandler<T>): Unsubscribe
  emitEvent<T = unknown>(type: string, payload?: T): void
  close(): void
  activate(): void
  minimize(): void
  maximize(): void
  restore(): void
  resize(width: number, height: number): void
  move(position: WindowPosition): void
  setTopmost(isTopmost: boolean): void
  enterFullscreen(): void
  exitFullscreen(): void
}

/*
 * Renderer-level window state.
 */

const windowState = ref<WindowState | null>(null)
const windowBounds = computed<WindowBounds | null>(() => windowState.value?.bounds ?? null)
const isMinimized = computed<boolean>(() => windowState.value?.minimized ?? false)
const isMaximized = computed<boolean>(() => windowState.value?.maximized ?? false)
const isFullscreen = computed<boolean>(() => windowState.value?.fullscreen ?? false)
const isVisible = computed<boolean>(() => windowState.value?.visible ?? false)
const isTopmost = computed<boolean>(() => windowState.value?.alwaysOnTop ?? false)
const isFocused = computed<boolean>(() => windowState.value?.focused ?? false)

/*
 * Renderer-level event notification dispatcher.
 */

const notificationDispatcher = new EventTarget()

/*
 * Renderer-level IPC listeners.
 *
 * These listeners intentionally follow the entire renderer lifecycle.
 */

window.windowingAPI.onStateChanged((notification) => {
  windowState.value = notification.state
})

window.windowingAPI.onEvent<unknown>((notification) => {
  const event = new CustomEvent<unknown>(notification.type, {
    detail: notification.payload
  })

  notificationDispatcher.dispatchEvent(event)
})

/*
 * Renderer-level initialization.
 */

const updateWindowState = async (): Promise<void> => {
  try {
    const response = await window.windowingAPI.getWindowState({})

    // Do not overwrite a newer state notification received while waiting.
    if (windowState.value === null) {
      windowState.value = response.state
    }
  } catch {
    // Keep the initial state as null when the initial query fails.
  }
}

// Start the initial query only after the state listener has been registered.
void updateWindowState()

/*
 * Stateless window commands.
 */

const emitEvent = <T = unknown>(type: string, payload?: T): void => {
  window.windowingAPI.sendEvent<T>({ type, payload })
}

const close = (): void => {
  window.windowingAPI.close({})
}

const activate = (): void => {
  window.windowingAPI.activate({})
}

const minimize = (): void => {
  window.windowingAPI.minimize({})
}

const maximize = (): void => {
  window.windowingAPI.maximize({})
}

const restore = (): void => {
  window.windowingAPI.restore({})
}

const resize = (width: number, height: number): void => {
  window.windowingAPI.resize({ width, height })
}

const move = (position: WindowPosition): void => {
  window.windowingAPI.move({ position })
}

const setTopmost = (isTopmost: boolean): void => {
  window.windowingAPI.setTopmost({ isTopmost })
}

const enterFullscreen = (): void => {
  window.windowingAPI.enterFullscreen({})
}

const exitFullscreen = (): void => {
  window.windowingAPI.exitFullscreen({})
}

export function useWindowingHost(): WindowingHostHandle {
  /**
   * All `EventTarget` listeners registered by this composable scope
   * share this signal and are removed together when the scope is disposed.
   */
  const eventAbortController = new AbortController()

  const onEvent = <T = unknown>(type: string, handler: EventHandler<T>): Unsubscribe => {
    const eventListener: EventListener = (event: Event): void => {
      // `T` is a caller-provided compile-time contract and is not validated at runtime.
      const customEvent = event as CustomEvent<T | undefined>
      handler(customEvent.detail)
    }

    notificationDispatcher.addEventListener(type, eventListener, {
      signal: eventAbortController.signal
    })

    const unsubscribe = (): void => {
      notificationDispatcher.removeEventListener(type, eventListener)
    }

    return unsubscribe
  }

  onScopeDispose(() => {
    eventAbortController.abort()
  })

  return {
    windowBounds: windowBounds,
    isMinimized: isMinimized,
    isMaximized: isMaximized,
    isFullscreen: isFullscreen,
    isVisible: isVisible,
    isTopmost: isTopmost,
    isFocused: isFocused,
    onEvent: onEvent,
    emitEvent: emitEvent,
    close: close,
    activate: activate,
    minimize: minimize,
    maximize: maximize,
    restore: restore,
    resize: resize,
    move: move,
    setTopmost: setTopmost,
    enterFullscreen: enterFullscreen,
    exitFullscreen: exitFullscreen
  }
}
