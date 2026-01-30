import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export interface TextureOptions {
  /** 不透明度 (0.0 - 1.0)，控制纹理的深浅 */
  opacity?: number

  /** 缩放比例 (0.1 - 10)，控制纹理颗粒的大小 */
  scale?: number

  /** 随机种子，传入不同的数字可以生成不同的纹理分布，传入 null 则随机生成 */
  seed?: number | null
}

const createSvgUrl = (svgContent: string): string => {
  const encoded = encodeURIComponent(svgContent.trim().replace(/\s+/g, ' '))
  return `url("data:image/svg+xml,${encoded}")`
}

/**
 * 纸张纹理生成器
 * @param options 配置项，支持响应式引用
 */
export function useTexture(options: MaybeRefOrGetter<TextureOptions> = {}) {
  // 基础的 SVG 模板生成函数
  const generateSvg = (type: 'noise' | 'canvas' | 'paper', opacity: number, scale: number, seed: number) => {
    // 基础频率，根据 scale 调整
    // scale 越大，baseFrequency 越小，颗粒越大
    const freq = (val: number) => val / scale

    let filterContent = ''

    switch (type) {
      case 'noise':
        // 经典的沙沙噪点
        filterContent = `
          <filter id='noise'>
            <feTurbulence type='fractalNoise' baseFrequency='${freq(0.65)}' numOctaves='3' stitchTiles='stitch' seed='${seed}'/>
          </filter>
          <rect width='100%' height='100%' filter='url(#noise)' opacity='${opacity}'/>
        `
        break

      case 'canvas':
        // 粗糙画布/纤维感 (双层叠加)
        filterContent = `
          <filter id='canvas'>
            <feTurbulence type='fractalNoise' baseFrequency='${freq(0.05)} ${freq(2)}' numOctaves='3' seed='${seed}' result='h'/>
            <feTurbulence type='fractalNoise' baseFrequency='${freq(2)} ${freq(0.05)}' numOctaves='3' seed='${seed + 1}' result='v'/>
            <feComposite operator='arithmetic' in='h' in2='v' k2='0.5' k3='0.5'/>
          </filter>
          <rect width='100%' height='100%' filter='url(#canvas)' opacity='${opacity}'/>
        `
        break

      case 'paper':
        // 柔和的纸张褶皱/水彩纸
        filterContent = `
          <filter id='paper'>
            <feTurbulence type='fractalNoise' baseFrequency='${freq(0.04)}' numOctaves='5' seed='${seed}'/>
            <feDiffuseLighting lighting-color='#ffffff' surfaceScale='2'>
              <feDistantLight azimuth='45' elevation='60'/>
            </feDiffuseLighting>
          </filter>
          <rect width='100%' height='100%' filter='url(#paper)' opacity='${opacity}' style='mix-blend-mode: multiply'/>
        `
        break
    }

    return `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>${filterContent}</svg>`
  }

  // 统一处理参数
  const getParams = () => {
    const opts = toValue(options)
    return {
      opacity: opts.opacity ?? 0.1, // 默认透明度
      scale: opts.scale ?? 1, // 默认缩放 1
      // 如果没有提供 seed，生成一个 0-1000 的随机整数
      seed: opts.seed ?? Math.floor(Math.random() * 1000)
    }
  }

  // 1. 沙沙噪点 (适合通用背景)
  const noiseTexture = computed(() => {
    const { opacity, scale, seed } = getParams()
    return createSvgUrl(generateSvg('noise', opacity, scale, seed))
  })

  // 2. 粗糙画布 (适合卡片、侧边栏)
  const canvasTexture = computed(() => {
    const { opacity, scale, seed } = getParams()
    return createSvgUrl(generateSvg('canvas', opacity, scale, seed))
  })

  // 3. 褶皱纸张 (适合正文区域)
  const paperTexture = computed(() => {
    const { opacity, scale, seed } = getParams()
    return createSvgUrl(generateSvg('paper', opacity, scale, seed))
  })

  return {
    noiseTexture,
    canvasTexture,
    paperTexture
  }
}
