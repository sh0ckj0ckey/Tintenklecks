<template>
  <div class="tk-checkbox-page">
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
      <TkCheckBox v-model="allChecked" :indeterminate="isIndeterminate" size="large">
        Total ({{ checkedCount }}/{{ totalItems.length }})
      </TkCheckBox>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          padding: 8px;
          border-radius: 8px;
          background-color: var(--tk-color-background-deep);
        "
      >
        <TkCheckBox v-model="isLargeChecked" size="large">Large</TkCheckBox>
        <TkCheckBox v-model="isMediumChecked" size="medium">Medium</TkCheckBox>
        <TkCheckBox v-model="isSmallChecked" size="small">Small</TkCheckBox>
      </div>

      <TkCheckBox v-model="isLargeImgChecked" size="large" orientation="vertical">
        <img src="@renderer/assets/images/avatar.jpg" alt="Avatar" style="width: 128px; border-radius: 4px; object-fit: contain" />
      </TkCheckBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TkCheckBox from '../components/TkCheckBox/TkCheckBox.vue'

const isLargeChecked = ref(false)
const isMediumChecked = ref(false)
const isSmallChecked = ref(false)
const isLargeImgChecked = ref(false)

const totalItems = [isLargeChecked, isMediumChecked, isSmallChecked]

const checkedCount = computed(() => {
  return totalItems.filter((item) => item.value).length
})

const allChecked = computed({
  get() {
    return checkedCount.value === totalItems.length && totalItems.length > 0
  },
  set(value: boolean) {
    totalItems.forEach((item) => (item.value = value))
  }
})

const isIndeterminate = computed(() => {
  return checkedCount.value > 0 && checkedCount.value < totalItems.length
})
</script>

<style scoped>
.tk-checkbox-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
