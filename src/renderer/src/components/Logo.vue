<template>
  <div class="logo-card-stack" :class="animationState" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="logo-card back">
      <div class="logo-card-pattern"></div>
    </div>
    <div class="logo-card front">
      <img class="logo-card-blot" src="../assets/images/tintenklecks_blot.svg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type AnimationState = 'fanned' | 'charging' | 'stacked' | 'release'

const animationState = ref<AnimationState>('fanned')

const DURATION_CHARGING = 300
const DURATION_RELEASE = 200

let timer: number | null = null

const onMouseEnter = (): void => {
  if (timer) {
    clearTimeout(timer)
  }

  if (animationState.value === 'release') {
    animationState.value = 'stacked'
    return
  }

  animationState.value = 'charging'

  timer = window.setTimeout(() => {
    animationState.value = 'stacked'
  }, DURATION_CHARGING)
}

const onMouseLeave = (): void => {
  if (timer) {
    clearTimeout(timer)
  }

  if (animationState.value === 'charging') {
    animationState.value = 'fanned'
    return
  }

  animationState.value = 'release'

  timer = window.setTimeout(() => {
    animationState.value = 'fanned'
  }, DURATION_RELEASE)
}
</script>

<style scoped>
.logo-card-stack {
  position: relative;
  width: 252px;
  height: 352px;
  perspective: 512px;

  .logo-card {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
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

    &.back {
      z-index: 1;
    }

    &.front {
      z-index: 2;
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

  &.fanned {
    .logo-card {
      &.back {
        transform: rotate(-9deg) translateX(-36px) translateY(12px);
        opacity: 1;
        transition:
          transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0s,
          opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0s;
      }

      &.front {
        transform: rotate(0) translateX(0) translateY(0);
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    }
  }

  &.charging {
    .logo-card {
      &.back {
        transform: rotate(-12deg) translateX(-42px) translateY(14px);
        opacity: 1;
        transition:
          transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s,
          opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
      }

      &.front {
        transform: rotate(4deg) translateX(4px) translateY(0);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    }
  }

  &.stacked {
    .logo-card {
      &.back {
        transform: rotate(0) translateX(0) translateY(0);
        opacity: 0;
        transition:
          transform 0.5s cubic-bezier(0.32, 1, 0.36, 1) 0s,
          opacity 0.2s linear 0.4s;
      }

      &.front {
        transform: rotate(0) translateX(0) translateY(0);
        transition: transform 0.6s cubic-bezier(0.4, 2.4, 0.4, 1);
      }
    }
  }

  &.release {
    .logo-card {
      &.back {
        transform: rotate(-9deg) translateX(-36px) translateY(12px);
        opacity: 1;
        transition:
          transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0s,
          opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0s;
      }

      &.front {
        transform: rotate(4deg) translateX(2px) translateY(0);
        transition: transform 0.2s cubic-bezier(0, 0, 0.58, 1);
      }
    }
  }
}
</style>
