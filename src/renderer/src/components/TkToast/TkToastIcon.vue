<template>
  <div class="icon-wrapper" :style="styleVars">
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon-svg"
    >
      <polyline v-if="type === 'success'" points="20 6 9 17 4 12" />

      <line v-if="type === 'error'" x1="18" y1="6" x2="6" y2="18" />
      <line v-if="type === 'error'" x1="6" y1="6" x2="18" y2="18" />

      <line v-if="type === 'info'" x1="12" y1="17" x2="12" y2="13" />
      <line v-if="type === 'info'" x1="12" y1="8" x2="12" y2="8.01" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  type: 'info' | 'success' | 'error'
}>()

const colorMap = {
  success: { bg: '#E8F5E9', color: '#2E7D32' },
  info: { bg: '#E3F2FD', color: '#1565C0' },
  error: { bg: '#FFEBEE', color: '#C62828' }
}

const styleVars = computed(() => {
  const theme = colorMap[props.type] || colorMap.success
  return {
    '--icon-bg': theme.bg,
    '--icon-color': theme.color
  }
})
</script>

<style scoped>
.icon-wrapper {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--icon-bg);
  color: var(--icon-color);

  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.15),
    inset -2px -2px 4px rgba(255, 255, 255, 0.8);
}

.icon-svg {
  filter: drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.3));
  width: 20px;
  height: 20px;
}
</style>
