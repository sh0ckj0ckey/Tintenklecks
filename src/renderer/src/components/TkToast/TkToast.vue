<template>
  <div :class="['tk-toast', placementClass]" role="alert">
    <div class="toast-content">
      <svg
        v-if="icon !== 'none' && iconPaths[icon]"
        class="toast-icon"
        :class="`icon-${icon}`"
        fill="currentColor"
        viewBox="0 0 16 16"
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
  icon: 'none' | 'info' | 'success' | 'warning' | 'error'
  duration: number
  placement: 'top' | 'center' | 'bottom'
  offset: number | string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const iconPaths = {
  info: 'M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z',
  success:
    'M15 8c0 .982-.472 1.854-1.202 2.402a2.995 2.995 0 0 1-.848 2.547 2.995 2.995 0 0 1-2.548.849A2.996 2.996 0 0 1 8 15a2.996 2.996 0 0 1-2.402-1.202 2.995 2.995 0 0 1-2.547-.848 2.995 2.995 0 0 1-.849-2.548A2.996 2.996 0 0 1 1 8c0-.982.472-1.854 1.202-2.402a2.995 2.995 0 0 1 .848-2.547 2.995 2.995 0 0 1 2.548-.849A2.995 2.995 0 0 1 8 1c.982 0 1.854.472 2.402 1.202a2.995 2.995 0 0 1 2.547.848c.695.695.978 1.645.849 2.548A2.996 2.996 0 0 1 15 8Zm-3.291-2.843a.75.75 0 0 1 .135 1.052l-4.25 5.5a.75.75 0 0 1-1.151.043l-2.25-2.5a.75.75 0 1 1 1.114-1.004l1.65 1.832 3.7-4.789a.75.75 0 0 1 1.052-.134Z',
  warning:
    'M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z'
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
.tk-toast {
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
    gap: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 12px 16px;
    pointer-events: auto;

    border: 1px solid #1a1a1a;
    border-radius: 4px;

    background-origin: border-box;
    background-clip: padding-box, border-box;
    background-image:
      linear-gradient(#1f1f1f, #202020),
      linear-gradient(
        165deg,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.02) 40%,
        rgba(255, 255, 255, 0.02) 60%,
        rgba(255, 255, 255, 0.04) 100%
      );

    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.03),
      0 8px 20px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2);

    .toast-icon {
      flex: none;
      width: 18px;
      height: 18px;
      object-fit: scale-down;

      &.icon-info {
        color: #0078d4;
      }

      &.icon-success {
        color: #0f7b0f;
      }

      &.icon-warning {
        color: #fce100;
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
