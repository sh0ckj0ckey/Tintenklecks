import { shell, BrowserWindow, ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { windowingIpcChannels } from '../shared/windowing-ipc'
import type {
  WindowId,
  WindowPosition,
  WindowState,
  WindowingIpcChannel,
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
import icon from '../../resources/icon.png?asset'

interface ManagedWindowRecord {
  window: BrowserWindow
  openerId: WindowId
  removeWindowListeners: () => void
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

  private disposed = false

  private readonly mainWindow: BrowserWindow

  private readonly managedWindows = new Map<WindowId, ManagedWindowRecord>()

  private readonly pendingWindowOpenRequests = new Map<WindowId, PendingWindowOpenRequest>()

  private removeManagerListeners?: () => void

  constructor(mainWindow: BrowserWindow) {
    if (!mainWindow || mainWindow.isDestroyed()) {
      throw new Error('WindowingManager requires a valid mainWindow instance.')
    }

    this.mainWindow = mainWindow

    let removeMainWindowClosedListener: (() => void) | undefined
    let removeMainWindowStateListener: (() => void) | undefined
    let removeIpcListeners: (() => void) | undefined

    try {
      removeMainWindowClosedListener = this.bindWindowClosedListener(this.mainWindow)
      removeMainWindowStateListener = this.bindWindowStateListeners(this.mainWindow)
      removeIpcListeners = this.initIpcListeners()
    } catch (error) {
      removeMainWindowClosedListener?.()
      removeMainWindowStateListener?.()
      removeIpcListeners?.()
      throw error
    }

    this.removeManagerListeners = () => {
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

    this.removeManagerListeners?.()
    this.removeManagerListeners = undefined

    this.pendingWindowOpenRequests.forEach((pendingRequest) => {
      clearTimeout(pendingRequest.timer)
      pendingRequest.reject(new Error('WindowingManager has been disposed.'))
    })
    this.pendingWindowOpenRequests.clear()

    const records = Array.from(this.managedWindows.values())
    this.managedWindows.clear()

    records.forEach((record) => {
      try {
        record.removeWindowListeners()
      } catch (error) {
        this.logError(`Failed to remove managed window listeners, id=${record.window.id}.`, error)
      }

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

    const handleOpenRequest = async (event: IpcMainInvokeEvent, request: WindowingOpenRequest): Promise<WindowingOpenResponse> => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        return await this.openWindow(sourceWindow.id, request)
      } catch (error) {
        this.logError(`Failed to open managed window, size=${request?.width}x${request?.height}, parentId=${request?.parentId}.`, error)
        throw error
      }
    }

    const onReadyNotification = (event: IpcMainEvent, _notification: WindowingReadyNotification): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow || sourceWindow.id === this.mainWindow.id) {
          throw new Error('Invalid window source.')
        }

        const windowId = sourceWindow.id

        const pendingRequest = this.pendingWindowOpenRequests.get(windowId)
        if (!pendingRequest) {
          throw new Error('The window is not pending an open request.')
        }

        const record = this.managedWindows.get(windowId)
        if (!record || record.window.isDestroyed()) {
          throw new Error(`Managed window (${windowId}) does not exist.`)
        }

        try {
          if (pendingRequest.request.showInactive) {
            record.window.showInactive()
          } else {
            record.window.show()
          }
        } catch (error) {
          this.pendingWindowOpenRequests.delete(windowId)
          clearTimeout(pendingRequest.timer)
          pendingRequest.reject(error)

          this.managedWindows.delete(windowId)

          try {
            record.removeWindowListeners()
          } catch (removeError) {
            this.logError(`Failed to remove window listeners after show failure, id=${record.window.id}.`, removeError)
          }

          try {
            if (!record.window.isDestroyed()) {
              record.window.destroy()
            }
          } catch (destroyError) {
            this.logError(`Failed to destroy window after show failure, id=${record.window.id}.`, destroyError)
          }

          throw error
        }

        this.pendingWindowOpenRequests.delete(windowId)
        clearTimeout(pendingRequest.timer)
        pendingRequest.resolve({ id: windowId })

        this.logInfo(`Managed window ready, id=${windowId}.`)
      } catch (error) {
        this.logError('Failed to handle window ready notification.', error)
      }
    }

    const onUpdateRequest = (event: IpcMainEvent, request: WindowingUpdateRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = this.resolveTargetWindow(request.targetId)
        if (!targetWindow || targetWindow.id === this.mainWindow.id) {
          throw new Error('Invalid window target.')
        }

        const notification: WindowingUpdateNotification = {
          component: request.component,
          props: request.props
        }

        this.sendToWindow(targetWindow, windowingIpcChannels.UPDATE, notification)
      } catch (error) {
        this.logError(`Failed to update managed window, targetId=${request?.targetId}.`, error)
      }
    }

    const onEventRequest = (event: IpcMainEvent, request: WindowingEventRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
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

        const notification: WindowingEventNotification = {
          fromId: fromId,
          type: request.type,
          payload: request.payload
        }

        this.sendToWindow(targetWindow, windowingIpcChannels.EVENT, notification)
      } catch (error) {
        this.logError(`Failed to forward window event, targetId=${request?.targetId}.`, error)
      }
    }

    const onCloseRequest = (event: IpcMainEvent, request: WindowingCloseRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.closeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to close window, targetId=${request?.targetId}.`, error)
      }
    }

    const onActivateRequest = (event: IpcMainEvent, request: WindowingActivateRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.activateWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to activate window, targetId=${request?.targetId}.`, error)
      }
    }

    const onMinimizeRequest = (event: IpcMainEvent, request: WindowingMinimizeRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.minimizeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to minimize window, targetId=${request?.targetId}.`, error)
      }
    }

    const onMaximizeRequest = (event: IpcMainEvent, request: WindowingMaximizeRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.maximizeWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to maximize window, targetId=${request?.targetId}.`, error)
      }
    }

    const onRestoreRequest = (event: IpcMainEvent, request: WindowingRestoreRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.restoreWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to restore window, targetId=${request?.targetId}.`, error)
      }
    }

    const onResizeRequest = (event: IpcMainEvent, request: WindowingResizeRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.resizeWindow(targetWindow, request.width, request.height)
      } catch (error) {
        this.logError(`Failed to resize window, targetId=${request?.targetId}.`, error)
      }
    }

    const onMoveRequest = (event: IpcMainEvent, request: WindowingMoveRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.moveWindow(targetWindow, request.position)
      } catch (error) {
        this.logError(`Failed to move window, targetId=${request?.targetId}.`, error)
      }
    }

    const onTopmostRequest = (event: IpcMainEvent, request: WindowingTopmostRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.setWindowTopmost(targetWindow, request.isTopmost)
      } catch (error) {
        this.logError(`Failed to set window topmost state, targetId=${request?.targetId}.`, error)
      }
    }

    const onEnterFullscreenRequest = (event: IpcMainEvent, request: WindowingEnterFullscreenRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.enterFullscreenWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to enter fullscreen window, targetId=${request?.targetId}.`, error)
      }
    }

    const onExitFullscreenRequest = (event: IpcMainEvent, request: WindowingExitFullscreenRequest): void => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

        if (!targetWindow) {
          throw new Error('Invalid window target.')
        }

        this.exitFullscreenWindow(targetWindow)
      } catch (error) {
        this.logError(`Failed to exit fullscreen window, targetId=${request?.targetId}.`, error)
      }
    }

    const handleGetStateRequest = (event: IpcMainInvokeEvent, request: WindowingGetStateRequest): WindowingGetStateResponse => {
      try {
        if (this.disposed) {
          throw new Error('WindowingManager has been disposed.')
        }

        if (!request) {
          throw new Error('Invalid request.')
        }

        const sourceWindow = this.resolveSourceWindow(event)
        if (!sourceWindow) {
          throw new Error('Invalid window source.')
        }

        const targetWindow = request.targetId === undefined ? sourceWindow : this.resolveTargetWindow(request.targetId)

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

    ipcMain.handle(windowingIpcChannels.OPEN, handleOpenRequest)
    ipcMain.on(windowingIpcChannels.READY, onReadyNotification)
    ipcMain.on(windowingIpcChannels.UPDATE, onUpdateRequest)
    ipcMain.on(windowingIpcChannels.EVENT, onEventRequest)
    ipcMain.on(windowingIpcChannels.CLOSE, onCloseRequest)
    ipcMain.on(windowingIpcChannels.ACTIVATE, onActivateRequest)
    ipcMain.on(windowingIpcChannels.MINIMIZE, onMinimizeRequest)
    ipcMain.on(windowingIpcChannels.MAXIMIZE, onMaximizeRequest)
    ipcMain.on(windowingIpcChannels.RESTORE, onRestoreRequest)
    ipcMain.on(windowingIpcChannels.RESIZE, onResizeRequest)
    ipcMain.on(windowingIpcChannels.MOVE, onMoveRequest)
    ipcMain.on(windowingIpcChannels.TOPMOST, onTopmostRequest)
    ipcMain.on(windowingIpcChannels.ENTER_FULLSCREEN, onEnterFullscreenRequest)
    ipcMain.on(windowingIpcChannels.EXIT_FULLSCREEN, onExitFullscreenRequest)
    ipcMain.handle(windowingIpcChannels.GET_WINDOW_STATE, handleGetStateRequest)

    return (): void => {
      ipcMain.removeHandler(windowingIpcChannels.OPEN)
      ipcMain.removeListener(windowingIpcChannels.READY, onReadyNotification)
      ipcMain.removeListener(windowingIpcChannels.UPDATE, onUpdateRequest)
      ipcMain.removeListener(windowingIpcChannels.EVENT, onEventRequest)
      ipcMain.removeListener(windowingIpcChannels.CLOSE, onCloseRequest)
      ipcMain.removeListener(windowingIpcChannels.ACTIVATE, onActivateRequest)
      ipcMain.removeListener(windowingIpcChannels.MINIMIZE, onMinimizeRequest)
      ipcMain.removeListener(windowingIpcChannels.MAXIMIZE, onMaximizeRequest)
      ipcMain.removeListener(windowingIpcChannels.RESTORE, onRestoreRequest)
      ipcMain.removeListener(windowingIpcChannels.RESIZE, onResizeRequest)
      ipcMain.removeListener(windowingIpcChannels.MOVE, onMoveRequest)
      ipcMain.removeListener(windowingIpcChannels.TOPMOST, onTopmostRequest)
      ipcMain.removeListener(windowingIpcChannels.ENTER_FULLSCREEN, onEnterFullscreenRequest)
      ipcMain.removeListener(windowingIpcChannels.EXIT_FULLSCREEN, onExitFullscreenRequest)
      ipcMain.removeHandler(windowingIpcChannels.GET_WINDOW_STATE)
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

        const pendingRequest = this.pendingWindowOpenRequests.get(windowId)

        if (pendingRequest) {
          this.pendingWindowOpenRequests.delete(windowId)
          clearTimeout(pendingRequest.timer)
          pendingRequest.reject(new Error(`Window (${windowId}) was closed before ready.`))
        }

        const isWindowWaitingReady: boolean = !!pendingRequest

        const record = this.managedWindows.get(windowId)
        if (!record) {
          return
        }

        this.managedWindows.delete(windowId)

        try {
          record.removeWindowListeners()
        } catch (error) {
          this.logError(`Failed to remove window listeners after window closed, id=${record.window.id}.`, error)
        }

        if (isWindowWaitingReady) {
          return
        }

        const notification: WindowingClosedNotification = {
          id: windowId
        }

        this.sendToWindow(this.resolveTargetWindow(record.openerId), windowingIpcChannels.WINDOW_CLOSED, notification)
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

        const notification: WindowingStateChangedNotification = {
          state: state
        }

        this.sendToWindow(win, windowingIpcChannels.WINDOW_STATE_CHANGED, notification)
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

  private resolveSourceWindow(event: IpcMainEvent | IpcMainInvokeEvent): BrowserWindow | undefined {
    const window = BrowserWindow.fromWebContents(event.sender)

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

  private sendToWindow(win: BrowserWindow | null | undefined, channel: WindowingIpcChannel, payload: unknown): void {
    try {
      if (!win || win.isDestroyed() || win.webContents.isDestroyed()) {
        throw new Error('Invalid window.')
      }

      win.webContents.send(channel, payload)
    } catch (error) {
      this.logError(`Failed to send IPC message "${channel}", targetId=${win?.id}.`, error)
    }
  }

  private createBrowserWindow(openerId: WindowId, request: WindowingOpenRequest): BrowserWindow {
    let parentWindow: BrowserWindow | undefined = undefined

    if (request.parentId !== null) {
      const parentId: number = request.parentId === undefined ? openerId : request.parentId

      parentWindow = this.resolveTargetWindow(parentId)

      if (!parentWindow || parentWindow.isDestroyed()) {
        throw new Error(`Parent window (${parentId}) does not exist.`)
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
      trafficLightPosition: {
        x: 16,
        y: 16
      },
      skipTaskbar: request.skipTaskbar ?? false,
      resizable: request.resizable ?? false,
      alwaysOnTop: request.alwaysOnTop ?? false,
      modal: request.modal ?? false,
      parent: parentWindow,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)

      return {
        action: 'deny'
      }
    })

    return window
  }

  private async loadBrowserWindow(window: BrowserWindow): Promise<void> {
    if (!window || window.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const url = new URL(`${process.env['ELECTRON_RENDERER_URL']}/base.html`)

      url.searchParams.set('type', 'windowing-host')
      url.searchParams.set('os', process.platform)

      await window.loadURL(url.toString())
    } else {
      await window.loadFile(join(__dirname, '../renderer/base.html'), {
        query: {
          type: 'windowing-host',
          os: process.platform
        }
      })
    }
  }

  private openWindow(openerId: WindowId, request: WindowingOpenRequest): Promise<WindowingOpenResponse> {
    if (!request) {
      throw new Error('Invalid window open request.')
    }

    const window = this.createBrowserWindow(openerId, request)

    let removeWindowClosedListener: (() => void) | undefined
    let removeWindowStateListener: (() => void) | undefined

    try {
      this.positionWindow(window, request.position ?? 'center-screen')

      removeWindowClosedListener = this.bindWindowClosedListener(window)

      removeWindowStateListener = this.bindWindowStateListeners(window)

      const windowRecord: ManagedWindowRecord = {
        window: window,
        openerId: openerId,
        removeWindowListeners: () => {
          removeWindowClosedListener?.()
          removeWindowStateListener?.()
        }
      }

      this.managedWindows.set(window.id, windowRecord)
    } catch (error) {
      this.managedWindows.delete(window.id)

      removeWindowClosedListener?.()
      removeWindowStateListener?.()

      try {
        if (!window.isDestroyed()) {
          window.destroy()
        }
      } catch (destroyError) {
        this.logError(`Failed to destroy window after open setup failure, id=${window.id}.`, destroyError)
      }

      throw error
    }

    this.logInfo(`Managed window created, id=${window.id}, openerId=${openerId}, parentId=${request.parentId}.`)

    const openResult = new Promise<WindowingOpenResponse>((resolve, reject) => {
      const timer = setTimeout(() => {
        const pendingRequest = this.pendingWindowOpenRequests.get(window.id)

        if (!pendingRequest) {
          return
        }

        this.pendingWindowOpenRequests.delete(window.id)

        const record = this.managedWindows.get(window.id)

        if (record) {
          this.managedWindows.delete(window.id)
          record.removeWindowListeners()

          try {
            if (!record.window.isDestroyed()) {
              record.window.destroy()
            }
          } catch (error) {
            this.logError(`Failed to destroy window after timeout, id=${window.id}.`, error)
          }
        }

        pendingRequest.reject(new Error('Window did not become ready in time.'))
      }, this.OPEN_READY_TIMEOUT)

      const pendingWindowOpenRequest: PendingWindowOpenRequest = {
        resolve: resolve,
        reject: reject,
        timer: timer,
        request: request
      }

      this.pendingWindowOpenRequests.set(window.id, pendingWindowOpenRequest)
    })

    void this.loadBrowserWindow(window).catch((error) => {
      const pendingRequest = this.pendingWindowOpenRequests.get(window.id)

      if (!pendingRequest) {
        /*
         * There is no pending request because another lifecycle handler,
         * such as the READY notification, timeout, close, or dispose,
         * has already completed this open request and handled the
         * corresponding cleanup.
         *
         * Return here to avoid cleaning up the same request twice.
         */
        return
      }

      this.pendingWindowOpenRequests.delete(window.id)
      clearTimeout(pendingRequest.timer)
      pendingRequest.reject(error)

      const record = this.managedWindows.get(window.id)

      if (record) {
        this.managedWindows.delete(window.id)
        record.removeWindowListeners()

        try {
          if (!record.window.isDestroyed()) {
            record.window.destroy()
          }
        } catch (destroyError) {
          this.logError(`Failed to destroy window after load failure, id=${window.id}.`, destroyError)
        }
      }
    })

    return openResult
  }

  private positionWindow(win: BrowserWindow, position: WindowPosition): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    if (!position) {
      throw new Error('Invalid window position.')
    }

    if (typeof position === 'object') {
      const x = Math.round(position.x)
      const y = Math.round(position.y)

      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error(`Invalid window position (${position.x}, ${position.y}).`)
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
          win.center()
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

      default: {
        throw new Error(`Invalid window position (${String(position)}).`)
      }
    }
  }

  private closeWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    win.close()
  }

  private activateWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    if (win.isMinimized()) {
      win.restore()
    }

    if (!win.isVisible()) {
      win.show()
    }

    win.focus()
  }

  private minimizeWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    win.minimize()
  }

  private maximizeWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    if (win.isMinimized()) {
      win.restore()
    }

    win.maximize()
  }

  private restoreWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
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

  private resizeWindow(win: BrowserWindow, width: number, height: number): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    const nextWidth = Math.round(width)
    const nextHeight = Math.round(height)

    if (!Number.isFinite(nextWidth) || !Number.isFinite(nextHeight) || nextWidth <= 0 || nextHeight <= 0) {
      throw new Error(`Invalid window size (${width} x ${height}).`)
    }

    win.setSize(nextWidth, nextHeight)
  }

  private moveWindow(win: BrowserWindow, position: WindowPosition): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    this.positionWindow(win, position)
  }

  private setWindowTopmost(win: BrowserWindow, isTopmost: boolean): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    win.setAlwaysOnTop(isTopmost)
  }

  private enterFullscreenWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    if (win.isMinimized()) {
      win.restore()
    }

    win.setFullScreen(true)
  }

  private exitFullscreenWindow(win: BrowserWindow): void {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    win.setFullScreen(false)
  }

  private getWindowState(win: BrowserWindow): WindowState {
    if (!win || win.isDestroyed()) {
      throw new Error('Invalid window.')
    }

    const windowState: WindowState = {
      bounds: win.getBounds(),
      minimized: win.isMinimized(),
      maximized: win.isMaximized(),
      fullscreen: win.isFullScreen(),
      visible: win.isVisible(),
      alwaysOnTop: win.isAlwaysOnTop(),
      focused: win.isFocused()
    }

    return windowState
  }

  private logInfo(message: string): void {
    console.info('[WindowingManager]', message)
  }

  private logError(message: string, error: unknown): void {
    console.error('[WindowingManager]', message, error)
  }
}
