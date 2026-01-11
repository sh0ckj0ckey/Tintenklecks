<template>
  <div :class="['toast-wrapper', placementClass]">
    <div class="toast-content">
      <svg
        v-if="icon !== 'none' && iconPaths[icon]"
        class="toast-icon"
        :class="`icon-${icon}`"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path clip-rule="evenodd" fill-rule="evenodd" :d="iconPaths[icon]"></path>
      </svg>

      <span class="toast-text">{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps<{
  text: string
  icon: 'none' | 'info' | 'success' | 'error'
  duration: number
  placement: 'top' | 'center' | 'bottom'
  offset: number | string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const iconPaths = {
  info: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z'
}

const placementClass = computed(() => {
  switch (props.placement) {
    case 'top':
      return 'placement-top'
    case 'center':
      return 'placement-center'
    case 'bottom':
      return 'placement-bottom'
    default:
      return 'placement-top'
  }
})

const offsetValue = computed(() => {
  return typeof props.offset === 'number' ? `${props.offset}px` : props.offset
})

let closeTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  closeTimeout = setTimeout(() => {
    emit('close')
  }, props.duration)
})

onBeforeUnmount(() => {
  clearTimeout(closeTimeout)
})
</script>

<style scoped>
.toast-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;

  &.placement-top {
    margin-top: v-bind(offsetValue);
  }

  &.placement-center {
    margin-top: v-bind(offsetValue);
  }

  &.placement-bottom {
    margin-bottom: v-bind(offsetValue);
  }

  .toast-content {
    width: auto;
    height: auto;
    max-width: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid transparent;
    border-radius: 4px;
    background-image: linear-gradient(#f0f0f0, #f0f0f3), linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0.01) 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      rgba(9, 30, 66, 0.15) 0px 1px 1px,
      rgba(9, 30, 66, 0.08) 0px 0px 1px 1px;
    padding: 12px 16px;
    pointer-events: auto;

    .toast-icon {
      flex: none;
      width: 20px;
      height: 20px;
      object-fit: scale-down;

      &.icon-info {
        color: #0078d4;
      }

      &.icon-success {
        color: #0f7b0f;
      }

      &.icon-error {
        color: #c42b1c;
      }
    }

    .toast-text {
      display: block;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      color: var(--tk-color-foreground);
      white-space: pre-wrap;
      word-wrap: normal;
    }
  }
}
</style>
