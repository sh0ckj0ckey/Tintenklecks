<template>
  <button
    type="button"
    class="tk-hyperlink-button"
    :class="[`tk-hyperlink-button--${props.theme}`, { emboss: props.emboss }]"
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
    @click="onClick"
  >
    <span class="tk-hyperlink-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  theme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  emboss?: boolean
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

<style scoped>
.tk-hyperlink-button {
  --tk-hyperlink-button--primary-foreground: #4984b4;
  --tk-hyperlink-button--secondary-foreground: var(--tk-color-foreground);
  --tk-hyperlink-button--success-foreground: #0b6b30;
  --tk-hyperlink-button--warning-foreground: #e09600;
  --tk-hyperlink-button--danger-foreground: #d10014;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  .tk-hyperlink-button-content {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: inherit;
    justify-content: inherit;
    transition: filter 0.2s;
  }

  &:disabled {
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    border: 1px solid #202020;
    background-color: color-mix(in srgb, rgba(255, 255, 255, 0.05), #fff 4%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 3px rgba(255, 255, 255, 0.05);
  }

  &:active:not(:disabled) {
    border: 1px solid #202020;
    background-color: rgba(255, 255, 255, 0.02);
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 3px rgba(255, 255, 255, 0.01);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed currentColor;
    outline-offset: 2px;
  }
}

.tk-hyperlink-button--primary {
  color: var(--tk-hyperlink-button--primary-foreground);

  &.emboss .tk-hyperlink-button-content {
    filter: drop-shadow(-0.02em -0.02em 0 rgba(255, 255, 255, 0.06)) drop-shadow(0.04em 0.04em 0 rgba(0, 0, 0, 0.4));
  }

  &:hover:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.08em 0 rgba(255, 255, 255, 0.04)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.2));
    }
  }

  &:active:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.08em 0 rgba(255, 255, 255, 0.04)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.2));
    }

    color: color-mix(in srgb, var(--tk-hyperlink-button--primary-foreground), black 20%);
  }
}

.tk-hyperlink-button--secondary {
  color: var(--tk-hyperlink-button--secondary-foreground);

  &.emboss .tk-hyperlink-button-content {
    filter: drop-shadow(-0.02em -0.02em 0 rgba(255, 255, 255, 0.08)) drop-shadow(0.04em 0.08em 0 rgba(0, 0, 0, 0.8));
  }

  &:hover:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.08em 0 rgba(255, 255, 255, 0.04)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.6));
    }
  }

  &:active:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.08em 0 rgba(255, 255, 255, 0.04)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.6));
    }

    color: color-mix(in srgb, var(--tk-hyperlink-button--secondary-foreground), black 20%);
  }
}

.tk-hyperlink-button--success {
  color: var(--tk-hyperlink-button--success-foreground);

  &.emboss .tk-hyperlink-button-content {
    filter: drop-shadow(-0.02em 0em 0 rgba(255, 255, 255, 0.08)) drop-shadow(0.04em 0.04em 0 rgba(0, 0, 0, 0.8));
  }

  &:hover:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.04em 0 rgba(255, 255, 255, 0.08)) drop-shadow(0em -0.02em 0 rgba(0, 0, 0, 0.08));
    }
  }

  &:active:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.04em 0 rgba(255, 255, 255, 0.08)) drop-shadow(0em -0.02em 0 rgba(0, 0, 0, 0.08));
    }

    color: color-mix(in srgb, var(--tk-hyperlink-button--success-foreground), black 20%);
  }
}

.tk-hyperlink-button--warning {
  color: var(--tk-hyperlink-button--warning-foreground);

  &.emboss .tk-hyperlink-button-content {
    filter: drop-shadow(-0.02em -0.02em 0 rgba(255, 255, 255, 0.08)) drop-shadow(0.04em 0.08em 0 rgba(0, 0, 0, 0.8));
  }

  &:hover:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.04em 0 rgba(255, 255, 255, 0.2)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.6));
    }
  }

  &:active:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.04em 0.04em 0 rgba(255, 255, 255, 0.2)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.6));
    }

    color: color-mix(in srgb, var(--tk-hyperlink-button--warning-foreground), black 20%);
  }
}

.tk-hyperlink-button--danger {
  color: var(--tk-hyperlink-button--danger-foreground);

  &.emboss .tk-hyperlink-button-content {
    filter: drop-shadow(-0.02em -0.02em 0 rgba(255, 255, 255, 0.08)) drop-shadow(0.04em 0.04em 0 rgba(0, 0, 0, 0.8));
  }

  &:hover:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.02em 0.04em 0 rgba(255, 255, 255, 0.08)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.6));
    }
  }

  &:active:not(:disabled) {
    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(0.02em 0.04em 0 rgba(255, 255, 255, 0.08)) drop-shadow(-0.02em -0.02em 0 rgba(0, 0, 0, 0.6));
    }

    color: color-mix(in srgb, var(--tk-hyperlink-button--danger-foreground), black 20%);
  }
}
</style>
