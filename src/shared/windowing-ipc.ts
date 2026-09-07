import type { WindowingIpcMessageType } from './windowing-types'

export const windowingIpcMessage = {
  OPEN: 'windowing:open',
  READY: 'windowing:ready',
  UPDATE: 'windowing:update',
  EVENT: 'windowing:event',
  CLOSE: 'windowing:close',
  ACTIVATE: 'windowing:activate',
  MINIMIZE: 'windowing:minimize',
  MAXIMIZE: 'windowing:maximize',
  RESTORE: 'windowing:restore',
  RESIZE: 'windowing:resize',
  MOVE: 'windowing:move',
  TOPMOST: 'windowing:topmost',
  ENTER_FULLSCREEN: 'windowing:enter-fullscreen',
  EXIT_FULLSCREEN: 'windowing:exit-fullscreen',
  GET_WINDOW_STATE: 'windowing:get-window-state',
  WINDOW_STATE_CHANGED: 'windowing:window-state-changed',
  WINDOW_CLOSED: 'windowing:window-closed'
} as const satisfies Record<string, WindowingIpcMessageType>
