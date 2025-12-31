<template>
  <div :class="['background', placementClass, positionClass]">
    <div class="content">
      <img v-if="icon && icon === 'info'" src="@icons/messageBox/tips_info.png" />
      <img v-if="icon && icon === 'success'" src="@icons/messageBox/tips_success.png" />
      <img v-if="icon && icon === 'error'" src="@icons/messageBox/tips_error.png" />
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'

const props = defineProps<{
  icon: 'none' | 'info' | 'success' | 'error'
  text: string
  duration: number
  placement: 'top' | 'center' | 'bottom'
  offset: number | string
  isGlobal: boolean
}>()

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

const positionClass = computed(() => {
  return props.isGlobal ? 'position-global' : 'position-local'
})

const offsetStyleValue = computed(() => {
  return typeof props.offset === 'number' ? `${props.offset}px` : props.offset
})

const emit = defineEmits(['close'])

onMounted(() => {
  setTimeout(() => {
    emit('close')
  }, props.duration)
})
</script>

<style scoped>
.background {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: var(--z-index-toast);
  pointer-events: none;
  background-color: transparent;

  &.placement-top {
    align-items: flex-start;

    .content {
      margin-top: v-bind(offsetStyleValue);
    }
  }

  &.placement-center {
    align-items: center;
  }

  &.placement-bottom {
    align-items: flex-end;

    .content {
      margin-bottom: v-bind(offsetStyleValue);
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: auto;
    width: auto;
    height: auto;
    max-width: 80%;
    pointer-events: auto;
    border-radius: 8px;
    background-color: var(--background);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    gap: 12px;
    padding: 12px 16px;

    img {
      flex: none;
      width: 18px;
      height: 18px;
      object-fit: scale-down;
    }

    span {
      color: var(--text-01);
      font-size: 14px;
      font-weight: 400;
      overflow: hidden;
      display: block;
      white-space: wrap;
      word-wrap: normal;
    }
  }
}
</style>
