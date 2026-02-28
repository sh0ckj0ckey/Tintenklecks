<template>
  <div class="icons">
    <div class="icons-pattern">
      <img class="icons-logo-blot" src="../assets/images/tintenklecks_blot.svg" />
      <span class="icons-logo-title">Tintenklecks</span>
      <div class="icons-list">
        <IconNavigationButton class="icon" />
        <IconNavigationHyperlinkButton class="icon" />
        <IconNavigationToggleButton class="icon" />
        <IconNavigationCheckBox class="icon" />
        <IconNavigationRadioButton class="icon" />
        <IconNavigationSlider class="icon" />
        <IconNavigationToggleSwitch class="icon" />
        <IconNavigationPopup class="icon" />
        <IconNavigationSeparator class="icon" />
        <IconNavigationToast class="icon" />
        <IconNavigationMarquee class="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconNavigationButton from '@renderer/components/TkIcons/navigation/IconNavigationButton.vue'
import IconNavigationHyperlinkButton from '@renderer/components/TkIcons/navigation/IconNavigationHyperlinkButton.vue'
import IconNavigationToggleButton from '@renderer/components/TkIcons/navigation/IconNavigationToggleButton.vue'
import IconNavigationCheckBox from '@renderer/components/TkIcons/navigation/IconNavigationCheckBox.vue'
import IconNavigationRadioButton from '@renderer/components/TkIcons/navigation/IconNavigationRadioButton.vue'
import IconNavigationSlider from '@renderer/components/TkIcons/navigation/IconNavigationSlider.vue'
import IconNavigationToggleSwitch from '@renderer/components/TkIcons/navigation/IconNavigationToggleSwitch.vue'
import IconNavigationPopup from '@renderer/components/TkIcons/navigation/IconNavigationPopup.vue'
import IconNavigationSeparator from '@renderer/components/TkIcons/navigation/IconNavigationSeparator.vue'
import IconNavigationToast from '@renderer/components/TkIcons/navigation/IconNavigationToast.vue'
import IconNavigationMarquee from '@renderer/components/TkIcons/navigation/IconNavigationMarquee.vue'
</script>

<style>
@font-face {
  font-family: 'Allura';
  src: url('../assets/fonts/Allura-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
</style>

<style scoped>
.icons {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 560px;
  height: 240px;
  padding: 12px;
  margin: 12px;
  background: #fdfbf7;
  border-radius: 24px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  transform-origin: bottom center;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
  -electron-corner-smoothing: 100%;

  .icons-pattern {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: #fdfbf7;
    overflow: hidden;
    -electron-corner-smoothing: 100%;
    width: 100%;
    height: 100%;
    background-image: url('../assets/images/tintenklecks_pattern.png');
    background-repeat: repeat;
    background-size: 40px auto;
    border-radius: 12px;
    position: relative;

    .icons-logo-blot {
      position: absolute;
      height: 1280px;
      left: 0px;
    }

    .icons-logo-title {
      position: absolute;
      right: 12px;
      font-family: 'Allura', cursive;
      font-size: 96px;
      text-shadow: 0px 2px #000;
    }

    .icons-list {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 172px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 2px;
      opacity: 0.7;

      .icon {
        width: 26px;
        height: 26px;
        color: #fdfbf7;
      }
    }
  }
}
</style>
