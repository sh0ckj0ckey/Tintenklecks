<template>
  <div role="separator" :aria-orientation="orientation" class="tk-separator" :class="[`tk-separator--${orientation}`]"></div>
</template>

<script lang="ts" setup>
defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()
</script>

<style scoped>
.tk-separator {
  flex: none;
  border: 0;
  margin: 0;
  padding: 0;
}

.tk-separator--horizontal {
  display: block;
  height: 2px;

  background-image:
    linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5) 50%, transparent),
    linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15) 50%, transparent);
  background-position: top, bottom;
  background-size: 100% 1px;
  background-repeat: no-repeat;
}

.tk-separator--vertical {
  display: inline-block;
  width: 2px;
  align-self: stretch;

  background-image:
    linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5) 50%, transparent),
    linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.15) 50%, transparent);
  background-position: left, right;
  background-size: 1px 100%;
  background-repeat: no-repeat;
}
</style>
