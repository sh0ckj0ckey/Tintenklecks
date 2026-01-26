<template>
  <button
    type="button"
    class="tk-button"
    :class="[`tk-button--${props.theme}`, { deboss: props.deboss }]"
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
    @click="onClick"
  >
    <span class="tk-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  theme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  deboss?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style>
@property --tk-button-background-linear-gradient-start {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

@property --tk-button-background-linear-gradient-end {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}
</style>

<style scoped>
.tk-button {
  --tk-button--primary-foreground: #f8f8f8;
  --tk-button--secondary-foreground: #f8f8f8;
  --tk-button--success-foreground: #f0fdf4;
  --tk-button--warning-foreground: #1f1f1f;
  --tk-button--danger-foreground: #fff1f0;

  --tk-button--primary-border: #153483;
  --tk-button--secondary-border: #202020;
  --tk-button--success-border: #1e3a23;
  --tk-button--warning-border: #594118;
  --tk-button--danger-border: #4a1a1a;

  --tk-button--primary-background-start: #619bcb;
  --tk-button--primary-background-end: #4984b4;
  --tk-button--secondary-background-start: #3a3a3c;
  --tk-button--secondary-background-end: #2c2c2e;
  --tk-button--success-background-start: #1db054;
  --tk-button--success-background-end: #0b6b30;
  --tk-button--warning-background-start: #ffdb70;
  --tk-button--warning-background-end: #e09600;
  --tk-button--danger-background-start: #ff4b59;
  --tk-button--danger-background-end: #d10014;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: linear-gradient(
    to bottom,
    var(--tk-button-background-linear-gradient-start),
    var(--tk-button-background-linear-gradient-end)
  );
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  cursor: default;
  transition:
    --tk-button-background-linear-gradient-start 0.2s,
    --tk-button-background-linear-gradient-end 0.2s,
    transform 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  .tk-button-content {
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

.tk-button--primary {
  --tk-button-background-linear-gradient-start: var(--tk-button--primary-background-start);
  --tk-button-background-linear-gradient-end: var(--tk-button--primary-background-end);
  border: 1px solid var(--tk-button--primary-border);
  color: var(--tk-button--primary-foreground);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0),
    inset 0px 1px 0px rgba(255, 255, 255, 0.3),
    inset 0px 0px 3px rgba(255, 255, 255, 0.5);

  &.deboss .tk-button-content {
    filter: drop-shadow(0 -0.06em 0 rgba(0, 0, 0, 0.35)) drop-shadow(0 0.04em 0 rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--primary-background-start), #fff 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--primary-background-end), #fff 8%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.3),
      inset 0px 0px 3px rgba(255, 255, 255, 0.5);
  }

  &:active:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--primary-background-start), #000 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--primary-background-end), #000 8%);
    color: color-mix(in srgb, var(--tk-button--primary-foreground), #000 16%);
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.3),
      inset 0px 0px 3px rgba(255, 255, 255, 0.5);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button-background-linear-gradient-start);
    outline-offset: 2px;
  }
}

.tk-button--secondary {
  --tk-button-background-linear-gradient-start: var(--tk-button--secondary-background-start);
  --tk-button-background-linear-gradient-end: var(--tk-button--secondary-background-end);
  border: 1px solid var(--tk-button--secondary-border);
  color: var(--tk-button--secondary-foreground);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0),
    inset 0px 1px 0px rgba(255, 255, 255, 0.1),
    inset 0px 0px 3px rgba(255, 255, 255, 0.05);

  &.deboss .tk-button-content {
    filter: drop-shadow(0 -0.08em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.04em 0 rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--secondary-background-start), #fff 4%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--secondary-background-end), #fff 4%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 3px rgba(255, 255, 255, 0.05);
  }

  &:active:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--secondary-background-start), #000 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--secondary-background-end), #000 8%);
    color: color-mix(in srgb, var(--tk-button--secondary-foreground), #000 16%);
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 3px rgba(255, 255, 255, 0.05);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button-background-linear-gradient-start);
    outline-offset: 2px;
  }
}

.tk-button--success {
  --tk-button-background-linear-gradient-start: var(--tk-button--success-background-start);
  --tk-button-background-linear-gradient-end: var(--tk-button--success-background-end);
  border: 1px solid var(--tk-button--success-border);
  color: var(--tk-button--success-foreground);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0),
    inset 0px 1px 0px rgba(255, 255, 255, 0.25),
    inset 0px 0px 3px rgba(255, 255, 255, 0.4);

  &.deboss .tk-button-content {
    filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.06em 0 rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--success-background-start), #fff 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--success-background-end), #fff 8%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.4);
  }

  &:active:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--success-background-start), #000 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--success-background-end), #000 8%);
    color: color-mix(in srgb, var(--tk-button--success-foreground), #000 16%);
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.4);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button-background-linear-gradient-start);
    outline-offset: 2px;
  }
}

.tk-button--warning {
  --tk-button-background-linear-gradient-start: var(--tk-button--warning-background-start);
  --tk-button-background-linear-gradient-end: var(--tk-button--warning-background-end);
  border: 1px solid var(--tk-button--warning-border);
  color: var(--tk-button--warning-foreground);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0),
    inset 0px 1px 0px rgba(255, 255, 255, 0.65),
    inset 0px 0px 3px rgba(255, 255, 255, 0.95);

  &.deboss .tk-button-content {
    filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.15)) drop-shadow(0 0.08em 0 rgba(255, 255, 255, 0.6));
  }

  &:hover:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--warning-background-start), #fff 16%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--warning-background-end), #fff 16%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.65),
      inset 0px 0px 3px rgba(255, 255, 255, 0.95);
  }

  &:active:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--warning-background-start), #000 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--warning-background-end), #000 8%);
    color: color-mix(in srgb, var(--tk-button--warning-foreground), #000 16%);
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.65),
      inset 0px 0px 3px rgba(255, 255, 255, 0.95);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button-background-linear-gradient-start);
    outline-offset: 2px;
  }
}

.tk-button--danger {
  --tk-button-background-linear-gradient-start: var(--tk-button--danger-background-start);
  --tk-button-background-linear-gradient-end: var(--tk-button--danger-background-end);
  border: 1px solid var(--tk-button--danger-border);
  color: var(--tk-button--danger-foreground);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0),
    inset 0px 1px 0px rgba(255, 255, 255, 0.25),
    inset 0px 0px 3px rgba(255, 255, 255, 0.75);

  &.deboss .tk-button-content {
    filter: drop-shadow(0 -0.04em 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 0.05em 0 rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--danger-background-start), #fff 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--danger-background-end), #fff 8%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.75);
  }

  &:active:not(:disabled) {
    --tk-button-background-linear-gradient-start: color-mix(in srgb, var(--tk-button--danger-background-start), #000 8%);
    --tk-button-background-linear-gradient-end: color-mix(in srgb, var(--tk-button--danger-background-end), #000 8%);
    color: color-mix(in srgb, var(--tk-button--danger-foreground), #000 16%);
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.75);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button-background-linear-gradient-start);
    outline-offset: 2px;
  }
}
</style>
