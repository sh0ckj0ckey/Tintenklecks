import { computed, onScopeDispose, ref } from 'vue'
import type { ComputedRef } from 'vue'
import type { WindowPosition, WindowBounds, WindowState } from '../../../shared/windowing-types'

const windowState = ref<WindowState | null>(null)

const windowBounds = computed<WindowBounds | null>(() => windowState.value?.bounds ?? null)
const isMinimized = computed<boolean>(() => windowState.value?.minimized ?? false)
const isMaximized = computed<boolean>(() => windowState.value?.maximized ?? false)
const isFullscreen = computed<boolean>(() => windowState.value?.fullscreen ?? false)
const isVisible = computed<boolean>(() => windowState.value?.visible ?? false)
const isTopmost = computed<boolean>(() => windowState.value?.alwaysOnTop ?? false)
const isFocused = computed<boolean>(() => windowState.value?.focused ?? false)

// This listener intentionally follows the entire renderer lifecycle.
window.windowingAPI.onStateChanged((notice) => {
  windowState.value = notice.state
})

const updateWindowState = async (): Promise<void> => {
  try {
    const response = await window.windowingAPI.getWindowState({})

    if (windowState.value === null) {
      windowState.value = response.state
    }
  } catch {
    // Keep the initial state as null when the initial query fails.
  }
}

void updateWindowState()

export interface UseWindowingHostReturn {
  windowBounds: ComputedRef<WindowBounds | null>
  isMinimized: ComputedRef<boolean>
  isMaximized: ComputedRef<boolean>
  isFullscreen: ComputedRef<boolean>
  isVisible: ComputedRef<boolean>
  isTopmost: ComputedRef<boolean>
  isFocused: ComputedRef<boolean>
  onEvent<T = unknown>(action: string, handler: (payload: T | undefined) => void): () => void
  emitEvent<T = unknown>(action: string, payload?: T): void
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

export function useWindowingHost(): UseWindowingHostReturn {
  const eventUnsubscribers = new Set<() => void>()

  const onEvent = <T = unknown>(action: string, handler: (payload: T | undefined) => void): (() => void) => {
    const removeListener = window.windowingAPI.onEvent<T>((notice) => {
      if (notice.action !== action) {
        return
      }

      handler(notice.payload)
    })

    let removed = false

    const unsubscribe = (): void => {
      if (removed) {
        return
      }

      removed = true
      eventUnsubscribers.delete(unsubscribe)
      removeListener()
    }

    eventUnsubscribers.add(unsubscribe)

    return unsubscribe
  }

  const emitEvent = <T = unknown>(action: string, payload?: T): void => {
    window.windowingAPI.event<T>({ action, payload })
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

  onScopeDispose(() => {
    for (const unsubscribe of Array.from(eventUnsubscribers)) {
      unsubscribe()
    }

    eventUnsubscribers.clear()
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
