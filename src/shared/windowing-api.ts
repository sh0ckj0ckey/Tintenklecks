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
} from './windowing-types'

export type WindowingUnsubscribe = () => void

export interface WindowingAPI {
  open(request: WindowingOpenRequest): Promise<WindowingOpenResponse>

  ready(notification: WindowingReadyNotification): void

  update(request: WindowingUpdateRequest): void

  sendEvent<T = unknown>(request: WindowingEventRequest<T>): void

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

  onUpdate(listener: (notification: WindowingUpdateNotification) => void): WindowingUnsubscribe

  onEvent<T = unknown>(listener: (notification: WindowingEventNotification<T>) => void): WindowingUnsubscribe

  onStateChanged(listener: (notification: WindowingStateChangedNotification) => void): WindowingUnsubscribe

  onClosed(listener: (notification: WindowingClosedNotification) => void): WindowingUnsubscribe
}
