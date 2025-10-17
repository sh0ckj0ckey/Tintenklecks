<template>
  <div class="tk-playground">
    <TkButton theme="primary">Primary</TkButton>
    <TkButton theme="secondary">Secondary</TkButton>
    <TkButton theme="success">Success</TkButton>
    <TkButton theme="danger">Danger</TkButton>
    <TkButton theme="warning">Warning</TkButton>
    <TkHyperlinkButton :border-radius="4">
      <span class="tk-hyperlink-button-content">Click me</span>
    </TkHyperlinkButton>
  </div>
</template>

<script setup lang="ts">
import TkButton from './components/TkButton.vue'
import TkHyperlinkButton from './components/TkHyperlinkButton.vue'
</script>

<style scoped>
.tk-playground {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .tk-hyperlink-button-content {
    font-size: 16px;
    color: #99ebff;
    margin: 8px 16px;
  }
}
</style>
