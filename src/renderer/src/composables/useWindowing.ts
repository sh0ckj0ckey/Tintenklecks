import { ref, computed, onScopeDispose } from 'vue'
import type { ComputedRef } from 'vue'
import type { WindowId, WindowPosition, WindowingClosedNotification, WindowingEventNotification } from '../../../shared/windowing-types'

type Unsubscribe = () => void

type EventHandler<T> = (payload: T | undefined) => void

type ClosedHandler = () => void

type InternalEventNotification = WindowingEventNotification<unknown>

type ManagedWindowLifecycleState = 'idle' | 'opening' | 'opened' | 'closed'

/**
 * Content displayed by a managed window.
 */
export interface ManagedWindowContent {
  /**
   * Component name or path recognized by the managed-window host.
   */
  component?: string

  /**
   * Props passed to the content component.
   * The value must be serializable by Electron IPC.
   */
  props?: Record<string, unknown>
}

/**
 * Options used when opening a managed window.
 */
export interface ManagedWindowOpenOptions {
  /**
   * Window width in device-independent pixels.
   */
  width?: number

  /**
   * Window height in device-independent pixels.
   */
  height?: number

  /**
   * Hide the window from the taskbar.
   */
  skipTaskbar?: boolean

  /**
   * Allow the window to be resized.
   */
  resizable?: boolean

  /**
   * Keep the window always on top.
   */
  alwaysOnTop?: boolean

  /**
   * Open the window as a modal window.
   */
  modal?: boolean

  /**
   * Native parent relationship of the window.
   * Defaults to `opener`.
   */
  parent?: 'opener' | 'none' | WindowId

  /**
   * Initial window position.
   */
  position?: WindowPosition

  /**
   * Show the window without taking focus.
   */
  showInactive?: boolean
}

export interface ManagedWindowHandle {
  isOpening: ComputedRef<boolean>
  isOpened: ComputedRef<boolean>
  isClosed: ComputedRef<boolean>
  open(content: ManagedWindowContent, options: ManagedWindowOpenOptions): Promise<void>
  updateContent(content: ManagedWindowContent): void
  onClosed(handler: ClosedHandler): Unsubscribe
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
 * Renderer-level notification dispatcher.
 */

const notificationDispatcher = new EventTarget()

/*
 * Internal notification event types.
 */

const eventNotificationType = 'window-event'
const closedNotificationType = 'window-closed'

/*
 * Renderer-level IPC listeners.
 *
 * These listeners intentionally follow the entire renderer lifecycle.
 * Individual managed-window handles filter notifications using their
 * internally managed window IDs.
 */

window.windowingAPI.onEvent<unknown>((notification) => {
  const event = new CustomEvent<InternalEventNotification>(eventNotificationType, {
    detail: notification
  })

  notificationDispatcher.dispatchEvent(event)
})

window.windowingAPI.onClosed((notification) => {
  const event = new CustomEvent<WindowingClosedNotification>(closedNotificationType, {
    detail: notification
  })

  notificationDispatcher.dispatchEvent(event)
})

export function useWindowing(): ManagedWindowHandle {
  let disposed = false
  let windowId: WindowId | undefined

  const lifecycleState = ref<ManagedWindowLifecycleState>('idle')
  const isOpening = computed<boolean>(() => lifecycleState.value === 'opening')
  const isOpened = computed<boolean>(() => lifecycleState.value === 'opened')
  const isClosed = computed<boolean>(() => lifecycleState.value === 'closed')

  /**
   * All listeners belonging to this managed-window handle
   * share this signal and are removed together
   * when the handle scope is disposed or its window is closed.
   */
  const handleAbortController = new AbortController()

  /*
   * Local dispatchers belonging to this managed-window handle.
   */

  const eventDispatcher = new EventTarget()
  const closedDispatcher = new EventTarget()

  const requireWindowId = (): WindowId => {
    if (disposed) {
      throw new Error('The managed window handle has been disposed.')
    }

    if (windowId === undefined || lifecycleState.value !== 'opened') {
      throw new Error('The managed window is not open.')
    }

    return windowId
  }

  /*
   * Renderer-level event notification filtering.
   */

  const eventNotificationListener: EventListener = (event: Event): void => {
    const customEvent = event as CustomEvent<InternalEventNotification>
    const notification = customEvent.detail

    if (windowId === undefined || notification.fromId !== windowId) {
      return
    }

    const managedWindowEvent = new CustomEvent<unknown>(notification.type, {
      detail: notification.payload
    })

    eventDispatcher.dispatchEvent(managedWindowEvent)
  }

  notificationDispatcher.addEventListener(eventNotificationType, eventNotificationListener, {
    signal: handleAbortController.signal
  })

  /*
   * Renderer-level closed notification filtering.
   */

  const closedNotificationListener: EventListener = (event: Event): void => {
    const customEvent = event as CustomEvent<WindowingClosedNotification>
    const notification = customEvent.detail

    if (windowId === undefined || notification.id !== windowId) {
      return
    }

    windowId = undefined
    lifecycleState.value = 'closed'

    // Notify local listeners before removing all listeners owned by the handle.
    closedDispatcher.dispatchEvent(new Event('closed'))

    handleAbortController.abort()
  }

  notificationDispatcher.addEventListener(closedNotificationType, closedNotificationListener, {
    signal: handleAbortController.signal
  })

  const open = async (content: ManagedWindowContent, options: ManagedWindowOpenOptions): Promise<void> => {
    if (disposed) {
      throw new Error('The managed window handle has been disposed.')
    }
    if (lifecycleState.value === 'opening') {
      throw new Error('The managed window is already opening.')
    }
    if (lifecycleState.value === 'opened') {
      throw new Error('The managed window is already open.')
    }
    if (lifecycleState.value === 'closed') {
      throw new Error('A closed managed window cannot be reopened.')
    }

    lifecycleState.value = 'opening'

    try {
      const response = await window.windowingAPI.open({
        width: options.width,
        height: options.height,
        skipTaskbar: options.skipTaskbar,
        resizable: options.resizable,
        alwaysOnTop: options.alwaysOnTop,
        modal: options.modal,
        parentId: options.parent === 'none' ? null : options.parent === 'opener' ? undefined : options.parent,
        position: options.position,
        showInactive: options.showInactive
      })

      /*
       * The Vue scope may have been disposed while the main process was waiting for the managed-window host to become ready.
       */
      if (disposed) {
        window.windowingAPI.close({
          targetId: response.id
        })

        throw new Error('The managed window handle was disposed while opening.')
      }

      /*
       * Send the initial content before marking the handle as opened and resolving open().
       */
      window.windowingAPI.update({
        targetId: response.id,
        component: content.component,
        props: content.props
      })

      windowId = response.id

      lifecycleState.value = 'opened'
    } catch (error) {
      const openedWindowId = windowId

      windowId = undefined

      if (!disposed) {
        lifecycleState.value = 'idle'
      }

      /*
       * If the window was created but sending its initial content failed
       * synchronously, request that the created window be closed.
       */
      if (openedWindowId !== undefined) {
        window.windowingAPI.close({
          targetId: openedWindowId
        })
      }

      throw error
    }
  }

  const updateContent = (content: ManagedWindowContent): void => {
    const targetId = requireWindowId()
    const component = content?.component
    const props = content?.props
    window.windowingAPI.update({ targetId, component, props })
  }

  const onClosed = (handler: ClosedHandler): Unsubscribe => {
    if (disposed) {
      throw new Error('The managed window handle has been disposed.')
    }
    if (lifecycleState.value === 'closed') {
      throw new Error('The managed window has been closed.')
    }

    const closedListener: EventListener = (): void => {
      handler()
    }

    closedDispatcher.addEventListener('closed', closedListener, {
      signal: handleAbortController.signal
    })

    const unsubscribe = (): void => {
      closedDispatcher.removeEventListener('closed', closedListener)
    }

    return unsubscribe
  }

  const onEvent = <T = unknown>(type: string, handler: EventHandler<T>): Unsubscribe => {
    if (disposed) {
      throw new Error('The managed window handle has been disposed.')
    }
    if (lifecycleState.value === 'closed') {
      throw new Error('The managed window has been closed.')
    }

    const eventListener: EventListener = (event: Event): void => {
      // `T` is a caller-provided compile-time contract and is not validated at runtime.
      const customEvent = event as CustomEvent<T | undefined>
      handler(customEvent.detail)
    }

    eventDispatcher.addEventListener(type, eventListener, {
      signal: handleAbortController.signal
    })

    const unsubscribe = (): void => {
      eventDispatcher.removeEventListener(type, eventListener)
    }

    return unsubscribe
  }

  const emitEvent = <T = unknown>(type: string, payload?: T): void => {
    const targetId = requireWindowId()
    window.windowingAPI.sendEvent<T>({ targetId, type, payload })
  }

  const close = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.close({ targetId })
  }

  const activate = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.activate({ targetId })
  }

  const minimize = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.minimize({ targetId })
  }

  const maximize = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.maximize({ targetId })
  }

  const restore = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.restore({ targetId })
  }

  const resize = (width: number, height: number): void => {
    const targetId = requireWindowId()
    window.windowingAPI.resize({ targetId, width, height })
  }

  const move = (position: WindowPosition): void => {
    const targetId = requireWindowId()
    window.windowingAPI.move({ targetId, position })
  }

  const setTopmost = (isTopmost: boolean): void => {
    const targetId = requireWindowId()
    window.windowingAPI.setTopmost({ targetId, isTopmost })
  }

  const enterFullscreen = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.enterFullscreen({ targetId })
  }

  const exitFullscreen = (): void => {
    const targetId = requireWindowId()
    window.windowingAPI.exitFullscreen({ targetId })
  }

  onScopeDispose(() => {
    disposed = true
    handleAbortController.abort()
  })

  return {
    isOpening: isOpening,
    isOpened: isOpened,
    isClosed: isClosed,
    open: open,
    updateContent: updateContent,
    onClosed: onClosed,
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
