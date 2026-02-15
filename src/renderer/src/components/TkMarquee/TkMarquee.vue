<template>
  <div
    ref="marqueeElementRef"
    class="tk-marquee"
    :class="[`tk-marquee--${props.direction}`]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="tk-marquee-track" :style="marqueeTrackStyle">
      <div ref="marqueeContentElementRef" class="tk-marquee-content">
        <slot></slot>
      </div>
      <div v-for="n in Math.max(0, repeatCount - 1)" :key="n" class="tk-marquee-content" aria-hidden="true">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef, watch, nextTick, type CSSProperties } from 'vue'

type Direction = 'left' | 'right' | 'up' | 'down'

const props = withDefaults(
  defineProps<{
    /** 滚动速度 (像素/秒) */
    speed?: number

    /** 滚动方向 */
    direction?: Direction

    /** 是否在鼠标悬停时暂停滚动 */
    pauseOnHover?: boolean
  }>(),
  {
    speed: 50,
    direction: 'left',
    pauseOnHover: false
  }
)

const marqueeElementRef = useTemplateRef('marqueeElementRef')
const marqueeContentElementRef = useTemplateRef('marqueeContentElementRef')

const containerSize = ref(0)
const contentSize = ref(0)
const repeatCount = ref(2)
const isHovering = ref(false)

const currentOffset = ref(0)

const marqueeTrackStyle = computed<CSSProperties>(() => {
  const axis = props.direction === 'up' || props.direction === 'down' ? 'Y' : 'X'
  return {
    transform: `translate${axis}(${-currentOffset.value}px)`
  }
})

const measure = async (): Promise<void> => {
  await nextTick()

  if (!marqueeElementRef.value || !marqueeContentElementRef.value) {
    return
  }

  const isVertical = props.direction === 'up' || props.direction === 'down'
  containerSize.value = isVertical ? marqueeElementRef.value.offsetHeight : marqueeElementRef.value.offsetWidth
  contentSize.value = isVertical ? marqueeContentElementRef.value.scrollHeight : marqueeContentElementRef.value.scrollWidth

  if (containerSize.value > 0 && contentSize.value > 0) {
    const minCount = Math.ceil(containerSize.value / contentSize.value) + 1
    repeatCount.value = Math.max(2, minCount)
  } else {
    repeatCount.value = 2
  }

  if (contentSize.value > 0) {
    if (currentOffset.value <= 0) {
      currentOffset.value = (currentOffset.value % contentSize.value) + contentSize.value
    }
    if (currentOffset.value >= contentSize.value) {
      currentOffset.value = currentOffset.value % contentSize.value
    }
  }
}

let animationFrameId: number | null = null
let lastTimestamp: number | null = null

let speedFactor = 1

const animate = (timestamp: number): void => {
  if (!lastTimestamp) {
    lastTimestamp = timestamp
    animationFrameId = requestAnimationFrame(animate)
    return
  }

  const deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  const target = props.pauseOnHover && isHovering.value ? 0 : 1
  speedFactor += (target - speedFactor) * 0.05

  if (Math.abs(speedFactor) < 0.001) {
    speedFactor = 0
  }
  if (Math.abs(1 - speedFactor) < 0.001) {
    speedFactor = 1
  }

  if (speedFactor > 0 && contentSize.value > 0) {
    const moveStep = (props.speed * deltaTime * speedFactor) / 1000

    if (props.direction === 'right' || props.direction === 'down') {
      currentOffset.value -= moveStep
      if (currentOffset.value <= 0) {
        currentOffset.value = (currentOffset.value % contentSize.value) + contentSize.value
      }
    } else {
      currentOffset.value += moveStep
      if (currentOffset.value >= contentSize.value) {
        currentOffset.value = currentOffset.value % contentSize.value
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const onMouseEnter = (): void => {
  isHovering.value = true
}

const onMouseLeave = (): void => {
  isHovering.value = false
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measure()

  resizeObserver = new ResizeObserver(() => {
    measure()
  })
  if (marqueeElementRef.value) {
    resizeObserver.observe(marqueeElementRef.value)
  }
  if (marqueeContentElementRef.value) {
    resizeObserver.observe(marqueeContentElementRef.value)
  }

  lastTimestamp = null
  animationFrameId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

watch(
  () => props.direction,
  async (newDirection) => {
    await measure()

    if (newDirection === 'right' || newDirection === 'down') {
      currentOffset.value = contentSize.value
    } else {
      currentOffset.value = 0
    }
  }
)
</script>

<style scoped>
.tk-marquee {
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;

  &.tk-marquee--left,
  &.tk-marquee--right {
    .tk-marquee-track {
      flex-direction: row;
    }
  }

  &.tk-marquee--up,
  &.tk-marquee--down {
    .tk-marquee-track {
      flex-direction: column;
    }
  }

  .tk-marquee-track {
    flex: none;
    display: flex;
    will-change: transform;

    .tk-marquee-content {
      flex: none;
      display: flex;
      min-width: min-content;
      min-height: min-content;
    }
  }
}
</style>
