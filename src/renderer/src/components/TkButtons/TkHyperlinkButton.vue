<template>
  <button type="button" class="tk-hyperlink-button" :class="{ emboss: props.emboss }" :disabled="props.disabled" @click="onClick">
    <span class="tk-hyperlink-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  color: #0078d4;
  cursor: pointer;
  transition:
    transform 0.1s,
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

  &.emboss .tk-hyperlink-button-content {
    filter: drop-shadow(-0.04em -0.06em 0px rgba(255, 255, 255, 0.08)) drop-shadow(0.04em 0.06em 0px rgba(0, 0, 0, 0.6));
  }

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffffe6;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -1px 0 rgba(255, 255, 255, 0.03);

    &.emboss .tk-hyperlink-button-content {
      filter: drop-shadow(1px 1px 0px rgba(255, 255, 255, 0.15)) drop-shadow(-1px -1px 0px rgba(0, 0, 0, 0.6));
    }
  }

  &:active:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffffb3;
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -1px 0 rgba(255, 255, 255, 0.03);
  }

  &:focus-visible {
    outline: 2px dashed currentColor;
    outline-offset: 2px;
  }
}
</style>
