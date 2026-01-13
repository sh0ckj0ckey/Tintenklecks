<template>
  <button type="button" class="tk-hyperlink-button" :class="{ emboss: props.emboss }" :disabled="props.disabled" @click="onClick">
    <slot></slot>
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
  border: none;
  border-radius: 4px;
  background-color: transparent;
  font-size: 16px;
  font-weight: normal;
  cursor: pointer;

  &.emboss {
    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    background-color: #88888828;
  }

  &:active:not(:disabled) {
    background-color: #88888820;
    filter: brightness(1);
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}
</style>
