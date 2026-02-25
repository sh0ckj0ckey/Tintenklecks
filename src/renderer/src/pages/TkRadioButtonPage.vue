<template>
  <div class="tk-radio-button-page">
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
      <TkRadioButton v-model="selectedIndex" :value="0" name="demo" size="large">Large</TkRadioButton>
      <TkRadioButton v-model="selectedIndex" :value="1" name="demo" size="medium">Medium</TkRadioButton>
      <TkRadioButton v-model="selectedIndex" :value="2" name="demo" size="small">Small</TkRadioButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TkRadioButton from '../components/TkRadio/TkRadioButton.vue'

const selectedIndex = ref(0)
</script>

<style scoped>
.tk-radio-button-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
