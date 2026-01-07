const Z_INDEX_START = 10000

const activeZIndexes = new Set<number>()

export function nextZIndex(): number {
  let currentMax = Z_INDEX_START

  if (activeZIndexes.size > 0) {
    currentMax = Math.max(...activeZIndexes)
  }

  const nextZ = activeZIndexes.size > 0 ? currentMax + 1 : currentMax
  activeZIndexes.add(nextZ)

  return nextZ
}

export function releaseZIndex(z: number): void {
  activeZIndexes.delete(z)
}
