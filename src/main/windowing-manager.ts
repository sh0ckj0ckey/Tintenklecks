import { BrowserWindow, ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import {
  WindowId,
  WindowPosition,
  WindowState,
  WindowingIpcMessageType,
  WindowingOpenRequest,
  WindowingOpenResponse,
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
  WindowingGetStateRequest,
  WindowingGetStateResponse,
  WindowingStateChangedNotice,
  WindowingClosedNotice
} from '../shared/windowing-types'

interface ManagedWindowRecord {
  window: BrowserWindow
  openerId: WindowId
}

interface PendingWindowOpenRequest {
  resolve: (value: WindowingOpenResponse) => void
  reject: (reason?: unknown) => void
  timer: NodeJS.Timeout
  request: WindowingOpenRequest
}

export class WindowingManager {
  private readonly OPEN_READY_TIMEOUT = 30000
  private readonly DEFAULT_WINDOW_WIDTH = 720
  private readonly DEFAULT_WINDOW_HEIGHT = 480

  private readonly WindowingIpcMessage = {
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
    GET_WINDOW_STATE: 'windowing:get-window-state',
    WINDOW_STATE_CHANGED: 'windowing:window-state-changed',
    WINDOW_CLOSED: 'windowing:window-closed'
  } as const satisfies Record<string, WindowingIpcMessageType>

  private disposed = false

  private readonly mainWindow: BrowserWindow

  private readonly managedWindows = new Map<WindowId, ManagedWindowRecord>()

  private readonly pendingWindowOpenRequests = new Map<WindowId, PendingWindowOpenRequest>()

  private removeIpcListeners?: () => void

  constructor(mainWindow: BrowserWindow) {
    if (!mainWindow || mainWindow.isDestroyed()) {
      throw new Error('WindowingManager requires a valid mainWindow instance.')
    }

    this.mainWindow = mainWindow
    this.initIpcListeners()

    this.logInfo(`WindowingManager initialized. mainWindowId=${mainWindow.id}.`)
  }

  dispose(): void {
    if (this.disposed) {
      return
    }
    this.disposed = true

    this.logInfo(
      `WindowingManager disposing. managedWindowCount=${this.managedWindows.size}, pendingOpenCount=${this.pendingWindowOpenRequests.size}.`
    )

    this.removeIpcListeners?.()
    this.removeIpcListeners = undefined

    this.pendingWindowOpenRequests.forEach((pending) => {
      clearTimeout(pending.timer)
      pending.reject(new Error('WindowingManager was disposed.'))
    })
    this.pendingWindowOpenRequests.clear()

    Array.from(this.managedWindows.values()).forEach((record) => {
      try {
        if (!record.window.isDestroyed()) {
          record.window.destroy()
        }
      } catch (error) {
        this.logError(`Failed to destroy managed window, id=${record.window.id}.`, error)
      }
    })

    this.managedWindows.clear()

    this.logInfo('WindowingManager disposed.')
  }

  private initIpcListeners(): void {
    if (this.removeIpcListeners) {
      throw new Error('WindowingManager IPC listeners have already been initialized.')
    }

    const handleWindowingOpenRequested = async (e: IpcMainInvokeEvent, request: WindowingOpenRequest): Promise<WindowingOpenResponse> => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window opener.')
        }

        return await this.openWindow(sourceWindow.id, request)
      } catch (error) {
        this.logError(`Failed to open managed window, size=${request?.width}x${request?.height}, parentId=${request?.parentId}.`, error)
        throw error
      }
    }

    const onWindowingReady = (e: IpcMainEvent): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow || sourceWindow.id === this.mainWindow.id) {
          throw new Error('Invalid window sender.')
        }

        const pending = this.pendingWindowOpenRequests.get(sourceWindow.id)
        if (!pending) {
          throw new Error('Window is not pending open.')
        }

        clearTimeout(pending.timer)
        this.pendingWindowOpenRequests.delete(sourceWindow.id)

        if (pending.request.showInactive) {
          sourceWindow.showInactive()
        } else {
          sourceWindow.show()
        }

        this.logInfo(`Managed window ready, id=${sourceWindow.id}.`)

        pending.resolve({ id: sourceWindow.id })
      } catch (error) {
        this.logError('Failed to handle window ready notice.', error)
      }
    }

    const onWindowingUpdateRequested = (_: IpcMainEvent, request: WindowingUpdateRequest): void => {
      try {
        const targetWindow = this.resolveTargetWindow(request.targetId)
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        const notice: WindowingUpdateNotice = {
          component: request.component,
          props: request.props
        }

        this.sendToWindow(targetWindow, this.WindowingIpcMessage.UPDATE, notice)
      } catch (error) {
        this.logError(`Failed to update managed window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingEventRequested = (e: IpcMainEvent, request: WindowingEventRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow /* || sourceWin.isDestroyed() */) {
          throw new Error('Invalid window sender.')
        }

        let targetWindow: BrowserWindow | undefined
        let fromId: WindowId | undefined

        if (request.targetId !== undefined) {
          targetWindow = this.resolveTargetWindow(request.targetId)
          if (!targetWindow) {
            throw new Error('Invalid window target.')
          }

          const targetRecord = this.managedWindows.get(request.targetId)
          fromId = sourceWindow.id === targetRecord?.openerId ? undefined : targetWindow.id
        } else {
          const sourceRecord = this.managedWindows.get(sourceWindow.id)
          if (!sourceRecord) {
            throw new Error('Source window has no opener.')
          }

          targetWindow = this.resolveTargetWindow(sourceRecord.openerId)
          if (!targetWindow) {
            throw new Error('Invalid opener window.')
          }

          fromId = sourceWindow.id
        }

        const notice: WindowingEventNotice = {
          fromId: fromId,
          action: request.action,
          payload: request.payload
        }

        this.sendToWindow(targetWindow, this.WindowingIpcMessage.EVENT, notice)
      } catch (error) {
        this.logError(`Failed to forward window event, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingCloseRequested = (e: IpcMainEvent, request: WindowingCloseRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.closeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to close window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingActivateRequested = (e: IpcMainEvent, request: WindowingActivateRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.activateWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to activate window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingMinimizeRequested = (e: IpcMainEvent, request: WindowingMinimizeRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.minimizeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to minimize window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingMaximizeRequested = (e: IpcMainEvent, request: WindowingMaximizeRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.minimizeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to minimize window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingRestoreRequested = (e: IpcMainEvent, request: WindowingRestoreRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.restoreWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to maximize window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingResizeRequested = (e: IpcMainEvent, request: WindowingResizeRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.resizeWindow(targetWindow, request.width, request.height)
      } catch (error) {
        this.logError(`Failed to resize window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingMoveRequested = (e: IpcMainEvent, request: WindowingMoveRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.moveWindow(targetWindow, request.position)
      } catch (error) {
        this.logError(`Failed to move Window, id=${request?.targetId}.`, error)
      }
    }

    const onWindowingTopmostRequested = (e: IpcMainEvent, request: WindowingTopmostRequest): void => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.setWindowTopmost(targetWindow, request.isTopmost)
      } catch (error) {
        this.logError(`Failed to set window topmost state, id=${request?.targetId}.`, error)
      }
    }

    const handleWindowingStateRequested = (e: IpcMainInvokeEvent, request: WindowingGetStateRequest): WindowingGetStateResponse => {
      try {
        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        const state = this.getWindowState(targetWindow)
        return {
          state: state
        }
      } catch (error) {
        this.logError(`Failed to get window state, id=${request?.targetId}.`, error)
        return {
          state: null
        }
      }
    }

    ipcMain.handle(this.WindowingIpcMessage.OPEN, handleWindowingOpenRequested)
    ipcMain.on(this.WindowingIpcMessage.READY, onWindowingReady)
    ipcMain.on(this.WindowingIpcMessage.UPDATE, onWindowingUpdateRequested)
    ipcMain.on(this.WindowingIpcMessage.EVENT, onWindowingEventRequested)
    ipcMain.on(this.WindowingIpcMessage.CLOSE, onWindowingCloseRequested)
    ipcMain.on(this.WindowingIpcMessage.ACTIVATE, onWindowingActivateRequested)
    ipcMain.on(this.WindowingIpcMessage.MINIMIZE, onWindowingMinimizeRequested)
    ipcMain.on(this.WindowingIpcMessage.MAXIMIZE, onWindowingMaximizeRequested)
    ipcMain.on(this.WindowingIpcMessage.RESTORE, onWindowingRestoreRequested)
    ipcMain.on(this.WindowingIpcMessage.RESIZE, onWindowingResizeRequested)
    ipcMain.on(this.WindowingIpcMessage.MOVE, onWindowingMoveRequested)
    ipcMain.on(this.WindowingIpcMessage.TOPMOST, onWindowingTopmostRequested)
    ipcMain.handle(this.WindowingIpcMessage.GET_WINDOW_STATE, handleWindowingStateRequested)

    this.removeIpcListeners = () => {
      ipcMain.removeHandler(this.WindowingIpcMessage.OPEN)
      ipcMain.removeListener(this.WindowingIpcMessage.READY, onWindowingReady)
      ipcMain.removeListener(this.WindowingIpcMessage.UPDATE, onWindowingUpdateRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.EVENT, onWindowingEventRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.CLOSE, onWindowingCloseRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.ACTIVATE, onWindowingActivateRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.MINIMIZE, onWindowingMinimizeRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.MAXIMIZE, onWindowingMaximizeRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.RESTORE, onWindowingRestoreRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.RESIZE, onWindowingResizeRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.MOVE, onWindowingMoveRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.TOPMOST, onWindowingTopmostRequested)
      ipcMain.removeHandler(this.WindowingIpcMessage.GET_WINDOW_STATE)
    }
  }

  private resolveSourceWindow(e: IpcMainEvent | IpcMainInvokeEvent): BrowserWindow | undefined {
    const window = BrowserWindow.fromWebContents(e.sender)

    if (!window || window.isDestroyed()) {
      return undefined
    }

    if (window.id === this.mainWindow.id) {
      return window
    }

    if (this.managedWindows.has(window.id)) {
      return window
    }

    return undefined
  }

  private resolveTargetWindow(targetId: WindowId): BrowserWindow | undefined {
    if (targetId === this.mainWindow.id) {
      return this.mainWindow.isDestroyed() ? undefined : this.mainWindow
    }

    const record = this.managedWindows.get(targetId)
    const window = record?.window

    if (!window || window.isDestroyed()) {
      return undefined
    }

    return window
  }

  private openWindow(openerId: WindowId, request: WindowingOpenRequest): Promise<WindowingOpenResponse> {
    if (this.disposed) {
      throw new Error('WindowingManager was disposed.')
    }

    if (!request) {
      throw new Error('Invalid Window open options.')
    }

    const window = this.createBrowserWindow(openerId, request)

    this.managedWindows.set(window.id, { window: window, openerId: openerId })

    this.logInfo(
      `Managed window created, id=${window.id}, openerId=${openerId}, size=${request.width}x${request.height}, parentId=${request.parentId}.`
    )

    this.positionWindow(window, request.position ?? 'center-screen')
    this.bindWindowClosedListener(window)
    this.bindWindowStateListeners(window)

    const openResult = new Promise<WindowingOpenResponse>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingWindowOpenRequests.delete(window.id)

        try {
          if (!window.isDestroyed()) {
            window.destroy()
          }
        } catch (error) {
          this.logError(`Failed to destroy timed out window, id=${window.id}.`, error)
        }

        reject(new Error(`Window did not become ready in time.`))
      }, this.OPEN_READY_TIMEOUT)

      const pendingWindowOpenRequest: PendingWindowOpenRequest = {
        resolve: resolve,
        reject: reject,
        timer: timer,
        request: request
      }

      this.pendingWindowOpenRequests.set(window.id, pendingWindowOpenRequest)
    })

    const onLoadFailed = (error: unknown): void => {
      const pending = this.pendingWindowOpenRequests.get(window.id)
      if (!pending) {
        return
      }

      clearTimeout(pending.timer)
      this.pendingWindowOpenRequests.delete(window.id)
      pending.reject(error)

      try {
        if (!window.isDestroyed()) {
          window.destroy()
        }
      } catch (destroyError) {
        this.logError(`Failed to destroy load failed window, id=${window.id}.`, destroyError)
      }
    }

    const search = '?type=windowing-host'

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/base.html${search}`).catch(onLoadFailed)
    } else {
      window.loadFile(join(__dirname, '../renderer/base.html'), { search: search }).catch(onLoadFailed)
    }

    return openResult
  }

  private closeWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    win.close()
  }

  private activateWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    if (win.isMinimized()) {
      win.restore()
    }
    if (!win.isVisible()) {
      win.show()
    }
    win.focus()
  }

  private minimizeWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    win.minimize()
  }

  private maximizeWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    win.maximize()
  }

  private restoreWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    if (win.isMinimized() || win.isMaximized()) {
      win.restore()
    }
    if (!win.isVisible()) {
      win.show()
    }
  }

  private resizeWindow(win: BrowserWindow | null | undefined, width: number, height: number): void {
    if (!win || win.isDestroyed()) {
      return
    }

    const nextWidth = Math.round(width)
    const nextHeight = Math.round(height)

    if (!Number.isFinite(nextWidth) || !Number.isFinite(nextHeight) || nextWidth <= 0 || nextHeight <= 0) {
      return
    }

    win.setSize(nextWidth, nextHeight)
  }

  private moveWindow(win: BrowserWindow | null | undefined, position: WindowPosition): void {
    if (!win || win.isDestroyed()) {
      return
    }

    this.positionWindow(win, position)
  }

  private setWindowTopmost(win: BrowserWindow | null | undefined, isTopmost: boolean): void {
    if (!win || win.isDestroyed()) {
      return
    }

    win.setAlwaysOnTop(isTopmost)
  }

  private getWindowState(win: BrowserWindow | null | undefined): WindowState | null {
    if (!win || win.isDestroyed()) {
      return null
    }

    return {
      bounds: win.getBounds(),
      minimized: win.isMinimized(),
      maximized: win.isMaximized(),
      fullscreen: win.isFullScreen(),
      visible: win.isVisible(),
      alwaysOnTop: win.isAlwaysOnTop(),
      focused: win.isFocused()
    }
  }

  private createBrowserWindow(openerId: WindowId, request: WindowingOpenRequest): BrowserWindow {
    let parentWindow: BrowserWindow | undefined = undefined

    if (request.parentId !== null) {
      const parentId: number = request.parentId === undefined ? openerId : request.parentId
      parentWindow = this.resolveTargetWindow(parentId)

      if (!parentWindow || parentWindow.isDestroyed()) {
        throw new Error(`Parent window ${parentId} does not exist.`)
      }
    }

    if (request.modal && !parentWindow) {
      throw new Error('Modal window requires a valid parent window.')
    }

    const win = new BrowserWindow({
      width: request.width ?? this.DEFAULT_WINDOW_WIDTH,
      height: request.height ?? this.DEFAULT_WINDOW_HEIGHT,
      show: false,
      frame: false,
      skipTaskbar: request.skipTaskbar ?? false,
      resizable: request.resizable ?? false,
      alwaysOnTop: request.alwaysOnTop ?? false,
      modal: request.modal ?? false,
      parent: parentWindow,
      webPreferences: {
        preload: join(__dirname, '../preload/windowing-preload.js'),
        sandbox: false,
        contextIsolation: false,
        nodeIntegration: false
      }
    })

    win.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' }
    })

    return win
  }

  private positionWindow(win: BrowserWindow, position?: WindowPosition): void {
    if (!win || win.isDestroyed()) {
      return
    }

    if (!position) {
      return
    }

    if (typeof position === 'object') {
      const x = Math.round(position.x)
      const y = Math.round(position.y)
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return
      }

      win.setPosition(x, y)
      return
    }

    switch (position) {
      case 'center-screen': {
        win.center()
        return
      }
      case 'center-parent': {
        const parentWindow = win.getParentWindow()
        if (!parentWindow || parentWindow.isDestroyed()) {
          this.positionWindow(win, 'center-screen')
          return
        }

        const parentBounds = parentWindow.getBounds()
        const [windowWidth, windowHeight] = win.getSize()
        win.setPosition(
          Math.round(parentBounds.x + (parentBounds.width - windowWidth) / 2),
          Math.round(parentBounds.y + (parentBounds.height - windowHeight) / 2)
        )
        return
      }
    }
  }

  private sendToWindow(win: BrowserWindow | null | undefined, channel: WindowingIpcMessageType, payload: unknown): void {
    if (!win || win.isDestroyed()) {
      return
    }

    try {
      win.webContents.send(channel, payload)
    } catch (error) {
      this.logError(`Failed to send IPC message "${channel}", targetWindowId=${win.id}.`, error)
    }
  }

  private bindWindowClosedListener(win: BrowserWindow): void {
    const windowId = win.id

    win.once('closed', () => {
      try {
        this.logInfo(`Managed window closed, id=${windowId}.`)

        const pending = this.pendingWindowOpenRequests.get(windowId)
        if (pending) {
          clearTimeout(pending.timer)
          this.pendingWindowOpenRequests.delete(windowId)
          pending.reject(new Error(`Window was closed before ready, id=${windowId}.`))
        }

        const record = this.managedWindows.get(windowId)
        this.managedWindows.delete(windowId)

        if (this.disposed) {
          return
        }

        if (!record) {
          return
        }

        const notice: WindowingClosedNotice = {
          id: windowId
        }

        this.sendToWindow(this.resolveTargetWindow(record.openerId), this.WindowingIpcMessage.WINDOW_CLOSED, notice)
      } catch (error) {
        this.logError('Failed to handle window closed event.', error)
      }
    })
  }

  private bindWindowStateListeners(win: BrowserWindow): void {
    const notify = (): void => {
      try {
        if (!win || win.isDestroyed()) {
          return
        }

        const state = this.getWindowState(win)

        if (!state) {
          return
        }

        const notice: WindowingStateChangedNotice = {
          state
        }

        this.sendToWindow(win, this.WindowingIpcMessage.WINDOW_STATE_CHANGED, notice)
      } catch (error) {
        this.logError(`Failed to notify window state changed, id=${win.id}.`, error)
      }
    }

    win.on('focus', notify)
    win.on('blur', notify)
    win.on('minimize', notify)
    win.on('maximize', notify)
    win.on('unmaximize', notify)
    win.on('restore', notify)
    win.on('show', notify)
    win.on('hide', notify)
    // win.on('move', notify)
    // win.on('resize', notify)
    win.on('always-on-top-changed', notify)
    win.on('enter-full-screen', notify)
    win.on('leave-full-screen', notify)
  }

  private logInfo(message: string): void {
    console.info('[WindowingManager]', message)
  }

  private logError(message: string, error: unknown): void {
    console.error('[WindowingManager]', message, error)
  }
}
