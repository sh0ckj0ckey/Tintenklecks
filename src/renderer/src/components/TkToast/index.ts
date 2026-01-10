import { h, render } from 'vue'
import { resolveElement, type ResolvedElement, type MaybeElement } from '@renderer/utils/dom'
import TkToast from './TkToast.vue'

export interface ToastOptions {
  /**
   * 提示文本
   */
  text: string

  /**
   * 显示在提示文本左侧的图标，默认不显示图标
   */
  icon?: 'none' | 'info' | 'success' | 'error'

  /**
   * 持续时间，单位秒，默认 3 秒
   */
  duration?: number

  /**
   * 显示位置，默认显示在顶部
   */
  placement?: 'top' | 'center' | 'bottom'

  /**
   * 相对于父容器的偏移量，单位 px，默认 32px
   *
   * 仅在 placement 为 'top' 或 'bottom' 时有效，表示距离顶部或底部边缘的间距
   */
  offset?: number

  /**
   * 指定 Toast 挂载的容器，默认挂载到 document.body 上
   */
  container?: MaybeElement
}

/**
 * 管理不同容器的挂载节点，每个容器内只会同时显示一个 toast
 */
const mountNodes = new WeakMap<ResolvedElement, HTMLDivElement>()

export const showToast = (options: ToastOptions): void => {
  const text = options.text
  const icon = options.icon ?? 'none'
  const duration = options.duration ?? 3
  const placement = options.placement ?? 'top'
  const offset = options.offset ?? 32

  let container = resolveElement(options.container) ?? document.body

  if (container instanceof SVGElement) {
    if (import.meta.env.DEV) {
      console.warn('[Tintenklecks] Toast container cannot be an SVGElement. ' + 'Falling back to document.body.')
    }
    container = document.body
  }

  const isGlobal = container === document.body

  if (!isGlobal && import.meta.env.DEV) {
    const style = window.getComputedStyle(container)
    if (style.position === 'static') {
      console.warn(
        `[Tintenklecks] Target container has "position: static".\n` +
          `Toast may be positioned incorrectly.\n` +
          `Suggestion: Add "position: relative" or "absolute" to the container style.`,
        container
      )
    }
  }

  let mountNode = mountNodes.get(container)

  if (mountNode && mountNode.isConnected) {
    render(null, mountNode)
  } else {
    if (!mountNode) {
      mountNode = document.createElement('div')
      mountNodes.set(container, mountNode)
    }

    mountNode.className = 'tk-toast-mount-node'
    mountNode.style.position = isGlobal ? 'fixed' : 'absolute'
    mountNode.style.top = '0'
    mountNode.style.left = '0'
    mountNode.style.width = '100%'
    mountNode.style.height = '100%'
    mountNode.style.pointerEvents = 'none'

    mountNode.style.zIndex = 'var(--tk-z-toast, 10000)'

    container.appendChild(mountNode)
  }

  const onClose = (): void => {
    if (mountNode) {
      render(null, mountNode)
      mountNode.remove()
      mountNodes.delete(container)
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

  render(vnode, mountNode)
}
