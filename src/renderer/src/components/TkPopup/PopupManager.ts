export type PopupCloseMode = 'click' | 'leave' | 'manual'

interface PopupInstance {
  id: symbol
  zIndex: number
  closeMode: PopupCloseMode
  close: () => void
  reposition: () => void
  contains: (el: Node) => boolean
}

/** var(--tk-z-popup) */
const Z_INDEX_BASE = 20000

const popupStack: PopupInstance[] = []

let requestAnimationFrameId: number | null = null

const onGlobalReposition = (): void => {
  if (requestAnimationFrameId) {
    window.cancelAnimationFrame(requestAnimationFrameId)
  }

  requestAnimationFrameId = window.requestAnimationFrame(() => {
    popupStack.forEach((popup) => popup.reposition())
    requestAnimationFrameId = null
  })
}

const onGlobalMouseDown = (e: MouseEvent): void => {
  const relatedTarget = e.target as Node
  if (!relatedTarget) {
    return
  }

  for (let i = popupStack.length - 1; i >= 0; i--) {
    const popup = popupStack[i]

    if (popup.contains(relatedTarget)) {
      return
    }

    if (popup.closeMode !== 'manual') {
      popup.close()
    }
  }
}

const onAnyPopupMouseLeave = (relatedTarget: Node | null): void => {
  for (let i = popupStack.length - 1; i >= 0; i--) {
    const popup = popupStack[i]

    if (relatedTarget && popup.contains(relatedTarget)) {
      return
    }

    if (popup.closeMode !== 'leave') {
      return
    }

    if (popup.closeMode === 'leave') {
      popup.close()
    }
  }
}

const addListeners = (): void => {
  window.addEventListener('mousedown', onGlobalMouseDown, true)
  window.addEventListener('resize', onGlobalReposition)
  window.addEventListener('scroll', onGlobalReposition, true)
}

const removeListeners = (): void => {
  window.removeEventListener('mousedown', onGlobalMouseDown, true)
  window.removeEventListener('resize', onGlobalReposition)
  window.removeEventListener('scroll', onGlobalReposition, true)
}

export const PopupManager = {
  register(id: symbol, config: Omit<PopupInstance, 'id' | 'zIndex'>): number {
    if (popupStack.length === 0) {
      addListeners()
    }

    const zIndex = popupStack.length > 0 ? popupStack[popupStack.length - 1].zIndex + 1 : Z_INDEX_BASE

    popupStack.push({ id, zIndex, ...config })
    return zIndex
  },

  unregister(id: symbol) {
    const idx = popupStack.findIndex((p) => p.id === id)
    if (idx !== -1) {
      popupStack.splice(idx, 1)
    }

    if (popupStack.length === 0) {
      removeListeners()
    }
  },

  checkCloseOnLeave(relatedTarget: Node | null): void {
    onAnyPopupMouseLeave(relatedTarget)
  }
}
