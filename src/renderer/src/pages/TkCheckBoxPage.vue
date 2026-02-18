<template>
  <div class="tk-checkbox-page">
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
      <TkCheckBox v-model="isLargeChecked" size="large">Large</TkCheckBox>
      <TkCheckBox v-model="isNormalChecked" size="medium">Medium</TkCheckBox>
      <TkCheckBox v-model="isSmallChecked" size="small">Small</TkCheckBox>
      <TkCheckBox v-model="isLargeImgChecked" size="medium" orientation="vertical">
        <img src="@renderer/assets/images/avatar.jpg" alt="Avatar" style="width: 128px; border-radius: 4px; object-fit: contain" />
      </TkCheckBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TkCheckBox from '../components/TkCheckBox/TkCheckBox.vue'

const isLargeChecked = ref(false)
const isNormalChecked = ref(false)
const isSmallChecked = ref(false)
const isLargeImgChecked = ref(false)
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
