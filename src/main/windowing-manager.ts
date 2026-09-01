import { shell, BrowserWindow, ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import type {
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
  WindowingEnterFullscreenRequest,
  WindowingExitFullscreenRequest,
  WindowingGetStateRequest,
  WindowingGetStateResponse,
  WindowingStateChangedNotice,
  WindowingClosedNotice
} from '../shared/windowing-types'
import icon from '../../resources/icon.png?asset'

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
    ENTER_FULLSCREEN: 'windowing:enter-fullscreen',
    EXIT_FULLSCREEN: 'windowing:exit-fullscreen',
    GET_WINDOW_STATE: 'windowing:get-window-state',
    WINDOW_STATE_CHANGED: 'windowing:window-state-changed',
    WINDOW_CLOSED: 'windowing:window-closed'
  } as const satisfies Record<string, WindowingIpcMessageType>

  private disposed = false

  private readonly mainWindow: BrowserWindow

  private readonly managedWindows = new Map<WindowId, ManagedWindowRecord>()

  private readonly pendingWindowOpenRequests = new Map<WindowId, PendingWindowOpenRequest>()

  private removeListeners?: () => void

  constructor(mainWindow: BrowserWindow) {
    if (!mainWindow || mainWindow.isDestroyed()) {
      throw new Error('WindowingManager requires a valid mainWindow instance.')
    }

    this.mainWindow = mainWindow

    const removeMainWindowClosedListener = this.bindWindowClosedListener(this.mainWindow)
    const removeMainWindowStateListener = this.bindWindowStateListeners(this.mainWindow)
    const removeIpcListeners = this.initIpcListeners()

    this.removeListeners = () => {
      removeMainWindowClosedListener()
      removeMainWindowStateListener()
      removeIpcListeners()
    }

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

    this.removeListeners?.()
    this.removeListeners = undefined

    this.pendingWindowOpenRequests.forEach((pending) => {
      clearTimeout(pending.timer)
      pending.reject(new Error('WindowingManager has been disposed.'))
    })
    this.pendingWindowOpenRequests.clear()

    const windows = Array.from(this.managedWindows.values())
    this.managedWindows.clear()
    windows.forEach((record) => {
      try {
        if (!record.window.isDestroyed()) {
          record.window.destroy()
        }
      } catch (error) {
        this.logError(`Failed to destroy managed window, id=${record.window.id}.`, error)
      }
    })

    this.logInfo('WindowingManager disposed.')
  }

  private initIpcListeners(): () => void {
    if (this.disposed) {
      throw new Error('WindowingManager has been disposed.')
    }

    const handleWindowingOpenRequested = async (e: IpcMainInvokeEvent, request: WindowingOpenRequest): Promise<WindowingOpenResponse> => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        return await this.openWindow(sourceWindow.id, request)
      } catch (error) {
        this.logError(`Failed to open managed window, size=${request?.width}x${request?.height}, parentId=${request?.parentId}.`, error)
        throw error
      }
    }

    const onWindowingReady = (e: IpcMainEvent): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow || sourceWindow.id === this.mainWindow.id) {
          throw new Error('Invalid window source.')
        }

        const pending = this.pendingWindowOpenRequests.get(sourceWindow.id)
        if (!pending) {
          throw new Error('Window is not pending open.')
        }

        this.pendingWindowOpenRequests.delete(sourceWindow.id)
        clearTimeout(pending.timer)

        try {
          if (pending.request.showInactive) {
            sourceWindow.showInactive()
          } else {
            sourceWindow.show()
          }
        } catch (error) {
          pending.reject(error)

          try {
          if (!sourceWindow.isDestroyed()) {
            sourceWindow.destroy()
            }
          } catch (error) {
            this.logError(`Failed to destroy window after show failure, id=${sourceWindow.id}.`, error)
          }

          throw error
        }

        pending.resolve({ id: sourceWindow.id })

        this.logInfo(`Managed window ready, id=${sourceWindow.id}.`)
      } catch (error) {
        this.logError('Failed to handle window ready notice.', error)
      }
    }

    const onWindowingUpdateRequested = (e: IpcMainEvent, request: WindowingUpdateRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = this.resolveTargetWindow(request.targetId)
        if (!targetWindow || targetWindow.id === this.mainWindow.id) {
          throw new Error('Invalid window target.')
        }

        const notice: WindowingUpdateNotice = {
          component: request.component,
          props: request.props
        }

        this.sendToWindow(targetWindow, this.WindowingIpcMessage.UPDATE, notice)
      } catch (error) {
        this.logError(`Failed to update managed window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingEventRequested = (e: IpcMainEvent, request: WindowingEventRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        let targetWindow: BrowserWindow | undefined
        let fromId: WindowId | undefined

        if (request.targetId !== undefined) {
          targetWindow = this.resolveTargetWindow(request.targetId)
          if (!targetWindow) {
            throw new Error('Invalid window target.')
          }

          const targetRecord = this.managedWindows.get(targetWindow.id)
          fromId = sourceWindow.id === targetRecord?.openerId ? undefined : sourceWindow.id
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
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to close window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingActivateRequested = (e: IpcMainEvent, request: WindowingActivateRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to activate window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingMinimizeRequested = (e: IpcMainEvent, request: WindowingMinimizeRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to minimize window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingMaximizeRequested = (e: IpcMainEvent, request: WindowingMaximizeRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.maximizeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to maximize window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingRestoreRequested = (e: IpcMainEvent, request: WindowingRestoreRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to restore window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingResizeRequested = (e: IpcMainEvent, request: WindowingResizeRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to resize window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingMoveRequested = (e: IpcMainEvent, request: WindowingMoveRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to move window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingTopmostRequested = (e: IpcMainEvent, request: WindowingTopmostRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to set window topmost state, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingEnterFullscreenRequested = (e: IpcMainEvent, request: WindowingEnterFullscreenRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.enterFullscreenWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to enter fullscreen window, targetId=${request?.targetId}.`, error)
      }
    }

    const onWindowingExitFullscreenRequested = (e: IpcMainEvent, request: WindowingExitFullscreenRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(e)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = typeof request?.targetId === 'number' ? this.resolveTargetWindow(request.targetId) : sourceWindow
        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.exitFullscreenWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to exit fullscreen window, targetId=${request?.targetId}.`, error)
      }
    }

    const handleWindowingStateRequested = (e: IpcMainInvokeEvent, request: WindowingGetStateRequest): WindowingGetStateResponse => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

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
        this.logError(`Failed to get window state, targetId=${request?.targetId}.`, error)
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
    ipcMain.on(this.WindowingIpcMessage.ENTER_FULLSCREEN, onWindowingEnterFullscreenRequested)
    ipcMain.on(this.WindowingIpcMessage.EXIT_FULLSCREEN, onWindowingExitFullscreenRequested)
    ipcMain.handle(this.WindowingIpcMessage.GET_WINDOW_STATE, handleWindowingStateRequested)

    return (): void => {
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
      ipcMain.removeListener(this.WindowingIpcMessage.ENTER_FULLSCREEN, onWindowingEnterFullscreenRequested)
      ipcMain.removeListener(this.WindowingIpcMessage.EXIT_FULLSCREEN, onWindowingExitFullscreenRequested)
      ipcMain.removeHandler(this.WindowingIpcMessage.GET_WINDOW_STATE)
    }
  }

  private bindWindowClosedListener(win: BrowserWindow): () => void {
    if (!win || win.isDestroyed()) {
      return (): void => {}
    }

    const windowId = win.id

    const onClosed = (): void => {
      try {
        this.logInfo(`Window closed, id=${windowId}.`)

        const pending = this.pendingWindowOpenRequests.get(windowId)
        if (pending) {
          clearTimeout(pending.timer)
          this.pendingWindowOpenRequests.delete(windowId)
          pending.reject(new Error(`Window was closed before ready, id=${windowId}.`))
        }

        const record = this.managedWindows.get(windowId)
        this.managedWindows.delete(windowId)
        if (!record) {
          return
        }

        const notice: WindowingClosedNotice = {
          id: windowId
        }

        this.sendToWindow(this.resolveTargetWindow(record.openerId), this.WindowingIpcMessage.WINDOW_CLOSED, notice)
      } catch (error) {
        this.logError(`Failed to handle window closed, id=${windowId}.`, error)
      }
    }

    win.once('closed', onClosed)
    return (): void => {
      win.removeListener('closed', onClosed)
    }
  }

  private bindWindowStateListeners(win: BrowserWindow): () => void {
    if (!win || win.isDestroyed()) {
      return (): void => {}
    }

    const onStateChanged = (): void => {
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
        this.logError(`Failed to handle window state changed, id=${win.id}.`, error)
      }
    }

    win.on('moved', onStateChanged)
    win.on('resized', onStateChanged)
    win.on('focus', onStateChanged)
    win.on('blur', onStateChanged)
    win.on('minimize', onStateChanged)
    win.on('maximize', onStateChanged)
    win.on('unmaximize', onStateChanged)
    win.on('restore', onStateChanged)
    win.on('show', onStateChanged)
    win.on('hide', onStateChanged)
    win.on('always-on-top-changed', onStateChanged)
    win.on('enter-full-screen', onStateChanged)
    win.on('leave-full-screen', onStateChanged)

    return (): void => {
      win.removeListener('moved', onStateChanged)
      win.removeListener('resized', onStateChanged)
      win.removeListener('focus', onStateChanged)
      win.removeListener('blur', onStateChanged)
      win.removeListener('minimize', onStateChanged)
      win.removeListener('maximize', onStateChanged)
      win.removeListener('unmaximize', onStateChanged)
      win.removeListener('restore', onStateChanged)
      win.removeListener('show', onStateChanged)
      win.removeListener('hide', onStateChanged)
      win.removeListener('always-on-top-changed', onStateChanged)
      win.removeListener('enter-full-screen', onStateChanged)
      win.removeListener('leave-full-screen', onStateChanged)
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

  private sendToWindow(win: BrowserWindow | null | undefined, channel: WindowingIpcMessageType, payload: unknown): void {
    if (!win || win.isDestroyed() || win.webContents.isDestroyed()) {
      return
    }

    try {
      win.webContents.send(channel, payload)
    } catch (error) {
      this.logError(`Failed to send IPC message "${channel}", targetId=${win.id}.`, error)
    }
  }

  private async createBrowserWindow(openerId: WindowId, request: WindowingOpenRequest): Promise<BrowserWindow> {
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

    const width = Math.round(request.width ?? this.DEFAULT_WINDOW_WIDTH)
    const height = Math.round(request.height ?? this.DEFAULT_WINDOW_HEIGHT)
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new Error(`Invalid window size (${request.width} x ${request.height}).`)
    }

    const window = new BrowserWindow({
      width: width,
      height: height,
      show: false,
      autoHideMenuBar: true,
      backgroundMaterial: 'mica',
      frame: true,
      titleBarStyle: 'hidden',
      titleBarOverlay: false,
      icon: icon,
      trafficLightPosition: { x: 16, y: 16 },
      skipTaskbar: request.skipTaskbar ?? false,
      resizable: request.resizable ?? false,
      alwaysOnTop: request.alwaysOnTop ?? false,
      modal: request.modal ?? false,
      parent: parentWindow,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: false,
        nodeIntegration: false
      }
    })

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    try {
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        const url = new URL(`${process.env['ELECTRON_RENDERER_URL']}/base.html`)
        url.searchParams.set('type', 'windowing-host')
        url.searchParams.set('os', process.platform)
        await window.loadURL(url.toString())
      } else {
        await window.loadFile(join(__dirname, '../renderer/base.html'), {
          query: { type: 'windowing-host', os: process.platform }
        })
      }
    } catch (error) {
      try {
        if (!window.isDestroyed()) {
          window.destroy()
        }
      } catch (error) {
        this.logError(`Failed to destroy window after load failure, id=${window.id}.`, error)
      }

      throw error
    }

    return window
  }

  private async openWindow(openerId: WindowId, request: WindowingOpenRequest): Promise<WindowingOpenResponse> {
    if (!request) {
      throw new Error('Invalid window open request.')
    }

    const window = await this.createBrowserWindow(openerId, request)
    this.managedWindows.set(window.id, { window: window, openerId: openerId })

    this.logInfo(`Managed window created, id=${window.id}, openerId=${openerId}, parentId=${request.parentId}.`)

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
          this.logError(`Failed to destroy window after time out, id=${window.id}.`, error)
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

    if (win.isMinimized()) {
      win.restore()
    }
    win.maximize()
  }

  private restoreWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    if (win.isMinimized()) {
      win.restore()
    }
    if (win.isMaximized()) {
      win.unmaximize()
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

  private enterFullscreenWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    if (win.isMinimized()) {
      win.restore()
    }
    win.setFullScreen(true)
  }

  private exitFullscreenWindow(win: BrowserWindow | null | undefined): void {
    if (!win || win.isDestroyed()) {
      return
    }

    win.setFullScreen(false)
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

  private logInfo(message: string): void {
    console.info('[WindowingManager]', message)
  }

  private logError(message: string, error: unknown): void {
    console.error('[WindowingManager]', message, error)
  }
}
