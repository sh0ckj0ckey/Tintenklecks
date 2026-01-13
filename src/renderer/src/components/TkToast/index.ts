import { h, render } from 'vue'
import { resolveElement, type ResolvedElement, type MaybeElement } from '@renderer/utils/dom'
import TkToast from './TkToast.vue'

type ToastIcon = 'none' | 'info' | 'success' | 'warning' | 'error'

type ToastPlacement = 'top' | 'center' | 'bottom'

export interface ToastOptions {
  /**
   * 提示文本
   */
  text: string

  /**
   * 显示在提示文本左侧的图标，默认不显示图标
   */
  icon?: ToastIcon

  /**
   * 持续时间，单位秒，默认 3 秒
   */
  duration?: number

  /**
   * 显示位置，默认显示在顶部
   */
  placement?: ToastPlacement

  /**
   * 相对于父容器边界的偏移量，单位 px，默认值在 placement 为 'top' 或 'bottom' 时为 32px，在 placement 为 'center' 时为 0px
   *
   * 当 placement 为 'top' 或 'center' 时表示顶部偏移量；
   * 当 placement 为 'bottom' 时表示底部偏移量。
   */
  offset?: number

  /**
   * 指定 Toast 挂载的容器，默认挂载到 document.body 上
   */
  container?: MaybeElement
}

const layerGroups = new WeakMap<ResolvedElement, Map<ToastPlacement, HTMLDivElement>>()

export const showToast = (options: ToastOptions): void => {
  const text = options.text
  const icon = options.icon ?? 'none'
  const duration = options.duration ?? 3
  const placement = options.placement ?? 'top'
  const offset = options.offset ?? (placement === 'center' ? 0 : 32)

  let targetContainer = resolveElement(options.container) ?? document.body

  if (targetContainer instanceof SVGElement) {
    if (import.meta.env.DEV) {
      console.warn('[Tintenklecks] Toast container cannot be an SVGElement. ' + 'Falling back to document.body.')
    }
    targetContainer = document.body
  }

  const isGlobal = targetContainer === document.body

  if (!isGlobal && import.meta.env.DEV) {
    const style = window.getComputedStyle(targetContainer)
    if (style.position === 'static') {
      console.warn(
        `[Tintenklecks] Target container has "position: static".\n` +
          `Toast may be positioned incorrectly.\n` +
          `Suggestion: Add "position: relative" or "absolute" to the container style.`,
        targetContainer
      )
    }
  }

  let layers = layerGroups.get(targetContainer)

  if (!layers) {
    layers = new Map<ToastPlacement, HTMLDivElement>()
    layerGroups.set(targetContainer, layers)
  }

  let layer = layers.get(placement)

  if (!layer) {
    layer = document.createElement('div')
    layers.set(placement, layer)
  }

  if (!layer.isConnected) {
    layer.innerHTML = ''
    layer.className = `tk-toast-layer tk-toast-layer--${placement}`
    layer.style.position = isGlobal ? 'fixed' : 'absolute'
    layer.style.inset = '0'
    layer.style.pointerEvents = 'none'
    layer.style.display = 'flex'
    layer.style.zIndex = 'var(--tk-z-toast, 10000)'
    if (placement === 'bottom') {
      layer.style.flexDirection = 'column-reverse'
      layer.style.justifyContent = 'flex-start'
      layer.style.gap = '0'
    } else if (placement === 'center') {
      layer.style.flexDirection = 'column'
      layer.style.justifyContent = 'center'
      layer.style.gap = '8px'
    } else {
      layer.style.flexDirection = 'column'
      layer.style.justifyContent = 'flex-start'
      layer.style.gap = '0'
    }

    targetContainer.appendChild(layer)
  }

  const toastWrapper = document.createElement('div')
  toastWrapper.className = 'tk-toast-wrapper'
  toastWrapper.style.flex = '0 0 auto'
  toastWrapper.style.display = 'flex'
  toastWrapper.style.flexDirection = 'column'
  toastWrapper.style.width = '100%'
  toastWrapper.style.boxSizing = 'border-box'
  toastWrapper.style.pointerEvents = 'none'

  layer.appendChild(toastWrapper)

  const onClose = (): void => {
    render(null, toastWrapper)
    toastWrapper.remove()

    if (layer && layer.childNodes.length === 0) {
      layer.remove()
      if (layers) {
        layers.delete(placement)
      }
    }

    if (layers && layers.size === 0) {
      layerGroups.delete(targetContainer)
    }
  }

  const vnode = h(TkToast, {
    text: text,
    icon: icon,
    duration: duration * 1000,
    placement: placement,
    offset: offset,
    onClose: onClose
  })

  render(vnode, toastWrapper)
}
