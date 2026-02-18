<template>
  <label
    class="tk-checkbox"
    :class="[`tk-checkbox--${props.size}`, `tk-checkbox--${props.orientation}`, { disabled: props.disabled }]"
    :aria-disabled="props.disabled"
  >
    <!-- Use .prop modifier because 'indeterminate' is a DOM property, not an HTML attribute. -->
    <input type="checkbox" :checked="props.modelValue" .indeterminate="props.indeterminate" :disabled="props.disabled" @change="onChange" />
    <span class="tk-checkbox-box">
      <svg
        v-if="!props.indeterminate && props.modelValue"
        class="tk-checkbox-box-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="props.indeterminate"
        class="tk-checkbox-box-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
      </svg>
    </span>
    <span class="tk-checkbox-content">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    indeterminate?: boolean
    orientation?: 'horizontal' | 'vertical'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
  }>(),
  {
    indeterminate: false,
    orientation: 'horizontal',
    size: 'medium',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const onChange = (event: Event): void => {
  if (!props.disabled) {
    const target = event.target as HTMLInputElement
    const newValue = target.checked

    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>

<style scoped>
.tk-checkbox {
  --tk-checkbox-foreground: currentColor;
  --tk-checkbox-border: currentColor;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--tk-checkbox-foreground);
  font-size: 14px;
  font-weight: normal;
  cursor: default;
  transition:
    transform 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
  }

  .tk-checkbox-box {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 1px solid var(--tk-checkbox-border);
    border-radius: 4px;
    background-color: transparent;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.1s;

    .tk-checkbox-box-icon {
      width: 100%;
      height: 100%;
    }
  }

  .tk-checkbox-content {
    flex: none;
    display: flex;
    min-width: min-content;
    min-height: min-content;
  }

  &.tk-checkbox--small {
    font-size: 13px;
    gap: 6px;

    .tk-checkbox-box {
      width: 14px;
      height: 14px;
      border-radius: 2px;
    }
  }

  &.tk-checkbox--medium {
    font-size: 14px;
    gap: 8px;

    .tk-checkbox-box {
      width: 18px;
      height: 18px;
      border-radius: 3px;
    }
  }

  &.tk-checkbox--large {
    font-size: 16px;
    gap: 10px;

    .tk-checkbox-box {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }
  }

  &.tk-checkbox--horizontal {
    flex-direction: row;
  }

  &.tk-checkbox--vertical {
    flex-direction: column-reverse;
  }

  &.disabled {
    opacity: 0.6;
  }

  &:has(input:focus-visible:not(:disabled)) {
    outline: 2px dashed currentColor;
    outline-offset: 2px;
  }
}
</style>
