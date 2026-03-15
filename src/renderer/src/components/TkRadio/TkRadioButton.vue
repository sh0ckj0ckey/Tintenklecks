<template>
  <label
    class="tk-radio-button"
    :class="[`tk-radio-button--${props.orientation}`, `tk-radio-button--${props.size}`, { disabled: isDisabled }]"
    :aria-disabled="isDisabled"
  >
    <input type="radio" :checked="isChecked" :name="radioName" :disabled="isDisabled" @change="onChange" />
    <span class="tk-radio-button-circle">
      <span class="tk-radio-button-circle-dot" :class="{ active: isChecked }"></span>
    </span>
    <span class="tk-radio-button-content">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup generic="T">
import { computed, inject } from 'vue'
import { radioGroupKey } from './tokens'

const props = withDefaults(
  defineProps<{
    value: T
    modelValue?: T
    name?: string
    orientation?: 'horizontal' | 'horizontal-reverse' | 'vertical' | 'vertical-reverse'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
  }>(),
  {
    orientation: 'horizontal',
    size: 'medium',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
  (e: 'change', value: T): void
}>()

const radioGroup = inject(radioGroupKey, undefined)

const isChecked = computed(() => {
  const model = radioGroup ? radioGroup.modelValue.value : props.modelValue
  return model === props.value
})

const radioName = computed(() => {
  return radioGroup ? radioGroup.name.value : props.name
})

const isDisabled = computed(() => {
  return (radioGroup && radioGroup.disabled.value) || props.disabled
})

const onChange = (event: Event): void => {
  if (!isDisabled.value) {
    const target = event.target as HTMLInputElement
    if (!target.checked) {
      return
    }

    if (radioGroup) {
      radioGroup.updateValue(props.value)
    } else {
      emit('update:modelValue', props.value)
      emit('change', props.value)
    }
  }
}
</script>

<style scoped>
.tk-radio-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--tk-color-foreground);
  font-size: 14px;
  font-weight: normal;
  cursor: default;
  transition:
    color 0.2s,
    box-shadow 0.2s;

  input[type='radio'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
  }

  .tk-radio-button-circle {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--tk-color-foreground), #000 90%);
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.02);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0),
      inset 0px 1px 0px rgba(255, 255, 255, 0.15),
      inset 0px 0px 3px rgba(255, 255, 255, 0.1);
    transition:
      background-color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.1s;

    .tk-radio-button-circle-dot {
      flex: none;
      border-radius: 50%;
      background-color: currentColor;
      opacity: 0;
      transform: scale(0);
      transform-origin: center center;
      box-shadow:
        inset 0px 2px 3px rgba(0, 0, 0, 0.5),
        inset 0px -1px 1px rgba(255, 255, 255, 0.2);
      pointer-events: none;
      transition:
        opacity 0.2s linear,
        transform 0.2s ease-out;
      /* transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.26); */

      &.active {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  .tk-radio-button-content {
    flex: none;
    display: flex;
    min-width: min-content;
    min-height: min-content;
  }

  &.tk-radio-button--small {
    font-size: 13px;
    gap: 6px;

    .tk-radio-button-circle {
      width: 20px;
      height: 20px;

      .tk-radio-button-circle-dot {
        width: 10px;
        height: 10px;
      }
    }
  }

  &.tk-radio-button--medium {
    font-size: 14px;
    gap: 8px;

    .tk-radio-button-circle {
      width: 26px;
      height: 26px;

      .tk-radio-button-circle-dot {
        width: 12px;
        height: 12px;
      }
    }
  }

  &.tk-radio-button--large {
    font-size: 17px;
    gap: 10px;

    .tk-radio-button-circle {
      width: 30px;
      height: 30px;

      .tk-radio-button-circle-dot {
        width: 16px;
        height: 16px;
      }
    }
  }

  &.tk-radio-button--horizontal {
    flex-direction: row;
  }

  &.tk-radio-button--vertical {
    flex-direction: column-reverse;
  }

  &.tk-radio-button--horizontal-reverse {
    flex-direction: row-reverse;
  }

  &.tk-radio-button--vertical-reverse {
    flex-direction: column;
  }

  &.disabled {
    opacity: 0.6;
  }

  &:hover:not(.disabled) {
    .tk-radio-button-circle {
      background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1),
        inset 0px 0px 3px rgba(255, 255, 255, 0.05);
    }
  }

  &:active:not(.disabled) {
    .tk-radio-button-circle {
      background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #000 8%);
      transform: translateY(1px);
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1),
        inset 0px 0px 3px rgba(255, 255, 255, 0.01);
    }
  }

  &:has(input:focus-visible:not(:disabled)) {
    outline: 2px dashed var(--tk-color-foreground);
    outline-offset: 2px;
  }
}
</style>
