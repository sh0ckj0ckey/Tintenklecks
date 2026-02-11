<template>
  <div class="tk-marquee-page">
    <TkMarquee class="tk-marquee-page-marquee horizontal" direction="left">
      <div class="tk-marquee-page-marquee-content horizontal">
        <TkButton theme="primary" :deboss="true">Primary</TkButton>
        <TkButton theme="secondary" :deboss="true">Secondary</TkButton>
        <TkButton theme="success" :deboss="true">Success</TkButton>
        <TkButton theme="warning" :deboss="true">Warning</TkButton>
        <TkButton theme="danger" :deboss="true">Danger</TkButton>
      </div>
    </TkMarquee>

    <TkMarquee class="tk-marquee-page-marquee vertical" direction="up" :pause-on-hover="true">
      <div class="tk-marquee-page-marquee-content vertical">
        <TkButton theme="primary" :deboss="true">Primary</TkButton>
        <TkButton theme="secondary" :deboss="true">Secondary</TkButton>
        <TkButton theme="success" :deboss="true">Success</TkButton>
        <TkButton theme="warning" :deboss="true">Warning</TkButton>
        <TkButton theme="danger" :deboss="true">Danger</TkButton>
      </div>
    </TkMarquee>
  </div>
</template>

<script setup lang="ts">
import TkButton from '../components/TkButtons/TkButton.vue'
import TkMarquee from '../components/TkMarquee/TkMarquee.vue'
</script>

<style scoped>
.tk-marquee-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;

  .tk-marquee-page-marquee {
    background-color: var(--tk-color-background-deep);
    border-radius: 8px;

    &.horizontal {
      width: 80%;
      height: auto;
      padding: 12px 0;
    }

    &.vertical {
      width: auto;
      height: 80%;
      padding: 0 12px;
    }

    .tk-marquee-page-marquee-content {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      padding: 4px;

      &.horizontal {
        flex-direction: row;
      }

      &.vertical {
        flex-direction: column;
      }
    }
  }
}
</style>
