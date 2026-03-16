<template>
  <div class="tk-flipview" :class="[`tk-flipview--${props.direction}`]">
    <div class="tk-flipview-viewport">
      <div
        ref="trackElementRef"
        class="tk-flipview-track"
        :class="{ 'tk-flipview-track--with-transition': isTransitionEnabled }"
        :style="flipviewTrackStyle"
        @transitionend="onTransitionEnd"
      >
        <div v-for="(item, index) in slides" :key="index" class="tk-flipview-item">
          <slot :item="item" :index="getActualIndex(index)"></slot>
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

const items = computed<T[]>(() => props.items || [])

const slides = computed<T[]>(() => {
  const length = items.value.length
  return length > 0 && props.loop ? [items.value[length - 1], ...items.value, items.value[0]] : items.value
})

const index = ref(items.value.length > 0 && props.loop ? 1 : 0)

const isTransitionEnabled = ref(false)

let isFlipping = false

watch([() => items.value, () => items.value.length], ([, newLength]) => {
  isFlipping = false
  isTransitionEnabled.value = false
  index.value = newLength > 0 && props.loop ? 1 : 0
})

const flipviewTrackStyle = computed<CSSProperties>(() => {
  if (items.value.length === 0) {
    return {}
  }

  const slideCount = slides.value.length
  const percent = index.value * (100 / slideCount)
  const isHorizontal = props.direction === 'horizontal'
  return {
    width: isHorizontal ? `${slideCount * 100}%` : '100%',
    height: isHorizontal ? '100%' : `${slideCount * 100}%`,
    transform: isHorizontal ? `translateX(-${percent}%)` : `translateY(-${percent}%)`
  }
})

const getActualIndex = (slideIndex: number): number => {
  const length = items.value.length
  if (length <= 0 || !props.loop) {
    return slideIndex
  }

  if (slideIndex === 0) {
    return length - 1
  }
  if (slideIndex === length + 1) {
    return 0
  }
  return slideIndex - 1
}

const selectedIndex = computed(() => getActualIndex(index.value))
const selectedItem = computed(() => items.value[selectedIndex.value])

const next = (): void => {
  if (isFlipping) {
    return
  }

  const length = items.value.length
  if (length <= 0) {
    return
  }

  if (!props.loop && index.value >= length - 1) {
    return
  }

  isFlipping = true
  isTransitionEnabled.value = true
  index.value++
}

const prev = (): void => {
  if (isFlipping) {
    return
  }

  const length = items.value.length
  if (length <= 0) {
    return
  }

  if (!props.loop && index.value <= 0) {
    return
  }

  isFlipping = true
  isTransitionEnabled.value = true
  index.value--
}

const goTo = (targetIndex: number): void => {
  if (isFlipping) {
    return
  }

  const length = items.value.length
  if (length <= 0) {
    return
  }

  if (targetIndex === selectedIndex.value || targetIndex < 0 || targetIndex >= length) {
    return
  }

  isFlipping = true
  isTransitionEnabled.value = true
  index.value = props.loop ? targetIndex + 1 : targetIndex
}

const onTransitionEnd = (event: TransitionEvent): void => {
  if (event.target !== trackElementRef.value) {
    return
  }

  isFlipping = false

  if (!props.loop) {
    return
  }

  const slideCount = slides.value.length

  if (index.value > 0 && index.value < slideCount - 1) {
    return
  }

  isTransitionEnabled.value = false

  if (index.value <= 0) {
    index.value = slideCount - 2
  } else if (index.value >= slideCount - 1) {
    index.value = 1
  }

  // Force browser reflow to apply 'transition: none' immediately without animation
  if (trackElementRef.value) {
    void trackElementRef.value.offsetHeight
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

    .tk-flipview-track {
      display: flex;
      will-change: transform;
      transition: none;

      &.tk-flipview-track--with-transition {
        transition: transform 0.3s ease-out;
      }

      .tk-flipview-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
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
