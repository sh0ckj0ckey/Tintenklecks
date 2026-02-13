<template>
  <Teleport to="body">
    <div v-if="isOpen" ref="popupElementRef" :style="popupStyle" class="tk-popup">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick, useTemplateRef, type CSSProperties } from 'vue'
import { resolveElement, type ResolvedElement, type MaybeElement } from '@renderer/utils/dom'
import { PopupManager, type PopupCloseMode } from './PopupManager'

type CloseMode = PopupCloseMode

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

const popupId = Symbol('tk-popup')

const currentZIndex = ref<number>(0)

const popupElementRef = useTemplateRef('popupElementRef')
const targetElement = computed<ResolvedElement | null>(() => resolveElement(props.target))

const popupLayoutStyle = ref<CSSProperties>({})
const popupStateStyle = ref<CSSProperties>({})
const popupStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  ...popupLayoutStyle.value,
  ...popupStateStyle.value
}))

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
  if (!props.isOpen) {
    return
  }

  const width = typeof props.width === 'number' ? props.width + 'px' : props.width
  const height = typeof props.height === 'number' ? props.height + 'px' : props.height

  popupLayoutStyle.value = {
    ...popupLayoutStyle.value,
    width,
    height
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

  popupLayoutStyle.value = {
    width,
    height,
    left: `${left}px`,
    top: `${top}px`
  }
}

let closeTimeout: number | null = null

const clearCloseTimeout = (): void => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
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

  clearCloseTimeout()
  closeTimeout = window.setTimeout(() => {
    PopupManager.checkCloseOnLeave(related)
    closeTimeout = null
  }, 250)
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

watch(
  [() => props.isOpen, () => props.closeMode, targetElement],
  async ([isOpen, closeMode], _, onCleanUp) => {
    let targetEl: ResolvedElement | null = null
    let popupEl: HTMLElement | null = null

    let isCancelled = false
    onCleanUp(() => {
      isCancelled = true
      PopupManager.unregister(popupId)
      unbindLeaveToCloseEvents(targetEl, popupEl)
    })

    if (isOpen) {
      currentZIndex.value = PopupManager.register(popupId, {
        closeMode: props.closeMode,
        close: () => {
          emit('update:isOpen', false)
        },
        reposition: () => {
          updatePosition()
        },
        contains: (el: Node): boolean => {
          return (targetElement.value?.contains(el) ?? false) || (popupElementRef.value?.contains(el) ?? false)
        }
      })

      await nextTick()

      if (isCancelled || !props.isOpen) {
        return
      }

      targetEl = targetElement.value
      popupEl = popupElementRef.value

      popupStateStyle.value = {
        visibility: 'hidden',
        zIndex: currentZIndex.value
      }

      await updatePosition()

      if (isCancelled || !props.isOpen) {
        return
      }

      popupStateStyle.value = {
        visibility: 'visible',
        zIndex: currentZIndex.value
      }

      if (closeMode === 'leave') {
        bindLeaveToCloseEvents(targetEl, popupEl)
      }
    }
  },
  { immediate: true }
)

watch(
  [() => props.width, () => props.height, () => props.placement, () => props.horizontalOffset, () => props.verticalOffset],
  async () => {
    if (!props.isOpen) {
      return
    }

    await updatePosition()
  }
)
</script>

<style scoped>
.tk-popup {
  box-sizing: border-box;
}
</style>
