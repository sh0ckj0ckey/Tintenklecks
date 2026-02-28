<template>
  <div class="tk-radio-buttons" :class="`tk-radio-buttons--${props.direction}`" role="radiogroup" :aria-disabled="props.disabled">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup generic="T">
import { provide, toRefs, nextTick, computed, useId } from 'vue'
import { radioGroupKey } from './tokens'

const generateId = `tk-radio-buttons-${useId()}`

const props = withDefaults(
  defineProps<{
    modelValue?: T
    name?: string
    direction?: 'row' | 'column'
    disabled?: boolean
  }>(),
  {
    direction: 'row',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
  (e: 'change', value: T): void
}>()

const name = computed(() => props.name || generateId)

const updateValue = (value: T): void => {
  emit('update:modelValue', value)
  nextTick(() => emit('change', value))
}

const { modelValue, disabled } = toRefs(props)

provide(radioGroupKey, {
  modelValue,
  name,
  disabled,
  updateValue: updateValue as (val: unknown) => void
})
</script>

<style scoped>
.tk-radio-buttons {
  display: inline-flex;
  flex-wrap: wrap;

  &.tk-radio-buttons--row {
    flex-direction: row;
    align-items: center;
  }

  &.tk-radio-buttons--column {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
