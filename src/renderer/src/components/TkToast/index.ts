import { h, render } from 'vue'
import TkToast from './TkToast.vue'

export interface ToastOptions {
  /**
   * 显示在提示文本左侧的图标，默认不显示图标
   */
  icon?: 'none' | 'info' | 'success' | 'error'

  /**
   * 提示文本
   */
  text: string

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
}

export const showToast = (options: ToastOptions): void => {
  const icon = options.icon ?? 'none'
  const text = options.text ?? ''
  const duration = options.duration ?? 3000
  const placement = options.placement ?? 'top'
  const offset = options.offset ?? 32

  const container: HTMLDivElement = document.createElement('div')
  document.body.appendChild(container)

  let destroyed = false

  const handleClose = () => {
    if (destroyed) {
      return
    }

    destroyed = true

    try {
      render(null, container)
      container.remove()
    } catch (e) {
      console.error('Toast 销毁异常', e)
    }
  }

  const vnode = h(TkToast, {
    icon: options.icon,
    text: options.text,
    duration: options.duration * 1000,
    placement: options.placement,
    onClose: handleClose
  })

  render(vnode, container)
}
