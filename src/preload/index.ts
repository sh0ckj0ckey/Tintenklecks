import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const appWindowAPI = {
  close: () => ipcRenderer.send('window-close'),
  minimize: () => ipcRenderer.send('window-min'),
  maximize: () => ipcRenderer.send('window-max'),
  onWindowStateChange: (callback: (state: 'maximized' | 'normal') => void) => {
    const cb = (_: Electron.IpcRendererEvent, state: 'maximized' | 'normal'): void => callback(state)
    ipcRenderer.on('window-state-change', cb)
    return () => {
      ipcRenderer.removeListener('window-state-change', cb)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('appWindowAPI', appWindowAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.appWindowAPI = appWindowAPI
}
