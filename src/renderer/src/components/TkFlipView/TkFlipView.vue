<template>
  <div class="tk-flipview" :class="[`tk-flipview--${props.direction}`]">
    <div class="tk-flipview-viewport">
      <div
        ref="trackElementRef"
        class="tk-flipview-track"
        :class="{ 'tk-flipview-track--transitioning': isTransitioning }"
        :style="flipTrackStyle"
        @transitionend="onTransitionEnd"
      >
        <div v-for="(item, index) in computedSlides" :key="index" class="tk-flipview-item">
          <slot :item="item" :index="getOriginalIndex(index)"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T">
import { ref, computed, useTemplateRef, watch, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    loop?: boolean
    direction?: 'horizontal' | 'vertical'
  }>(),
  {
    direction: 'horizontal',
    loop: false
  }
)

defineSlots<{
  default(props: { item: T; index: number }): unknown
}>()

const trackElementRef = useTemplateRef('trackElementRef')

const slideCount = computed(() => props.items.length)

const computedSlides = computed<T[]>(() => {
  if (slideCount.value === 0) return []
  if (!props.loop || slideCount.value === 1) return props.items

  return [props.items[slideCount.value - 1], ...props.items, props.items[0]]
})

const currentIndex = ref(props.loop && slideCount.value > 1 ? 1 : 0)

const isTransitioning = ref(false)
const isAnimating = ref(false)

watch(
  () => props.items,
  () => {
    isTransitioning.value = false
    isAnimating.value = false
    currentIndex.value = props.loop && slideCount.value > 1 ? 1 : 0
  },
  { deep: false }
)

const flipTrackStyle = computed<CSSProperties>(() => {
  if (slideCount.value === 0) return {}

  const total = computedSlides.value.length
  const percent = currentIndex.value * (100 / total)
  const isHorizontal = props.direction === 'horizontal'

  return {
    width: isHorizontal ? `${total * 100}%` : '100%',
    height: isHorizontal ? '100%' : `${total * 100}%`,
    transform: isHorizontal ? `translateX(-${percent}%)` : `translateY(-${percent}%)`
  }
})

const getOriginalIndex = (index: number): number => {
  if (!props.loop || slideCount.value <= 1) return index
  if (index === 0) return slideCount.value - 1
  if (index === computedSlides.value.length - 1) return 0
  return index - 1
}

const selectedIndex = computed(() => getOriginalIndex(currentIndex.value))
const selectedItem = computed(() => props.items[selectedIndex.value])

const next = (): void => {
  if (slideCount.value <= 1 || isAnimating.value) return
  isAnimating.value = true
  isTransitioning.value = true
  currentIndex.value++
}

const prev = (): void => {
  if (slideCount.value <= 1 || isAnimating.value) return
  isAnimating.value = true
  isTransitioning.value = true
  currentIndex.value--
}

const goTo = (targetOriginalIndex: number): void => {
  if (slideCount.value <= 1 || isAnimating.value) return
  if (targetOriginalIndex < 0 || targetOriginalIndex >= slideCount.value) return
  if (targetOriginalIndex === selectedIndex.value) return

  isAnimating.value = true
  isTransitioning.value = true
  currentIndex.value = props.loop ? targetOriginalIndex + 1 : targetOriginalIndex
}

const onTransitionEnd = (event: TransitionEvent): void => {
  if (event.target !== trackElementRef.value) return

  isAnimating.value = false

  if (!props.loop) return

  const total = computedSlides.value.length
  let needsJump = false

  if (currentIndex.value <= 0) {
    currentIndex.value = total - 2
    needsJump = true
  } else if (currentIndex.value >= total - 1) {
    currentIndex.value = 1
    needsJump = true
  }

  if (needsJump) {
    isTransitioning.value = false
    if (trackElementRef.value) {
      void trackElementRef.value.offsetHeight
    }
  }
}

defineExpose({
  prev,
  next,
  goTo,
  selectedIndex,
  selectedItem
})
</script>

<style scoped>
.tk-flipview {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  .tk-flipview-viewport {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    margin: 0;
    padding: 0;
    border: none;

    .tk-flipview-track {
      display: flex;
      width: 100%;
      height: 100%;
      will-change: transform;
      transition: none;

      &.tk-flipview-track--transitioning {
        transition: transform 0.3s ease-in-out;
      }

      .tk-flipview-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
      }
    }
  }

  &.tk-flipview--horizontal {
    .tk-flipview-track {
      flex-direction: row;
    }
  }

  &.tk-flipview--vertical {
    .tk-flipview-track {
      flex-direction: column;
    }
  }
}
</style>
