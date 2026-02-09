<template>
  <button
    type="button"
    class="tk-toggle-button"
    :class="[`tk-toggle-button--${props.theme}`, props.modelValue ? 'on' : 'off', { deboss: props.deboss }]"
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
    :aria-pressed="props.modelValue"
    @click="onClick"
  >
    <span class="tk-toggle-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  theme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  deboss?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', newModelValue: boolean): void
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
    emit('click', event)
  }
}
</script>

<style>
@property --tk-toggle-button-background-linear-gradient-start {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

@property --tk-toggle-button-background-linear-gradient-end {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}
</style>

<style scoped>
.tk-toggle-button {
  --tk-toggle-button--primary-foreground: #f8f8f8;
  --tk-toggle-button--secondary-foreground: #1f1f1f;
  --tk-toggle-button--success-foreground: #f0fdf4;
  --tk-toggle-button--warning-foreground: #1f1f1f;
  --tk-toggle-button--danger-foreground: #fff1f0;

  --tk-toggle-button--primary-border: #153483;
  --tk-toggle-button--secondary-border: #202020;
  --tk-toggle-button--success-border: #1e3a23;
  --tk-toggle-button--warning-border: #594118;
  --tk-toggle-button--danger-border: #4a1a1a;

  --tk-toggle-button--primary-background-start: #619bcb;
  --tk-toggle-button--primary-background-end: #4984b4;
  --tk-toggle-button--secondary-background-start: #f7f7f6;
  --tk-toggle-button--secondary-background-end: #f3f4f2;
  --tk-toggle-button--success-background-start: #1db054;
  --tk-toggle-button--success-background-end: #0b6b30;
  --tk-toggle-button--warning-background-start: #ffdb70;
  --tk-toggle-button--warning-background-end: #e09600;
  --tk-toggle-button--danger-background-start: #ff4b59;
  --tk-toggle-button--danger-background-end: #d10014;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: linear-gradient(
    to bottom,
    var(--tk-toggle-button-background-linear-gradient-start),
    var(--tk-toggle-button-background-linear-gradient-end)
  );
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  cursor: default;
  transition:
    --tk-toggle-button-background-linear-gradient-start 0.2s,
    --tk-toggle-button-background-linear-gradient-end 0.2s,
    transform 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  .tk-toggle-button-content {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: inherit;
    justify-content: inherit;
  }

  &:disabled {
    opacity: 0.6;
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-toggle-button-background-linear-gradient-start);
    outline-offset: 2px;
  }

  &.off {
    --tk-toggle-button-background-linear-gradient-start: rgba(255, 255, 255, 0.02);
    --tk-toggle-button-background-linear-gradient-end: rgba(255, 255, 255, 0.02);
    border: 1px solid #202020;
    color: #f8f8f8;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 2px rgba(255, 255, 255, 0.05);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0 -0.08em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.04em 0 rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1),
        inset 0px 0px 3px rgba(255, 255, 255, 0.05);
    }
  }
}

.tk-toggle-button--primary {
  &.off {
    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--primary-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--primary-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--primary-foreground), var(--tk-toggle-button--primary-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);

      &.deboss .tk-toggle-button-content {
        filter: drop-shadow(0 -0.06em 0 rgba(0, 0, 0, 0.35)) drop-shadow(0 0.04em 0 rgba(255, 255, 255, 0.15));
      }
    }
  }

  &.on {
    --tk-toggle-button-background-linear-gradient-start: var(--tk-toggle-button--primary-background-start);
    --tk-toggle-button-background-linear-gradient-end: var(--tk-toggle-button--primary-background-end);
    border: 1px solid var(--tk-toggle-button--primary-border);
    color: var(--tk-toggle-button--primary-foreground);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0 -0.06em 0 rgba(0, 0, 0, 0.35)) drop-shadow(0 0.04em 0 rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--primary-background-start), #fff 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--primary-background-end), #fff 8%);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.04),
        inset 0px 1px 3px rgba(0, 0, 0, 0.25),
        inset 0px 1px 1px rgba(0, 0, 0, 0.4);
    }

    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--primary-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--primary-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--primary-foreground), var(--tk-toggle-button--primary-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);
    }
  }
}

.tk-toggle-button--secondary {
  &.off {
    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--secondary-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--secondary-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--secondary-foreground), var(--tk-toggle-button--secondary-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);

      &.deboss .tk-toggle-button-content {
        filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.15)) drop-shadow(0 0.08em 0 rgba(255, 255, 255, 0.6));
      }
    }
  }

  &.on {
    --tk-toggle-button-background-linear-gradient-start: var(--tk-toggle-button--secondary-background-start);
    --tk-toggle-button-background-linear-gradient-end: var(--tk-toggle-button--secondary-background-end);
    border: 1px solid var(--tk-toggle-button--secondary-border);
    color: var(--tk-toggle-button--secondary-foreground);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.15)) drop-shadow(0 0.08em 0 rgba(255, 255, 255, 0.6));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--secondary-background-start), #fff 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--secondary-background-end), #fff 8%);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.04),
        inset 0px 1px 3px rgba(0, 0, 0, 0.25),
        inset 0px 1px 1px rgba(0, 0, 0, 0.4);
    }

    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--secondary-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--secondary-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--secondary-foreground), var(--tk-toggle-button--secondary-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);
    }
  }
}

.tk-toggle-button--success {
  &.off {
    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--success-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--success-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--success-foreground), var(--tk-toggle-button--success-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);

      &.deboss .tk-toggle-button-content {
        filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.06em 0 rgba(255, 255, 255, 0.15));
      }
    }
  }

  &.on {
    --tk-toggle-button-background-linear-gradient-start: var(--tk-toggle-button--success-background-start);
    --tk-toggle-button-background-linear-gradient-end: var(--tk-toggle-button--success-background-end);
    border: 1px solid var(--tk-toggle-button--success-border);
    color: var(--tk-toggle-button--success-foreground);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.06em 0 rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--success-background-start), #fff 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--success-background-end), #fff 8%);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.04),
        inset 0px 1px 3px rgba(0, 0, 0, 0.25),
        inset 0px 1px 1px rgba(0, 0, 0, 0.4);
    }

    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--success-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--success-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--success-foreground), var(--tk-toggle-button--success-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);
    }
  }
}

.tk-toggle-button--warning {
  &.off {
    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--warning-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--warning-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--warning-foreground), var(--tk-toggle-button--warning-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);

      &.deboss .tk-toggle-button-content {
        filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.15)) drop-shadow(0 0.08em 0 rgba(255, 255, 255, 0.6));
      }
    }
  }

  &.on {
    --tk-toggle-button-background-linear-gradient-start: var(--tk-toggle-button--warning-background-start);
    --tk-toggle-button-background-linear-gradient-end: var(--tk-toggle-button--warning-background-end);
    border: 1px solid var(--tk-toggle-button--warning-border);
    color: var(--tk-toggle-button--warning-foreground);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.15)) drop-shadow(0 0.08em 0 rgba(255, 255, 255, 0.6));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--warning-background-start), #fff 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--warning-background-end), #fff 8%);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.04),
        inset 0px 1px 3px rgba(0, 0, 0, 0.25),
        inset 0px 1px 1px rgba(0, 0, 0, 0.4);
    }

    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--warning-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--warning-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--warning-foreground), var(--tk-toggle-button--warning-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);
    }
  }
}

.tk-toggle-button--danger {
  &.off {
    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--danger-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--danger-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--danger-foreground), var(--tk-toggle-button--danger-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);

      &.deboss .tk-toggle-button-content {
        filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.05em 0 rgba(255, 255, 255, 0.15));
      }
    }
  }

  &.on {
    --tk-toggle-button-background-linear-gradient-start: var(--tk-toggle-button--danger-background-start);
    --tk-toggle-button-background-linear-gradient-end: var(--tk-toggle-button--danger-background-end);
    border: 1px solid var(--tk-toggle-button--danger-border);
    color: var(--tk-toggle-button--danger-foreground);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.05em 0 rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--danger-background-start), #fff 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--danger-background-end), #fff 8%);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.04),
        inset 0px 1px 3px rgba(0, 0, 0, 0.25),
        inset 0px 1px 1px rgba(0, 0, 0, 0.4);
    }

    &:active:not(:disabled) {
      --tk-toggle-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-toggle-button--danger-background-start), #000 8%);
      --tk-toggle-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-toggle-button--danger-background-end), #000 8%);
      color: color-mix(in srgb, var(--tk-toggle-button--danger-foreground), var(--tk-toggle-button--danger-background-start) 16%);
      transform: translateY(1px);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0px 3px 8px rgba(0, 0, 0, 0.5),
        inset 0px 2px 4px rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
