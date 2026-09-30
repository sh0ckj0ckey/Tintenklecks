import { contextBridge } from 'electron'
import { environmentAPI } from './environment-api'
import { windowingAPI } from './windowing-api'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('environmentAPI', environmentAPI)
    contextBridge.exposeInMainWorld('windowingAPI', windowingAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error The Window type is declared in the renderer type environment.
  window.environmentAPI = environmentAPI

  // @ts-expect-error The Window type is declared in the renderer type environment.
  window.windowingAPI = windowingAPI
}
