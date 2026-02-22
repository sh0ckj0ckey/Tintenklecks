<template>
  <label
    class="tk-toggle-switch"
    :class="[
      `tk-toggle-switch--${props.theme}`,
      `tk-toggle-switch--${props.size}`,
      `tk-toggle-switch--${props.orientation}`,
      { disabled: props.disabled }
    ]"
    :aria-disabled="props.disabled"
  >
    <input type="checkbox" :checked="props.modelValue" :disabled="props.disabled" @change="onChange" />
    <span class="tk-toggle-switch-track">
      <span class="tk-toggle-switch-thumb"></span>
    </span>
    <span class="tk-toggle-switch-content">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    theme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
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

<style>
@property --tk-toggle-switch-background-linear-gradient-start {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

@property --tk-toggle-switch-background-linear-gradient-end {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}
</style>

<style scoped>
.tk-toggle-switch {
  --tk-toggle-switch--primary-foreground: #f8f8f8cc;
  --tk-toggle-switch--secondary-foreground: #1f1f1f;
  --tk-toggle-switch--success-foreground: #f0fdf4cc;
  --tk-toggle-switch--warning-foreground: #f0fdf4cc;
  --tk-toggle-switch--danger-foreground: #fff1f0cc;

  --tk-toggle-switch--primary-background-start: #619bcb;
  --tk-toggle-switch--primary-background-end: #4984b4;
  --tk-toggle-switch--secondary-background-start: #f7f7f6;
  --tk-toggle-switch--secondary-background-end: #f3f4f2;
  --tk-toggle-switch--success-background-start: #1db054;
  --tk-toggle-switch--success-background-end: #0b6b30;
  --tk-toggle-switch--warning-background-start: #ffdb70;
  --tk-toggle-switch--warning-background-end: #e09600;
  --tk-toggle-switch--danger-background-start: #ff4b59;
  --tk-toggle-switch--danger-background-end: #d10014;

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

  .tk-toggle-switch-track {
    --tk-toggle-switch-background-linear-gradient-start: #ffffff05;
    --tk-toggle-switch-background-linear-gradient-end: #ffffff05;

    flex: none;
    display: flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--tk-color-foreground), #000 90%);
    border-radius: 999px;
    background: linear-gradient(
      to left,
      var(--tk-toggle-switch-background-linear-gradient-start),
      var(--tk-toggle-switch-background-linear-gradient-end)
    );
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5);
    transition:
      background-color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      --tk-toggle-switch-background-linear-gradient-start 0.2s,
      --tk-toggle-switch-background-linear-gradient-end 0.2s;

    .tk-toggle-switch-thumb {
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      border: 1px solid #202020;
      border-radius: 999px;
      background-color: rgba(255, 255, 255, 0.05);
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0),
        inset 0px 1px 0px rgba(255, 255, 255, 0.08),
        inset 0px 0px 3px rgba(255, 255, 255, 0.03);
      transition:
        background-color 0.2s,
        border 0.2s,
        width 0.2s,
        box-shadow 0.2s,
        transform 0.2s;
    }
  }

  .tk-toggle-switch-content {
    flex: none;
    display: flex;
    min-width: min-content;
    min-height: min-content;
  }

  &.tk-toggle-switch--small {
    font-size: 13px;
    gap: 6px;

    .tk-toggle-switch-track {
      width: 35px;
      height: 20px;

      .tk-toggle-switch-thumb {
        width: 12px;
        height: 12px;
      }
    }
  }

  &.tk-toggle-switch--medium {
    font-size: 14px;
    gap: 8px;

    .tk-toggle-switch-track {
      width: 42px;
      height: 24px;

      .tk-toggle-switch-thumb {
        width: 16px;
        height: 16px;
      }
    }
  }

  &.tk-toggle-switch--large {
    font-size: 17px;
    gap: 10px;

    .tk-toggle-switch-track {
      width: 49px;
      height: 28px;

      .tk-toggle-switch-thumb {
        width: 20px;
        height: 20px;
      }
    }
  }

  &.tk-toggle-switch--horizontal {
    flex-direction: row;
  }

  &.tk-toggle-switch--vertical {
    flex-direction: column-reverse;
  }

  &.tk-toggle-switch--horizontal-reverse {
    flex-direction: row-reverse;
  }

  &.tk-toggle-switch--vertical-reverse {
    flex-direction: column;
  }

  &.disabled {
    opacity: 0.6;
  }

  &:has(input:checked:not(:disabled)) {
    &.tk-toggle-switch--small .tk-toggle-switch-track .tk-toggle-switch-thumb {
      transform: translateX(15px);
    }
    &.tk-toggle-switch--medium .tk-toggle-switch-track .tk-toggle-switch-thumb {
      transform: translateX(18px);
    }
    &.tk-toggle-switch--large .tk-toggle-switch-track .tk-toggle-switch-thumb {
      transform: translateX(21px);
    }

    &.tk-toggle-switch--primary {
      .tk-toggle-switch-track {
        --tk-toggle-switch-background-linear-gradient-start: var(--tk-toggle-switch--primary-background-start);
        --tk-toggle-switch-background-linear-gradient-end: var(--tk-toggle-switch--primary-background-end);

        .tk-toggle-switch-thumb {
          border-color: color-mix(in srgb, var(--tk-toggle-switch--primary-background-end), #000 8%);
          background-color: var(--tk-toggle-switch--primary-foreground);
        }
      }
    }

    &.tk-toggle-switch--secondary {
      .tk-toggle-switch-track {
        --tk-toggle-switch-background-linear-gradient-start: var(--tk-toggle-switch--secondary-background-start);
        --tk-toggle-switch-background-linear-gradient-end: var(--tk-toggle-switch--secondary-background-end);

        .tk-toggle-switch-thumb {
          border-color: color-mix(in srgb, var(--tk-toggle-switch--secondary-background-end), #000 8%);
          background-color: var(--tk-toggle-switch--secondary-foreground);
        }
      }
    }

    &.tk-toggle-switch--success {
      .tk-toggle-switch-track {
        --tk-toggle-switch-background-linear-gradient-start: var(--tk-toggle-switch--success-background-start);
        --tk-toggle-switch-background-linear-gradient-end: var(--tk-toggle-switch--success-background-end);

        .tk-toggle-switch-thumb {
          border-color: color-mix(in srgb, var(--tk-toggle-switch--success-background-end), #000 8%);
          background-color: var(--tk-toggle-switch--success-foreground);
        }
      }
    }

    &.tk-toggle-switch--warning {
      .tk-toggle-switch-track {
        --tk-toggle-switch-background-linear-gradient-start: var(--tk-toggle-switch--warning-background-start);
        --tk-toggle-switch-background-linear-gradient-end: var(--tk-toggle-switch--warning-background-end);

        .tk-toggle-switch-thumb {
          border-color: color-mix(in srgb, var(--tk-toggle-switch--warning-background-end), #000 8%);
          background-color: var(--tk-toggle-switch--warning-foreground);
        }
      }
    }

    &.tk-toggle-switch--danger {
      .tk-toggle-switch-track {
        --tk-toggle-switch-background-linear-gradient-start: var(--tk-toggle-switch--danger-background-start);
        --tk-toggle-switch-background-linear-gradient-end: var(--tk-toggle-switch--danger-background-end);

        .tk-toggle-switch-thumb {
          border-color: color-mix(in srgb, var(--tk-toggle-switch--danger-background-end), #000 8%);
          background-color: var(--tk-toggle-switch--danger-foreground);
        }
      }
    }
  }

  &:hover {
    &:not(:has(input:checked:not(:disabled))) {
      .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.2),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1),
          inset 0px 0px 3px rgba(255, 255, 255, 0.05);
      }
    }

    &:has(input:checked:not(:disabled)) {
      .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.2),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1),
          inset 0px 0px 3px rgba(255, 255, 255, 0.05);
      }

      &.tk-toggle-switch--primary .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--primary-foreground), #fff 80%);
      }

      &.tk-toggle-switch--secondary .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--secondary-foreground), #fff 8%);
      }

      &.tk-toggle-switch--success .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--success-foreground), #fff 80%);
      }

      &.tk-toggle-switch--warning .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--warning-foreground), #fff 80%);
      }

      &.tk-toggle-switch--danger .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--danger-foreground), #fff 80%);
      }
    }
  }

  &:active {
    &:not(:has(input:checked:not(:disabled))) {
      .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #000 8%);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.2),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1),
          inset 0px 0px 3px rgba(255, 255, 255, 0.01);
      }

      &.tk-toggle-switch--small .tk-toggle-switch-track .tk-toggle-switch-thumb {
        width: 16px;
      }
      &.tk-toggle-switch--medium .tk-toggle-switch-track .tk-toggle-switch-thumb {
        width: 22px;
      }
      &.tk-toggle-switch--large .tk-toggle-switch-track .tk-toggle-switch-thumb {
        width: 28px;
      }
    }

    &:has(input:checked:not(:disabled)) {
      .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #000 8%);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.2),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1),
          inset 0px 0px 3px rgba(255, 255, 255, 0.01);
      }

      &.tk-toggle-switch--small .tk-toggle-switch-track .tk-toggle-switch-thumb {
        width: 16px;
        transform: translateX(11px);
      }
      &.tk-toggle-switch--medium .tk-toggle-switch-track .tk-toggle-switch-thumb {
        width: 22px;
        transform: translateX(12px);
      }
      &.tk-toggle-switch--large .tk-toggle-switch-track .tk-toggle-switch-thumb {
        width: 28px;
        transform: translateX(13px);
      }

      &.tk-toggle-switch--primary .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--primary-foreground), transparent 20%);
      }

      &.tk-toggle-switch--secondary .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--secondary-foreground), transparent 20%);
      }

      &.tk-toggle-switch--success .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--success-foreground), transparent 20%);
      }

      &.tk-toggle-switch--warning .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--warning-foreground), transparent 20%);
      }

      &.tk-toggle-switch--danger .tk-toggle-switch-track .tk-toggle-switch-thumb {
        background-color: color-mix(in srgb, var(--tk-toggle-switch--danger-foreground), transparent 20%);
      }
    }
  }

  &:has(input:focus-visible:not(:disabled)) {
    outline: 2px dashed var(--tk-color-foreground);
    outline-offset: 2px;
  }
}
</style>
