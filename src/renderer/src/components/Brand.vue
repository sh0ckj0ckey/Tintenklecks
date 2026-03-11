<template>
  <div class="brand">
    <div class="brand-pattern">
      <img class="brand-logo-blot" src="../assets/images/tintenklecks_blot.svg" />
      <span class="brand-logo-title">Tintenklecks</span>
    </div>
  </div>
</template>

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
.brand {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 560px;
  height: 192px;
  padding: 12px;
  margin: 12px;
  background: #fdfbf7;
  border-radius: 24px;
  overflow: hidden;
  backface-visibility: hidden;
  -electron-corner-smoothing: 100%;

  .brand-pattern {
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

    .brand-logo-blot {
      position: absolute;
      height: 1140px;
      left: 86px;
    }

    .brand-logo-title {
      position: absolute;
      top: 12px;
      right: 36px;
      font-family: 'Allura', cursive;
      font-size: 96px;
      text-shadow: 2px 4px #000;
    }
  }
}
</style>
