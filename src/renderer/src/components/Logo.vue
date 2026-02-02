<template>
  <div class="logo-card-stack">
    <div class="logo-card back">
      <div class="logo-card-pattern"></div>
    </div>
    <div class="logo-card front">
      <img class="logo-card-blot" src="../assets/images/tintenklecks_blot.svg" />
    </div>
  </div>
</template>

<style scoped>
.logo-card-stack {
  position: relative;
  width: 252px;
  height: 352px;
  perspective: 512px;

  &:hover {
    .logo-card {
      &.front {
        transform: rotate(0.01deg);
        transition: transform 0.75s cubic-bezier(0.32, 280, 0.4, 1);
      }

      &.back {
        opacity: 0;
        transform: rotate(0) translateX(0) translateY(0);
        transition:
          opacity 0.75s cubic-bezier(0.77, -0.35, 0.25, 1),
          transform 0.75s cubic-bezier(0.77, -0.35, 0.25, 1);
      }
    }
  }

  .logo-card {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 16px;
    background: #fdfbf7;
    border-radius: 24px;
    box-sizing: border-box;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 1px 3px rgba(0, 0, 0, 0.05);
    -electron-corner-smoothing: 100%;

    &.front {
      z-index: 2;
      transform-origin: bottom center;
      transform: rotate(0) translateX(0) translateY(0);
      transition: transform 0.75s cubic-bezier(0.32, -280, 0.4, 1);
    }

    &.back {
      z-index: 1;
      opacity: 1;
      transform-origin: bottom center;
      transform: rotate(-9deg) translateX(-36px) translateY(12px);
      transition:
        opacity 0.75s cubic-bezier(0.34, 1.56, 0.64, 1),
        transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .logo-card-pattern {
      width: 100%;
      height: 100%;
      background-image: url('../assets/images/tintenklecks_pattern.png');
      background-repeat: repeat;
      background-size: 40px auto;
      border-radius: 12px;
      opacity: 0.85;
      -electron-corner-smoothing: 100%;
    }

    .logo-card-blot {
      width: 100%;
      height: 100%;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
  }
}
</style>
