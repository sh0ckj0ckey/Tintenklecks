import type { ComponentPublicInstance } from 'vue'

export type ResolvedElement = HTMLElement | SVGElement

export type MaybeElement = ResolvedElement | ComponentPublicInstance | null | undefined

/**
 * 解析目标，统一返回 Element (HTMLElement | SVGElement) 或 null
 * 兼容原生 DOM、SVG 和 Vue 组件实例（取 $el）
 */
export function resolveElement(target: MaybeElement): ResolvedElement | null {
  if (!target) {
    return null
  }

  if (typeof Element === 'undefined') {
    return null
  }

  if (target instanceof Element) {
    return target as ResolvedElement
  }

  const instance = target as ComponentPublicInstance
  if (instance.$el instanceof Element) {
    return instance.$el as ResolvedElement
  }

  if (import.meta.env.DEV) {
    if (typeof target === 'object' && instance.$el) {
      console.warn(
        '[Tintenklecks] Target component is not a valid Element. ' +
          'It might be a Fragment (multi-root) or Text node. ' +
          'Please wrap it in a single DOM element.'
      )
    }
  }

  return null
}
