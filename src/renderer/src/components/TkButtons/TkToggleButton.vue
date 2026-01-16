<template>
  <button
    type="button"
    class="tk-toggle-button"
    :class="[`tk-toggle-button--${props.theme}`, props.modelValue ? 'on' : 'off', { deboss: props.deboss }]"
    :disabled="props.disabled"
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
@property --tk-toggle-button--primary-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #619bcb00;
}

@property --tk-toggle-button--primary-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #4984b400;
}

@property --tk-toggle-button--secondary-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #3a3a3c00;
}

@property --tk-toggle-button--secondary-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #2c2c2e00;
}

@property --tk-toggle-button--success-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #1db05400;
}
@property --tk-toggle-button--success-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #0b6b3000;
}

@property --tk-toggle-button--danger-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #ff4b5900;
}
@property --tk-toggle-button--danger-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #d1001400;
}

@property --tk-toggle-button--warning-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #ffdb7000;
}

@property --tk-toggle-button--warning-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #e0960000;
}
</style>

<style scoped>
.tk-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  color: var(--tk-color-foreground);
  cursor: default;
  transition:
    --tk-toggle-button--primary-background-start 0.15s,
    --tk-toggle-button--primary-background-end 0.15s,
    --tk-toggle-button--secondary-background-start 0.15s,
    --tk-toggle-button--secondary-background-end 0.15s,
    --tk-toggle-button--success-background-start 0.15s,
    --tk-toggle-button--success-background-end 0.15s,
    --tk-toggle-button--danger-background-start 0.15s,
    --tk-toggle-button--danger-background-end 0.15s,
    --tk-toggle-button--warning-background-start 0.15s,
    --tk-toggle-button--warning-background-end 0.15s,
    transform 0.1s,
    background-color 0.2s,
    border-color 0.2s,
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
}

.tk-toggle-button--primary {
  &.off {
    background: linear-gradient(
      to bottom,
      var(--tk-toggle-button--primary-background-start),
      var(--tk-toggle-button--primary-background-end)
    );
    box-shadow: none;

    &:hover:not(:disabled) {
      background-color: rgba(97, 155, 203, 0.15);
    }
    &:active:not(:disabled) {
      --tk-toggle-button--primary-background-start: color-mix(in srgb, #619bcb, black 20%);
      --tk-toggle-button--primary-background-end: color-mix(in srgb, #4984b4, black 20%);
      color: #f8f8f88c;
      transform: translateY(1px);
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.4),
        inset 0px 1px 2px rgba(0, 0, 0, 0.6),
        0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }

  &.on {
    --tk-toggle-button--primary-background-start: color-mix(in srgb, #619bcb, black 10%);
    --tk-toggle-button--primary-background-end: color-mix(in srgb, #4984b4, black 10%);
    color: #f8f8f8;
    border: 1px solid #002074;
    box-shadow:
      inset 0px 2px 5px rgba(0, 0, 0, 0.3),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(255, 255, 255, 0.1);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0px -0.06em 0.5px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0.05em 0.5px rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button--primary-background-start: #619bcb;
      --tk-toggle-button--primary-background-end: #4984b4;
    }
    &:active:not(:disabled) {
      --tk-toggle-button--primary-background-start: color-mix(in srgb, #619bcb, black 20%);
      --tk-toggle-button--primary-background-end: color-mix(in srgb, #4984b4, black 20%);
      color: #f8f8f88c;
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.5),
        inset 0px 1px 2px rgba(0, 0, 0, 0.7);
    }
    &:focus-visible:not(:disabled) {
      outline: 2px dashed var(--tk-toggle-button--primary-background-start);
      outline-offset: 2px;
    }
  }
}

/* =========================================
   Secondary Theme
   ========================================= */
.tk-toggle-button--secondary {
  &.off {
    background: linear-gradient(
      to bottom,
      var(--tk-toggle-button--secondary-background-start),
      var(--tk-toggle-button--secondary-background-end)
    );
    box-shadow: none;

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }
    &:active:not(:disabled) {
      --tk-toggle-button--secondary-background-start: color-mix(in srgb, #3a3a3c, black 20%);
      --tk-toggle-button--secondary-background-end: color-mix(in srgb, #2c2c2e, black 20%);
      color: #f8f8f88c;
      transform: translateY(1px);
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.4),
        inset 0px 1px 2px rgba(0, 0, 0, 0.6),
        0 1px 0 rgba(255, 255, 255, 0.05);
    }
  }

  &.on {
    --tk-toggle-button--secondary-background-start: color-mix(in srgb, #3a3a3c, black 10%);
    --tk-toggle-button--secondary-background-end: color-mix(in srgb, #2c2c2e, black 10%);
    color: #f8f8f8;
    border: 1px solid #1a1a1a;
    box-shadow:
      inset 0px 2px 5px rgba(0, 0, 0, 0.3),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(255, 255, 255, 0.05);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0px -0.08em 0.5px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0.05em 0.5px rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button--secondary-background-start: #3a3a3c;
      --tk-toggle-button--secondary-background-end: #2c2c2e;
    }
    &:active:not(:disabled) {
      --tk-toggle-button--secondary-background-start: color-mix(in srgb, #3a3a3c, black 20%);
      --tk-toggle-button--secondary-background-end: color-mix(in srgb, #2c2c2e, black 20%);
      color: #f8f8f88c;
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.5),
        inset 0px 1px 2px rgba(0, 0, 0, 0.7);
    }
    &:focus-visible:not(:disabled) {
      outline: 2px dashed currentColor;
      outline-offset: 2px;
    }
  }
}

/* =========================================
   Success Theme
   ========================================= */
.tk-toggle-button--success {
  &.off {
    background: linear-gradient(
      to bottom,
      var(--tk-toggle-button--success-background-start),
      var(--tk-toggle-button--success-background-end)
    );
    box-shadow: none;

    &:hover:not(:disabled) {
      background-color: rgba(29, 176, 84, 0.15);
    }
    &:active:not(:disabled) {
      --tk-toggle-button--success-background-start: color-mix(in srgb, #1db054, black 20%);
      --tk-toggle-button--success-background-end: color-mix(in srgb, #0b6b30, black 20%);
      color: #f0fdf48c;
      transform: translateY(1px);
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.4),
        inset 0px 1px 2px rgba(0, 0, 0, 0.6),
        0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }

  &.on {
    --tk-toggle-button--success-background-start: color-mix(in srgb, #1db054, black 10%);
    --tk-toggle-button--success-background-end: color-mix(in srgb, #0b6b30, black 10%);
    color: #f0fdf4;
    border: 1px solid #1e3a23;
    box-shadow:
      inset 0px 2px 5px rgba(0, 0, 0, 0.3),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(255, 255, 255, 0.1);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0px -0.08em 0.5px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0.05em 0.5px rgba(255, 255, 255, 0.2));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button--success-background-start: #1db054;
      --tk-toggle-button--success-background-end: #0b6b30;
    }
    &:active:not(:disabled) {
      --tk-toggle-button--success-background-start: color-mix(in srgb, #1db054, black 20%);
      --tk-toggle-button--success-background-end: color-mix(in srgb, #0b6b30, black 20%);
      color: #f0fdf48c;
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.5),
        inset 0px 1px 2px rgba(0, 0, 0, 0.7);
    }
    &:focus-visible:not(:disabled) {
      outline: 2px dashed var(--tk-toggle-button--success-background-start);
      outline-offset: 2px;
    }
  }
}

/* =========================================
   Warning Theme
   ========================================= */
.tk-toggle-button--warning {
  &.off {
    background: linear-gradient(
      to bottom,
      var(--tk-toggle-button--warning-background-start),
      var(--tk-toggle-button--warning-background-end)
    );
    box-shadow: none;

    &:hover:not(:disabled) {
      background-color: rgba(255, 219, 112, 0.2);
    }
    &:active:not(:disabled) {
      --tk-toggle-button--warning-background-start: color-mix(in srgb, #ffdb70, black 20%);
      --tk-toggle-button--warning-background-end: color-mix(in srgb, #e09600, black 20%);
      color: #1f1f1f8c;
      transform: translateY(1px);
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.2),
        inset 0px 1px 2px rgba(0, 0, 0, 0.3),
        0 1px 0 rgba(255, 255, 255, 0.4);
    }
  }

  &.on {
    --tk-toggle-button--warning-background-start: color-mix(in srgb, #ffdb70, black 10%);
    --tk-toggle-button--warning-background-end: color-mix(in srgb, #e09600, black 10%);
    color: #1f1f1f;
    border: 1px solid #594118;
    box-shadow:
      inset 0px 2px 5px rgba(0, 0, 0, 0.15),
      inset 0px 1px 2px rgba(0, 0, 0, 0.25),
      0 1px 0 rgba(255, 255, 255, 0.4);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0px -0.05em 0.5px rgba(0, 0, 0, 0.25)) drop-shadow(0px 0.08em 0.5px rgba(255, 255, 255, 0.6));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button--warning-background-start: #ffdb70;
      --tk-toggle-button--warning-background-end: #e09600;
    }
    &:active:not(:disabled) {
      --tk-toggle-button--warning-background-start: color-mix(in srgb, #ffdb70, black 20%);
      --tk-toggle-button--warning-background-end: color-mix(in srgb, #e09600, black 20%);
      color: #1f1f1f8c;
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.25),
        inset 0px 1px 2px rgba(0, 0, 0, 0.35);
    }
    &:focus-visible:not(:disabled) {
      outline: 2px dashed var(--tk-toggle-button--warning-background-start);
      outline-offset: 2px;
    }
  }
}

/* =========================================
   Danger Theme
   ========================================= */
.tk-toggle-button--danger {
  &.off {
    background: linear-gradient(
      to bottom,
      var(--tk-toggle-button--danger-background-start),
      var(--tk-toggle-button--danger-background-end)
    );
    box-shadow: none;

    &:hover:not(:disabled) {
      background-color: rgba(255, 75, 89, 0.15);
    }
    &:active:not(:disabled) {
      --tk-toggle-button--danger-background-start: color-mix(in srgb, #ff4b59, black 20%);
      --tk-toggle-button--danger-background-end: color-mix(in srgb, #d10014, black 20%);
      color: #fff1f0b2;
      transform: translateY(1px);
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.4),
        inset 0px 1px 2px rgba(0, 0, 0, 0.6),
        0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }

  &.on {
    --tk-toggle-button--danger-background-start: color-mix(in srgb, #ff4b59, black 10%);
    --tk-toggle-button--danger-background-end: color-mix(in srgb, #d10014, black 10%);
    color: #fff1f0;
    border: 1px solid #4a1a1a;
    box-shadow:
      inset 0px 2px 5px rgba(0, 0, 0, 0.3),
      inset 0px 1px 2px rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(255, 255, 255, 0.1);

    &.deboss .tk-toggle-button-content {
      filter: drop-shadow(0px -0.05em 0.5px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0.05em 0.5px rgba(255, 255, 255, 0.15));
    }

    &:hover:not(:disabled) {
      --tk-toggle-button--danger-background-start: #ff4b59;
      --tk-toggle-button--danger-background-end: #d10014;
    }
    &:active:not(:disabled) {
      --tk-toggle-button--danger-background-start: color-mix(in srgb, #ff4b59, black 20%);
      --tk-toggle-button--danger-background-end: color-mix(in srgb, #d10014, black 20%);
      color: #fff1f0b2;
      box-shadow:
        inset 0px 3px 6px rgba(0, 0, 0, 0.5),
        inset 0px 1px 2px rgba(0, 0, 0, 0.7);
    }
    &:focus-visible:not(:disabled) {
      outline: 2px dashed var(--tk-toggle-button--danger-background-start);
      outline-offset: 2px;
    }
  }
}
</style>
