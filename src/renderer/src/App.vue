<template>
  <div class="tk-playground">
    <TkButton theme="primary" :deboss="true">Primary</TkButton>
    <TkButton theme="secondary" :deboss="true">Secondary</TkButton>
    <TkButton theme="success" :deboss="true">Success</TkButton>
    <TkButton theme="danger" :deboss="true">Danger</TkButton>
    <TkButton theme="warning" :deboss="true">Warning</TkButton>
    <TkHyperlinkButton :border-radius="4" :emboss="true">
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
    font-size: 20px;
    font-weight: bold;
    color: #005391;
    margin: 8px 16px;
  }
}
</style>
