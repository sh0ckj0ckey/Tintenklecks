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
} from './windowing-types'

export type WindowingUnsubscribe = () => void

export interface WindowingAPI {
  open(request: WindowingOpenRequest): Promise<WindowingOpenResponse>

  ready(notice: WindowingReadyNotice): void

  update(request: WindowingUpdateRequest): void

  event<T = unknown>(request: WindowingEventRequest<T>): void

  close(request: WindowingCloseRequest): void

  activate(request: WindowingActivateRequest): void

  minimize(request: WindowingMinimizeRequest): void

  maximize(request: WindowingMaximizeRequest): void

  restore(request: WindowingRestoreRequest): void

  resize(request: WindowingResizeRequest): void

  move(request: WindowingMoveRequest): void

  setTopmost(request: WindowingTopmostRequest): void

  enterFullscreen(request: WindowingEnterFullscreenRequest): void

  exitFullscreen(request: WindowingExitFullscreenRequest): void

  getWindowState(request: WindowingGetStateRequest): Promise<WindowingGetStateResponse>

  onUpdate(callback: (notice: WindowingUpdateNotice) => void): WindowingUnsubscribe

  onEvent<T = unknown>(callback: (notice: WindowingEventNotice<T>) => void): WindowingUnsubscribe

  onStateChanged(callback: (notice: WindowingStateChangedNotice) => void): WindowingUnsubscribe

  onClosed(callback: (notice: WindowingClosedNotice) => void): WindowingUnsubscribe
}
