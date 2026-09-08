import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

export type TextureType = 'paper' | 'rough-paper' | 'canvas' | 'fiber' | 'sand'

export interface TextureOptions {
  /**
   * Texture appearance.
   *
   * Defaults to "paper".
   */
  type?: TextureType

  /**
   * Texture opacity from 0 to 1.
   *
   * Defaults to 0.12.
   */
  opacity?: number

  /**
   * Texture scale from 0.1 to 10.
   *
   * Larger values create larger visible grains.
   *
   * Defaults to 1.
   */
  scale?: number

  /**
   * Texture seed.
   *
   * Pass null to generate a random seed for this composable instance.
   *
   * Defaults to null.
   */
  seed?: number | null

  /**
   * Texture color.
   *
   * Defaults to a neutral gray.
   */
  color?: string
}

export interface TextureStyle {
  backgroundImage: string
  backgroundRepeat: 'repeat'
  backgroundSize: string
}

export interface UseTextureReturn {
  backgroundImage: ComputedRef<string>
  backgroundRepeat: ComputedRef<'repeat'>
  backgroundSize: ComputedRef<string>
  style: ComputedRef<TextureStyle>
}

interface ResolvedTextureOptions {
  type: TextureType
  opacity: number
  scale: number
  seed: number
  color: string
}

interface TextureDefinition {
  baseFrequency: string
  numOctaves: number
  contrast: number
  brightness: number
  blendMode: 'multiply' | 'screen' | 'normal'
}

const DEFAULT_TEXTURE_TYPE: TextureType = 'paper'
const DEFAULT_OPACITY = 0.12
const DEFAULT_SCALE = 1
const DEFAULT_COLOR = '#6f665d'
const DEFAULT_BACKGROUND_SIZE = '240px 240px'

const MIN_OPACITY = 0
const MAX_OPACITY = 1

const MIN_SCALE = 0.1
const MAX_SCALE = 10

const createRandomSeed = (): number => {
  return Math.floor(Math.random() * 100000)
}

const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.min(Math.max(value, minimum), maximum)
}

const normalizeOpacity = (opacity: number): number => {
  if (!Number.isFinite(opacity)) {
    return DEFAULT_OPACITY
  }

  return clamp(opacity, MIN_OPACITY, MAX_OPACITY)
}

const normalizeScale = (scale: number): number => {
  if (!Number.isFinite(scale)) {
    return DEFAULT_SCALE
  }

  return clamp(scale, MIN_SCALE, MAX_SCALE)
}

const normalizeSeed = (seed: number): number => {
  if (!Number.isFinite(seed)) {
    return createRandomSeed()
  }

  return Math.round(seed)
}

const createCssUrl = (svgContent: string): string => {
  const encodedSvg = encodeURIComponent(svgContent.trim().replace(/\s+/g, ' '))
  return `url("data:image/svg+xml,${encodedSvg}")`
}

const getTextureDefinition = (type: TextureType, scale: number): TextureDefinition => {
  switch (type) {
    case 'rough-paper':
      return {
        baseFrequency: `${0.035 / scale}`,
        numOctaves: 4,
        contrast: 1.25,
        brightness: 0.98,
        blendMode: 'multiply'
      }

    case 'canvas':
      return {
        baseFrequency: `${0.045 / scale} ${0.75 / scale}`,
        numOctaves: 3,
        contrast: 1.35,
        brightness: 0.95,
        blendMode: 'multiply'
      }

    case 'fiber':
      return {
        baseFrequency: `${0.025 / scale} ${1.8 / scale}`,
        numOctaves: 3,
        contrast: 1.5,
        brightness: 0.96,
        blendMode: 'multiply'
      }

    case 'sand':
      return {
        baseFrequency: `${0.9 / scale}`,
        numOctaves: 2,
        contrast: 1.4,
        brightness: 0.95,
        blendMode: 'multiply'
      }

    case 'paper':
    default:
      return {
        baseFrequency: `${0.06 / scale}`,
        numOctaves: 3,
        contrast: 1.1,
        brightness: 1,
        blendMode: 'multiply'
      }
  }
}

const createTextureSvg = (options: ResolvedTextureOptions): string => {
  const definition = getTextureDefinition(options.type, options.scale)
  const intercept = definition.brightness - 0.5

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="240"
      height="240"
      viewBox="0 0 240 240"
    >
      <filter id="texture-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="${definition.baseFrequency}"
          numOctaves="${definition.numOctaves}"
          seed="${options.seed}"
          stitchTiles="stitch"
          result="noise"
        />

        <feColorMatrix
          in="noise"
          type="saturate"
          values="0"
          result="grayscale-noise"
        />

        <feComponentTransfer
          in="grayscale-noise"
          result="adjusted-noise"
        >
          <feFuncR
            type="linear"
            slope="${definition.contrast}"
            intercept="${intercept}"
          />
          <feFuncG
            type="linear"
            slope="${definition.contrast}"
            intercept="${intercept}"
          />
          <feFuncB
            type="linear"
            slope="${definition.contrast}"
            intercept="${intercept}"
          />
        </feComponentTransfer>
      </filter>

      <rect
        width="100%"
        height="100%"
        fill="${options.color}"
        opacity="${options.opacity}"
        filter="url(#texture-filter)"
        style="mix-blend-mode: ${definition.blendMode}"
      />
    </svg>
  `
}

export function useTexture(options: MaybeRefOrGetter<TextureOptions> = {}): UseTextureReturn {
  const randomSeed = createRandomSeed()

  const resolvedOptions = computed<ResolvedTextureOptions>(() => {
    const currentOptions = toValue(options)

    const seed = currentOptions.seed === null || currentOptions.seed === undefined ? randomSeed : normalizeSeed(currentOptions.seed)

    return {
      type: currentOptions.type ?? DEFAULT_TEXTURE_TYPE,
      opacity: normalizeOpacity(currentOptions.opacity ?? DEFAULT_OPACITY),
      scale: normalizeScale(currentOptions.scale ?? DEFAULT_SCALE),
      seed: seed,
      color: currentOptions.color ?? DEFAULT_COLOR
    }
  })

  const backgroundImage = computed<string>(() => {
    return createCssUrl(createTextureSvg(resolvedOptions.value))
  })

  const backgroundRepeat = computed<'repeat'>(() => {
    return 'repeat'
  })

  const backgroundSize = computed<string>(() => {
    return DEFAULT_BACKGROUND_SIZE
  })

  const style = computed<TextureStyle>(() => {
    return {
      backgroundImage: backgroundImage.value,
      backgroundRepeat: backgroundRepeat.value,
      backgroundSize: backgroundSize.value
    }
  })

  return {
    backgroundImage: backgroundImage,
    backgroundRepeat: backgroundRepeat,
    backgroundSize: backgroundSize,
    style: style
  }
}
