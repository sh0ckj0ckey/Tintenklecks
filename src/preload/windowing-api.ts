import { ipcRenderer, type IpcRendererEvent } from 'electron'
import { windowingIpcMessage } from '../shared/windowing-ipc'
import type { WindowingAPI, WindowingUnsubscribe } from '../shared/windowing-api'
import type {
  WindowingOpenRequest,
  WindowingOpenResponse,
  WindowingReadyNotice,
  WindowingUpdateRequest,
  WindowingUpdateNotice,
  WindowingEventRequest,
  WindowingEventNotice,
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
  WindowingStateChangedNotice,
  WindowingClosedNotice
} from '../shared/windowing-types'

const windowingAPI = {
  open(request: WindowingOpenRequest): Promise<WindowingOpenResponse> {
    return ipcRenderer.invoke(windowingIpcMessage.OPEN, request)
  },

  ready(notice: WindowingReadyNotice): void {
    ipcRenderer.send(windowingIpcMessage.READY, notice)
  },

  update(request: WindowingUpdateRequest): void {
    ipcRenderer.send(windowingIpcMessage.UPDATE, request)
  },

  event<T = unknown>(request: WindowingEventRequest<T>): void {
    ipcRenderer.send(windowingIpcMessage.EVENT, request)
  },

  close(request: WindowingCloseRequest): void {
    ipcRenderer.send(windowingIpcMessage.CLOSE, request)
  },

  activate(request: WindowingActivateRequest): void {
    ipcRenderer.send(windowingIpcMessage.ACTIVATE, request)
  },

  minimize(request: WindowingMinimizeRequest): void {
    ipcRenderer.send(windowingIpcMessage.MINIMIZE, request)
  },

  maximize(request: WindowingMaximizeRequest): void {
    ipcRenderer.send(windowingIpcMessage.MAXIMIZE, request)
  },

  restore(request: WindowingRestoreRequest): void {
    ipcRenderer.send(windowingIpcMessage.RESTORE, request)
  },

  resize(request: WindowingResizeRequest): void {
    ipcRenderer.send(windowingIpcMessage.RESIZE, request)
  },

  move(request: WindowingMoveRequest): void {
    ipcRenderer.send(windowingIpcMessage.MOVE, request)
  },

  setTopmost(request: WindowingTopmostRequest): void {
    ipcRenderer.send(windowingIpcMessage.TOPMOST, request)
  },

  enterFullscreen(request: WindowingEnterFullscreenRequest): void {
    ipcRenderer.send(windowingIpcMessage.ENTER_FULLSCREEN, request)
  },

  exitFullscreen(request: WindowingExitFullscreenRequest): void {
    ipcRenderer.send(windowingIpcMessage.EXIT_FULLSCREEN, request)
  },

  getWindowState(request: WindowingGetStateRequest): Promise<WindowingGetStateResponse> {
    return ipcRenderer.invoke(windowingIpcMessage.GET_WINDOW_STATE, request)
  },

  onUpdate(callback: (notice: WindowingUpdateNotice) => void): WindowingUnsubscribe {
    const listener = (_event: IpcRendererEvent, notice: WindowingUpdateNotice): void => {
      callback(notice)
    }

    ipcRenderer.on(windowingIpcMessage.UPDATE, listener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcMessage.UPDATE, listener)
    }
  },

  onEvent<T = unknown>(callback: (notice: WindowingEventNotice<T>) => void): WindowingUnsubscribe {
    const listener = (_event: IpcRendererEvent, notice: WindowingEventNotice<T>): void => {
      callback(notice)
    }

    ipcRenderer.on(windowingIpcMessage.EVENT, listener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcMessage.EVENT, listener)
    }
  },

  onStateChanged(callback: (notice: WindowingStateChangedNotice) => void): WindowingUnsubscribe {
    const listener = (_event: IpcRendererEvent, notice: WindowingStateChangedNotice): void => {
      callback(notice)
    }

    ipcRenderer.on(windowingIpcMessage.WINDOW_STATE_CHANGED, listener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcMessage.WINDOW_STATE_CHANGED, listener)
    }
  },

  onClosed(callback: (notice: WindowingClosedNotice) => void): WindowingUnsubscribe {
    const listener = (_event: IpcRendererEvent, notice: WindowingClosedNotice): void => {
      callback(notice)
    }

    ipcRenderer.on(windowingIpcMessage.WINDOW_CLOSED, listener)

    return (): void => {
      ipcRenderer.removeListener(windowingIpcMessage.WINDOW_CLOSED, listener)
    }
  }
} satisfies WindowingAPI

export { windowingAPI }
