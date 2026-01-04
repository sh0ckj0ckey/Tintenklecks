<template>
  <div :class="['background', placementClass]">
    <div class="content">
      <TkToastIcon v-if="icon !== 'none'" :type="icon" />
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'
import TkToastIcon from './TkToastIcon.vue'

const props = defineProps<{
  text: string
  icon: 'none' | 'info' | 'success' | 'error'
  duration: number
  placement: 'top' | 'center' | 'bottom'
  offset: number | string
}>()

const emit = defineEmits(['close'])

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
    border-radius: 8px;
    background-color: var(--tk-app-background);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    padding: 12px 16px;
    pointer-events: auto;

    img {
      flex: none;
      width: 18px;
      height: 18px;
      object-fit: scale-down;
    }

    span {
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
