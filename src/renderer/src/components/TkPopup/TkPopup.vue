<template>
  <Teleport to="body">
    <div v-if="isOpen" ref="popupElementRef" :style="popupStyle" @mousedown.stop>
      <slot></slot>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onBeforeUnmount, nextTick, useTemplateRef, type CSSProperties } from 'vue'
import { resolveElement, type ResolvedElement, type MaybeElement } from '@renderer/utils/dom'

type CloseMode = 'click' | 'leave' | 'manual'

type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

const props = withDefaults(
  defineProps<{
    isOpen: boolean

    /**
     * 浮窗定位的目标元素
     */
    target: MaybeElement

    /**
     * 浮窗的宽度，默认为 'fit-content'
     *
     * 值为数字时，作为像素值使用；值为字符串时，直接作为 CSS 的 width 属性值使用（例如 'fit-content', '100%'）
     */
    width?: number | string

    /**
     * 浮窗的高度，默认为 'fit-content'
     *
     * 值为数字时，作为像素值使用；值为字符串时，直接作为 CSS 的 height 属性值使用（例如 'fit-content', '100%'）
     */
    height?: number | string

    /**
     * 浮窗的关闭模式，默认为 'click'
     * - click: 点击外部区域关闭
     * - leave: 鼠标离开浮窗和目标元素后自动关闭
     * - manual: 手动控制浮窗的关闭
     */
    closeMode?: CloseMode

    /**
     * 浮窗相对于目标元素的出现位置，默认显示在上方
     * - top: 目标元素上方，水平方向居中对齐
     * - bottom: 目标元素下方，水平方向居中对齐
     * - left: 目标元素左侧，垂直方向居中对齐
     * - right: 目标元素右侧，垂直方向居中对齐
     */
    placement?: Placement

    /**
     * 浮窗相对于目标元素的水平偏移量
     */
    horizontalOffset?: number

    /**
     * 浮窗相对于目标元素的垂直偏移量
     */
    verticalOffset?: number
  }>(),
  {
    width: 'fit-content',
    height: 'fit-content',
    closeMode: 'click',
    placement: 'top',
    horizontalOffset: 0,
    verticalOffset: 0
  }
)

const emit = defineEmits(['update:isOpen'])

const popupElementRef = useTemplateRef<HTMLElement>('popupElementRef')
const targetElement = computed<ResolvedElement | null>(() => {
  return resolveElement(props.target)
})

const popupStyle = ref<CSSProperties>({})

onBeforeUnmount(() => {
  unbindGlobalEvents()
  unbindClickToCloseEvents()
  unbindLeaveToCloseEvents(targetElement.value, popupElementRef.value)

  if (requestAnimationFrameId) {
    window.cancelAnimationFrame(requestAnimationFrameId)
  }
})

watch(
  [
    popupElementRef,
    () => props.isOpen,
    () => props.width,
    () => props.height,
    () => props.closeMode,
    () => props.placement,
    () => props.horizontalOffset,
    () => props.verticalOffset,
    () => props.target
  ],
  async ([popup, isOpen, , , closeMode, , , , target], _, onCleanUp) => {
    const targetEl = resolveElement(target)
    const popupEl = popup

    let isCancelled = false
    onCleanUp(() => {
      isCancelled = true
      unbindGlobalEvents()
      unbindClickToCloseEvents()
      unbindLeaveToCloseEvents(targetEl, popupEl)
    })

    if (isOpen) {
      popupStyle.value = {
        ...popupStyle.value,
        visibility: 'hidden'
      }

      await updatePosition()

      if (isCancelled || !props.isOpen) {
        return
      }

      popupStyle.value = {
        ...popupStyle.value,
        visibility: 'visible'
      }

      bindGlobalEvents()
      bindClickToCloseEvents()
      if (closeMode === 'leave') {
        bindLeaveToCloseEvents(targetEl, popupEl)
      }
    }
  }
)

const calculatePosition = (
  targetRect: DOMRect,
  popupRect: DOMRect,
  placement: Placement,
  horizontalOffset: number,
  verticalOffset: number
): [left: number, top: number] => {
  switch (placement) {
    case 'top': {
      const left = targetRect.left + (targetRect.width - popupRect.width) / 2 + horizontalOffset
      const top = targetRect.top - popupRect.height + verticalOffset
      return [left, top]
    }
    case 'top-start': {
      const left = targetRect.left + horizontalOffset
      const top = targetRect.top - popupRect.height + verticalOffset
      return [left, top]
    }
    case 'top-end': {
      const left = targetRect.right - popupRect.width + horizontalOffset
      const top = targetRect.top - popupRect.height + verticalOffset
      return [left, top]
    }

    case 'bottom': {
      const left = targetRect.left + (targetRect.width - popupRect.width) / 2 + horizontalOffset
      const top = targetRect.bottom + verticalOffset
      return [left, top]
    }
    case 'bottom-start': {
      const left = targetRect.left + horizontalOffset
      const top = targetRect.bottom + verticalOffset
      return [left, top]
    }
    case 'bottom-end': {
      const left = targetRect.right - popupRect.width + horizontalOffset
      const top = targetRect.bottom + verticalOffset
      return [left, top]
    }

    case 'left': {
      const left = targetRect.left - popupRect.width + horizontalOffset
      const top = targetRect.top + (targetRect.height - popupRect.height) / 2 + verticalOffset
      return [left, top]
    }
    case 'left-start': {
      const left = targetRect.left - popupRect.width + horizontalOffset
      const top = targetRect.top + verticalOffset
      return [left, top]
    }
    case 'left-end': {
      const left = targetRect.left - popupRect.width + horizontalOffset
      const top = targetRect.bottom - popupRect.height + verticalOffset
      return [left, top]
    }

    case 'right': {
      const left = targetRect.right + horizontalOffset
      const top = targetRect.top + (targetRect.height - popupRect.height) / 2 + verticalOffset
      return [left, top]
    }
    case 'right-start': {
      const left = targetRect.right + horizontalOffset
      const top = targetRect.top + verticalOffset
      return [left, top]
    }
    case 'right-end': {
      const left = targetRect.right + horizontalOffset
      const top = targetRect.bottom - popupRect.height + verticalOffset
      return [left, top]
    }

    default: {
      const left = targetRect.left + (targetRect.width - popupRect.width) / 2 + horizontalOffset
      const top = targetRect.top - popupRect.height + verticalOffset
      return [left, top]
    }
  }
}

const updatePosition = async (): Promise<void> => {
  popupStyle.value = {
    position: 'fixed',
    width: typeof props.width === 'number' ? props.width + 'px' : props.width,
    height: typeof props.height === 'number' ? props.height + 'px' : props.height,
    zIndex: 'var(--z-index-popup, 1000)'
  }

  await nextTick()

  const targetEl = targetElement.value
  const popupEl = popupElementRef.value

  if (!targetEl || !popupEl) {
    return
  }

  const targetRect = targetEl.getBoundingClientRect()
  const popupRect = popupEl.getBoundingClientRect()

  let [left, top] = calculatePosition(targetRect, popupRect, props.placement, props.horizontalOffset, props.verticalOffset)

  left = Math.max(0, Math.min(left, window.innerWidth - popupRect.width))
  top = Math.max(0, Math.min(top, window.innerHeight - popupRect.height))

  popupStyle.value = {
    ...popupStyle.value,
    left: `${left}px`,
    top: `${top}px`
  }
}

// #region 点击其他区域以关闭浮窗

let requestAnimationFrameId: number | null = null

const handleGlobalReposition = (): void => {
  if (!props.isOpen) {
    return
  }

  if (requestAnimationFrameId) {
    return
  }

  requestAnimationFrameId = window.requestAnimationFrame(async () => {
    await updatePosition()
    requestAnimationFrameId = null
  })
}

const bindGlobalEvents = (): void => {
  window.addEventListener('resize', handleGlobalReposition)
  window.addEventListener('scroll', handleGlobalReposition, true)
}

const unbindGlobalEvents = (): void => {
  window.removeEventListener('resize', handleGlobalReposition)
  window.removeEventListener('scroll', handleGlobalReposition, true)
}

// #endregion

// #region 点击其他区域以关闭浮窗

const onMouseDown = (e: MouseEvent): void => {
  if (props.closeMode === 'leave') {
    // 移走关闭模式下，鼠标点击的位置不属于目标元素或者浮窗时，关闭浮窗
    if (popupElementRef.value && popupElementRef.value.contains(e.target as Node)) {
      return
    } else if (targetElement.value && targetElement.value.contains(e.target as Node)) {
      return
    }
  } else if (props.closeMode === 'click') {
    // 点击关闭模式下，鼠标点击的位置不属于浮窗时，关闭浮窗
    if (popupElementRef.value && popupElementRef.value.contains(e.target as Node)) {
      return
    }
  } else if (props.closeMode === 'manual') {
    // 手动关闭模式下，无需处理
    return
  }

  emit('update:isOpen', false)
}

const bindClickToCloseEvents = (): void => {
  document.addEventListener('mousedown', onMouseDown)
}

const unbindClickToCloseEvents = (): void => {
  document.removeEventListener('mousedown', onMouseDown)
}

// #endregion

// #region 鼠标离开浮窗区域以关闭浮窗

let closeTimeout: number | null = null

const clearCloseTimeout = (): void => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const startCloseTimeout = (): void => {
  clearCloseTimeout()
  closeTimeout = window.setTimeout(() => {
    emit('update:isOpen', false)
  }, 250)
}

const onMouseEnter = (): void => {
  clearCloseTimeout()
}

const onMouseLeave = (e: Event): void => {
  const mouseEvent = e as MouseEvent

  const related = mouseEvent.relatedTarget as Node | null
  if (
    (targetElement.value && targetElement.value.contains(related)) ||
    (popupElementRef.value && popupElementRef.value.contains(related))
  ) {
    return
  }

  startCloseTimeout()
}

const bindLeaveToCloseEvents = (target: ResolvedElement | null | undefined, popup: HTMLElement | null | undefined): void => {
  target?.addEventListener('mouseenter', onMouseEnter)
  target?.addEventListener('mouseleave', onMouseLeave)
  popup?.addEventListener('mouseenter', onMouseEnter)
  popup?.addEventListener('mouseleave', onMouseLeave)
}

const unbindLeaveToCloseEvents = (target: ResolvedElement | null | undefined, popup: HTMLElement | null | undefined): void => {
  target?.removeEventListener('mouseenter', onMouseEnter)
  target?.removeEventListener('mouseleave', onMouseLeave)
  popup?.removeEventListener('mouseenter', onMouseEnter)
  popup?.removeEventListener('mouseleave', onMouseLeave)
  clearCloseTimeout()
}

// #endregion
</script>

<style scoped></style>
