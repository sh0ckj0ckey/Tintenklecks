import { computed, onScopeDispose, ref } from 'vue'
import type { ComputedRef } from 'vue'
import type { WindowPosition, WindowBounds, WindowState, WindowingEventRequest } from '../../../shared/windowing-types'

export interface UseWindowingHostReturn {
  windowBounds: ComputedRef<WindowBounds | null>
  isMinimized: ComputedRef<boolean>
  isMaximized: ComputedRef<boolean>
  isFullscreen: ComputedRef<boolean>
  isVisible: ComputedRef<boolean>
  isTopmost: ComputedRef<boolean>
  isFocused: ComputedRef<boolean>

  emitEvent<T = unknown>(action: string, payload?: T): void

  onEvent<T = unknown>(action: string, callback: (payload: T | undefined) => void): () => void

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
  const windowState = ref<WindowState | null>(null)
  const eventUnsubscribers = new Set<() => void>()

  const removeStateChangedListener = window.windowingAPI.onStateChanged((notice) => {
    windowState.value = notice.state
  })

  const windowBounds = computed<WindowBounds | null>(() => windowState.value?.bounds ?? null)
  const isMinimized = computed<boolean>(() => windowState.value?.minimized ?? false)
  const isMaximized = computed<boolean>(() => windowState.value?.maximized ?? false)
  const isFullscreen = computed<boolean>(() => windowState.value?.fullscreen ?? false)
  const isVisible = computed<boolean>(() => windowState.value?.visible ?? false)
  const isTopmost = computed<boolean>(() => windowState.value?.alwaysOnTop ?? false)
  const isFocused = computed<boolean>(() => windowState.value?.focused ?? false)

  const emitEvent = <T = unknown>(action: string, payload?: T): void => {
    const request: WindowingEventRequest<T> = {
      action: action,
      payload: payload
    }

    window.windowingAPI.event<T>(request)
  }

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
    removeStateChangedListener()

    for (const unsubscribe of Array.from(eventUnsubscribers)) {
      unsubscribe()
    }

    eventUnsubscribers.clear()
  })

  void updateWindowState()

  return {
    windowBounds: windowBounds,
    isMinimized: isMinimized,
    isMaximized: isMaximized,
    isFullscreen: isFullscreen,
    isVisible: isVisible,
    isTopmost: isTopmost,
    isFocused: isFocused,
    emitEvent: emitEvent,
    onEvent: onEvent,
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
