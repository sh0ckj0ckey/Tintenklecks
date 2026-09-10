import { ipcRenderer, type IpcRendererEvent } from 'electron'
import { windowingIpcChannels } from '../shared/windowing-ipc'
import type { WindowingAPI, WindowingUnsubscribe } from '../shared/windowing-api'
import type {
  WindowingOpenRequest,
  WindowingOpenResponse,
  WindowingReadyNotification,
  WindowingUpdateRequest,
  WindowingUpdateNotification,
  WindowingEventRequest,
  WindowingEventNotification,
  WindowingCloseRequest,
  WindowingActivateRequest,
  WindowingMinimizeRequest,
  WindowingMaximizeRequest,
  WindowingRestoreRequest,
  WindowingResizeRequest,
  WindowingMoveRequest,
  WindowingTopmostRequest,
  WindowingEnterFullscreenRequest,
  WindowingExitFullscreenRequest,
  WindowingGetStateRequest,
  WindowingGetStateResponse,
  WindowingStateChangedNotification,
  WindowingClosedNotification
} from '../shared/windowing-types'

const windowingAPI = {
  open(request: WindowingOpenRequest): Promise<WindowingOpenResponse> {
    return ipcRenderer.invoke(windowingIpcChannels.OPEN, request)
  },

  ready(notification: WindowingReadyNotification): void {
    ipcRenderer.send(windowingIpcChannels.READY, notification)
  },

  update(request: WindowingUpdateRequest): void {
    ipcRenderer.send(windowingIpcChannels.UPDATE, request)
  },

  sendEvent<T = unknown>(request: WindowingEventRequest<T>): void {
    ipcRenderer.send(windowingIpcChannels.EVENT, request)
  },

  close(request: WindowingCloseRequest): void {
    ipcRenderer.send(windowingIpcChannels.CLOSE, request)
  },

  activate(request: WindowingActivateRequest): void {
    ipcRenderer.send(windowingIpcChannels.ACTIVATE, request)
  },

  minimize(request: WindowingMinimizeRequest): void {
    ipcRenderer.send(windowingIpcChannels.MINIMIZE, request)
  },

  maximize(request: WindowingMaximizeRequest): void {
    ipcRenderer.send(windowingIpcChannels.MAXIMIZE, request)
  },

  restore(request: WindowingRestoreRequest): void {
    ipcRenderer.send(windowingIpcChannels.RESTORE, request)
  },

  resize(request: WindowingResizeRequest): void {
    ipcRenderer.send(windowingIpcChannels.RESIZE, request)
  },

  move(request: WindowingMoveRequest): void {
    ipcRenderer.send(windowingIpcChannels.MOVE, request)
  },

  setTopmost(request: WindowingTopmostRequest): void {
    ipcRenderer.send(windowingIpcChannels.TOPMOST, request)
  },

  enterFullscreen(request: WindowingEnterFullscreenRequest): void {
    ipcRenderer.send(windowingIpcChannels.ENTER_FULLSCREEN, request)
  },

  exitFullscreen(request: WindowingExitFullscreenRequest): void {
    ipcRenderer.send(windowingIpcChannels.EXIT_FULLSCREEN, request)
  },

  getWindowState(request: WindowingGetStateRequest): Promise<WindowingGetStateResponse> {
    return ipcRenderer.invoke(windowingIpcChannels.GET_WINDOW_STATE, request)
  },

  onUpdate(listener: (notification: WindowingUpdateNotification) => void): WindowingUnsubscribe {
    const ipcListener = (_event: IpcRendererEvent, notification: WindowingUpdateNotification): void => {
      listener(notification)
    }

    ipcRenderer.on(windowingIpcChannels.UPDATE, ipcListener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcChannels.UPDATE, ipcListener)
    }
  },

  onEvent<T = unknown>(listener: (notification: WindowingEventNotification<T>) => void): WindowingUnsubscribe {
    const ipcListener = (_event: IpcRendererEvent, notification: WindowingEventNotification<T>): void => {
      listener(notification)
    }

    ipcRenderer.on(windowingIpcChannels.EVENT, ipcListener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcChannels.EVENT, ipcListener)
    }
  },

  onStateChanged(listener: (notification: WindowingStateChangedNotification) => void): WindowingUnsubscribe {
    const ipcListener = (_event: IpcRendererEvent, notification: WindowingStateChangedNotification): void => {
      listener(notification)
    }

    ipcRenderer.on(windowingIpcChannels.WINDOW_STATE_CHANGED, ipcListener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcChannels.WINDOW_STATE_CHANGED, ipcListener)
    }
  },

  onClosed(listener: (notification: WindowingClosedNotification) => void): WindowingUnsubscribe {
    const ipcListener = (_event: IpcRendererEvent, notification: WindowingClosedNotification): void => {
      listener(notification)
    }

    ipcRenderer.on(windowingIpcChannels.WINDOW_CLOSED, ipcListener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcChannels.WINDOW_CLOSED, ipcListener)
    }
  }
} satisfies WindowingAPI

export { windowingAPI }
