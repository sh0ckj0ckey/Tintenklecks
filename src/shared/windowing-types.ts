export type WindowingIpcMessageType =
  /** Request the main process to create a managed window */
  | 'windowing:open'

  /** Notify the main process that the window host is ready */
  | 'windowing:ready'

  /** Request the main process to update the content component and props of a managed window */
  | 'windowing:update'

  /** Request the main process to forward an event to a window */
  | 'windowing:event'

  /** Request the main process to close a window */
  | 'windowing:close'

  /** Request the main process to activate a window */
  | 'windowing:activate'

  /** Request the main process to minimize a window */
  | 'windowing:minimize'

  /** Request the main process to maximize a window */
  | 'windowing:maximize'

  /** Request the main process to restore a window */
  | 'windowing:restore'

  /** Request the main process to resize a window */
  | 'windowing:resize'

  /** Request the main process to move a window */
  | 'windowing:move'

  /** Request the main process to set whether a window is always on top */
  | 'windowing:topmost'

  /** Request the main process to query a window state */
  | 'windowing:get-window-state'

  /** Notify a window that its state has changed */
  | 'windowing:window-state-changed'

  /** Notify a window that one of its opened windows has been closed */
  | 'windowing:window-closed'

/**
 * Window id, mapped to Electron BrowserWindow.id
 */
export type WindowId = number

/**
 * Props passed to a window content component
 */
export type WindowContentProps = Record<string, unknown>

/**
 * Window position target
 *
 * - 'center-screen': center on the screen work area
 * - 'center-parent': center relative to the parent window; falls back to screen center if no parent exists
 * - { x, y }: absolute top-left position in screen coordinates
 */
export type WindowPosition = 'center-screen' | 'center-parent' | { x: number; y: number }

/**
 * Window bounds
 */
export interface WindowBounds {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Window state
 */
export interface WindowState {
  bounds: WindowBounds
  minimized: boolean
  maximized: boolean
  fullscreen: boolean
  visible: boolean
  alwaysOnTop: boolean
  focused: boolean
}

/**
 * Request the main process to open a managed window
 */
export interface WindowingOpenRequest {
  /** Window width, default is 540px */
  width?: number

  /** Window height, default is 280px */
  height?: number

  /** Hide the window from the taskbar, default is false */
  skipTaskbar?: boolean

  /** Allow resizing, default is false */
  resizable?: boolean

  /** Keep the window always on top, default is false */
  alwaysOnTop?: boolean

  /** Open as a modal window, default is false; a valid parent window is required */
  modal?: boolean

  /** Parent window id; defaults to the opener window; null means no parent window */
  parentId?: WindowId | null

  /** Window position, default is center-screen */
  position?: WindowPosition

  /** Show the window without taking focus, default is false */
  showInactive?: boolean
}

/**
 * Result returned after the managed window is created and ready
 */
export interface WindowingOpenResponse {
  /** Id of the created window */
  id: WindowId
}

/**
 * Notify the main process that the window host is ready
 *
 * The main process resolves the sender window from event.sender,
 * so this notice does not need to include a window id.
 */
export type WindowingReadyNotice = Record<string, never>

/**
 * Request the main process to update the content component and props of a managed window
 */
export interface WindowingUpdateRequest {
  /** Target window id */
  targetId: WindowId

  /** Component name or path */
  component?: string

  /** Props passed to the target component */
  props?: WindowContentProps
}

/**
 * Notice sent from the main process to update a window host
 */
export interface WindowingUpdateNotice {
  /** Component name or path */
  component?: string

  /** Props passed to the target component */
  props?: WindowContentProps
}

/**
 * Request the main process to forward an event to a window
 */
export interface WindowingEventRequest<T = unknown> {
  /**
   * Target window id.
   * When omitted, the event is sent to the opener of the source window.
   */
  targetId?: WindowId

  /** Event name */
  action: string

  /** Event payload */
  payload?: T
}

/**
 * Notice sent by the main process when a forwarded event is delivered
 */
export interface WindowingEventNotice<T = unknown> {
  /**
   * Source window id.
   * When omitted, it means the event came from the opener of the receiving window.
   */
  fromId?: WindowId

  /** Event name */
  action: string

  /** Event payload */
  payload?: T
}

/**
 * Request the main process to close a window
 */
export interface WindowingCloseRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId
}

/**
 * Request the main process to activate a window
 */
export interface WindowingActivateRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId
}

/**
 * Request the main process to minimize a window
 */
export interface WindowingMinimizeRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId
}

/**
 * Request the main process to maximize a window
 */
export interface WindowingMaximizeRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId
}

/**
 * Request the main process to restore a window
 */
export interface WindowingRestoreRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId
}

/**
 * Request the main process to resize a window
 */
export interface WindowingResizeRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId

  /** Target width */
  width: number

  /** Target height */
  height: number
}

/**
 * Request the main process to move a window
 */
export interface WindowingMoveRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId

  /** Target position */
  position: WindowPosition
}

/**
 * Request the main process to set whether a window is always on top
 */
export interface WindowingTopmostRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId

  /** Whether the window is always on top */
  isTopmost: boolean
}

/**
 * Request the main process to query a window state
 */
export interface WindowingGetStateRequest {
  /**
   * Target window id.
   * When omitted, the request applies to the source window itself.
   */
  targetId?: WindowId
}

/**
 * Response returned by a window state query
 */
export interface WindowingGetStateResponse {
  state: WindowState | null
}

/**
 * Notice sent by the main process when a window state changes
 */
export interface WindowingStateChangedNotice extends WindowState {}

/**
 * Notice sent by the main process when one of a window's opened windows is closed
 */
export interface WindowingClosedNotice {
  /** Closed window id */
  id: WindowId
}
