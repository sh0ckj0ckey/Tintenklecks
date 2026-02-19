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
        class="tk-checkbox-box-icon icon-checkmark"
        :class="{ active: !props.indeterminate && props.modelValue }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5 L6.5 11.5 L12.5 5.5"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
        />
      </svg>
      <svg
        class="tk-checkbox-box-icon icon-minus"
        :class="{ active: props.indeterminate }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M4 8 L12 8" fill="none" stroke="currentColor" stroke-linecap="round" pathLength="1" />
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
    position: relative;
    border-radius: 4px;
    background-color: transparent;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0),
      inset 0px 1px 0px rgba(255, 255, 255, 0.15),
      inset 0px 0px 3px rgba(255, 255, 255, 0.1);
    transition:
      background-color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.1s;

    .tk-checkbox-box-icon {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s linear;

      path {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        stroke-width: 1px;
        transition: stroke-dashoffset 0.2s ease-in;
      }

      &.icon-checkmark.active {
        opacity: 1;

        path {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.2s ease-in-out;
        }
      }

      &.icon-minus.active {
        opacity: 1;

        path {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.2s ease-out;
        }
      }
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
      width: 16px;
      height: 16px;
      border: 1px solid color-mix(in srgb, var(--tk-color-foreground), #000 90%);
      border-radius: 2px;

      .tk-checkbox-box-icon {
        path {
          stroke-width: 1.4px;
        }
      }
    }
  }

  &.tk-checkbox--medium {
    font-size: 14px;
    gap: 8px;

    .tk-checkbox-box {
      width: 22px;
      height: 22px;
      border: 1px solid color-mix(in srgb, var(--tk-color-foreground), #000 90%);
      border-radius: 4px;

      .tk-checkbox-box-icon {
        path {
          stroke-width: 1.4px;
        }
      }
    }
  }

  &.tk-checkbox--large {
    font-size: 17px;
    gap: 10px;

    .tk-checkbox-box {
      width: 28px;
      height: 28px;
      border: 1px solid color-mix(in srgb, var(--tk-color-foreground), #000 90%);
      border-radius: 6px;

      .tk-checkbox-box-icon {
        path {
          stroke-width: 1.4px;
        }
      }
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

  &:hover {
    .tk-checkbox-box {
      background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1),
        inset 0px 0px 3px rgba(255, 255, 255, 0.05);
    }
  }

  &:active {
    .tk-checkbox-box {
      background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #000 8%);
      transform: translateY(1px);
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1),
        inset 0px 0px 3px rgba(255, 255, 255, 0.01);
    }
  }

  &:has(input:focus-visible:not(:disabled)) {
    outline: 2px dashed currentColor;
    outline-offset: 2px;
  }
}
</style>
