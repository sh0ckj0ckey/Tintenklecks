<template>
  <div class="tk-hyperlink-buttons-page">
    <div style="display: flex; gap: 8px">
      <TkHyperlinkButton theme="primary" :emboss="true">Primary</TkHyperlinkButton>
      <TkHyperlinkButton theme="secondary" :emboss="true">Secondary</TkHyperlinkButton>
      <TkHyperlinkButton theme="success" :emboss="true">Success</TkHyperlinkButton>
      <TkHyperlinkButton theme="warning" :emboss="true">Warning</TkHyperlinkButton>
      <TkHyperlinkButton theme="danger" :emboss="true">Danger</TkHyperlinkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TkHyperlinkButton from '../components/TkButtons/TkHyperlinkButton.vue'
</script>

<style scoped>
.tk-hyperlink-buttons-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
