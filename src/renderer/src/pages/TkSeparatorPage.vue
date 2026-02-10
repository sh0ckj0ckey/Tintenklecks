<template>
  <div class="tk-separator-page">
    <div class="tk-separator-page-demo-section horizontal">
      <TkButton theme="primary" :deboss="true">Primary</TkButton>
      <TkButton theme="secondary" :deboss="true">Secondary</TkButton>
      <TkSeparator orientation="vertical" />
      <TkButton theme="success" :deboss="true">Success</TkButton>
      <TkButton theme="warning" :deboss="true">Warning</TkButton>
      <TkButton theme="danger" :deboss="true">Danger</TkButton>
    </div>
    <div class="tk-separator-page-demo-section vertical">
      <TkButton theme="primary" :deboss="true">Primary</TkButton>
      <TkButton theme="secondary" :deboss="true">Secondary</TkButton>
      <TkSeparator orientation="horizontal" />
      <TkButton theme="success" :deboss="true">Success</TkButton>
      <TkButton theme="warning" :deboss="true">Warning</TkButton>
      <TkButton theme="danger" :deboss="true">Danger</TkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TkButton from '../components/TkButtons/TkButton.vue'
import TkSeparator from '../components/TkSeparator/TkSeparator.vue'
</script>

<style scoped>
.tk-separator-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;

  .tk-separator-page-demo-section {
    display: flex;
    gap: 8px;
    border-radius: 8px;
    padding: 16px;
    background-color: var(--tk-color-background-deep);

    &.horizontal {
      flex-direction: row;
    }

    &.vertical {
      flex-direction: column;
    }
  }
}
</style>
