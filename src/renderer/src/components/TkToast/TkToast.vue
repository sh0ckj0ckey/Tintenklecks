<template>
  <div :class="['background', placementClass]">
    <div class="content">
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

const emit = defineEmits(['close'])

const iconPaths = {
  info: 'M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
  success:
    'M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z',
  error:
    'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z'
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
.background {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;

  &.placement-top {
    align-items: flex-start;
    padding-top: v-bind(offsetValue);
  }

  &.placement-center {
    align-items: center;
  }

  &.placement-bottom {
    align-items: flex-end;
    padding-bottom: v-bind(offsetValue);
  }

  .content {
    width: auto;
    height: auto;
    max-width: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
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
      color: var(--tk-app-foreground);
      white-space: pre-wrap;
      word-wrap: normal;
    }
  }
}
</style>
