import type { Vec3 } from './cat-projection.ts'

/**
 * What defines a cat: a seed, a short trait list, and a jitter table.
 * Jitter is generated once so the drawing stays still while the head turns.
 */

export type HeadShape = 'round' | 'long' | 'chubby' | 'narrow'
export type EarStyle = 'tall' | 'small' | 'wide-set' | 'asymmetric'
export type EyeStyle = 'round' | 'almond' | 'sleepy' | 'wide'
export type Marking =
  | 'none'
  | 'forehead-stripe'
  | 'one-eye-patch'
  | 'nose-patch'
  | 'tabby'
  | 'tuxedo'
export type FurDetail = 'smooth' | 'tufts' | 'fluffy'
export type MouthStyle = 'w' | 'flat' | 'tiny'

export type CatTraits = {
  head: HeadShape
  ears: EarStyle
  eyes: EyeStyle
  /** 0.82–1.22 typical. Multiplies eye x. */
  eyeSpacing: number
  noseSize: number
  muzzleWidth: number
  cheekWidth: number
  marking: Marking
  fur: FurDetail
  mouth: MouthStyle
  /** Which eye the one-eye patch sits on. */
  patchSide: 'left' | 'right'
}

export type CatAnchors = {
  leftEar: Vec3
  rightEar: Vec3
  leftEarTip: Vec3
  rightEarTip: Vec3
  leftEye: Vec3
  rightEye: Vec3
  leftPupil: Vec3
  rightPupil: Vec3
  nose: Vec3
  muzzle: Vec3
  mouth: Vec3
  leftWhisker: Vec3
  rightWhisker: Vec3
  forehead: Vec3
  chin: Vec3
}

export type Cat = {
  seed: number
  traits: CatTraits
  /** Stable −1..1 values, indexed by feature. Never regenerated on render. */
  jitter: number[]
  ink: string
  head: { rx: number; ry: number }
  ear: { leftH: number; rightH: number; width: number }
  anchors: CatAnchors
}

const HEADS: HeadShape[] = ['round', 'long', 'chubby', 'narrow']
const EARS: EarStyle[] = ['tall', 'small', 'wide-set', 'asymmetric']
const EYES: EyeStyle[] = ['round', 'almond', 'sleepy', 'wide']
const MARKINGS: Marking[] = [
  'none',
  'forehead-stripe',
  'one-eye-patch',
  'nose-patch',
  'tabby',
  'tuxedo',
]
const FURS: FurDetail[] = ['smooth', 'tufts', 'fluffy']
const MOUTHS: MouthStyle[] = ['w', 'flat', 'tiny']
const INKS = ['#1a1714', '#231c16', '#2a1f18']

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]
}

function between(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min)
}

function headSize(shape: HeadShape, cheekWidth: number) {
  const base =
    shape === 'round'
      ? { rx: 0.9, ry: 0.86 }
      : shape === 'long'
        ? { rx: 0.78, ry: 1.04 }
        : shape === 'chubby'
          ? { rx: 1.08, ry: 0.8 }
          : { rx: 0.7, ry: 0.96 }
  return {
    rx: base.rx * (0.92 + cheekWidth * 0.08),
    ry: base.ry,
  }
}

function earSize(style: EarStyle, rng: () => number) {
  if (style === 'tall') return { leftH: 0.54, rightH: 0.51, width: 0.23, x: 0.36 }
  if (style === 'small') return { leftH: 0.3, rightH: 0.31, width: 0.2, x: 0.34 }
  if (style === 'wide-set') return { leftH: 0.44, rightH: 0.42, width: 0.25, x: 0.5 }
  return {
    leftH: 0.5,
    rightH: 0.36,
    width: 0.22,
    x: 0.38 + (rng() - 0.5) * 0.04,
  }
}

export function generateCat(
  seed = Math.floor(Math.random() * 0x7fffffff),
  overrides: Partial<CatTraits> = {},
): Cat {
  const rng = mulberry32(seed)
  const traits: CatTraits = {
    head: pick(rng, HEADS),
    ears: pick(rng, EARS),
    eyes: pick(rng, EYES),
    eyeSpacing: between(rng, 0.82, 1.2),
    noseSize: between(rng, 0.78, 1.28),
    muzzleWidth: between(rng, 0.82, 1.24),
    cheekWidth: between(rng, 0.78, 1.28),
    marking: pick(rng, MARKINGS),
    fur: pick(rng, FURS),
    mouth: pick(rng, MOUTHS),
    patchSide: rng() < 0.5 ? 'left' : 'right',
    ...overrides,
  }

  const jitter = Array.from({ length: 32 }, () => rng() * 2 - 1)
  const head = headSize(traits.head, traits.cheekWidth)
  const ear = earSize(traits.ears, rng)
  const eyeX = 0.27 * traits.eyeSpacing
  const eyeY = traits.eyes === 'wide' ? -0.05 : -0.08
  const eyeZ = 0.56
  const pupilIn = 0.035
  const muzzleY = 0.2 + jitter[4] * 0.02
  const earY = -0.48 - (traits.head === 'long' ? 0.06 : 0)

  const anchors: CatAnchors = {
    leftEar: { x: -ear.x, y: earY, z: 0.02 },
    rightEar: { x: ear.x, y: earY, z: 0.02 },
    leftEarTip: {
      x: -ear.x + jitter[5] * 0.04,
      y: earY - ear.leftH,
      z: 0.06,
    },
    rightEarTip: {
      x: ear.x + jitter[6] * 0.04,
      y: earY - ear.rightH,
      z: 0.06,
    },
    leftEye: { x: -eyeX, y: eyeY + jitter[7] * 0.015, z: eyeZ },
    rightEye: { x: eyeX, y: eyeY + jitter[8] * 0.015, z: eyeZ },
    leftPupil: {
      x: -eyeX + pupilIn,
      y: eyeY + 0.02,
      z: eyeZ + 0.08,
    },
    rightPupil: {
      x: eyeX - pupilIn,
      y: eyeY + 0.02,
      z: eyeZ + 0.08,
    },
    nose: {
      x: jitter[9] * 0.03,
      y: 0.14 + jitter[10] * 0.02,
      z: 0.74,
    },
    muzzle: { x: 0, y: muzzleY, z: 0.66 },
    mouth: { x: jitter[11] * 0.02, y: muzzleY + 0.1, z: 0.7 },
    leftWhisker: { x: -0.16 * traits.muzzleWidth, y: muzzleY + 0.02, z: 0.68 },
    rightWhisker: { x: 0.16 * traits.muzzleWidth, y: muzzleY + 0.02, z: 0.68 },
    forehead: { x: 0, y: -0.32, z: 0.52 },
    chin: { x: 0, y: 0.62, z: 0.38 },
  }

  return {
    seed,
    traits,
    jitter,
    ink: pick(rng, INKS),
    head,
    ear: { leftH: ear.leftH, rightH: ear.rightH, width: ear.width },
    anchors,
  }
}

/** A grid that cycles the main traits so the range is visible. */
export function generateGallery(count: number): Cat[] {
  return Array.from({ length: count }, (_, i) =>
    generateCat(20260 + i * 7919, {
      head: HEADS[(i + 1) % HEADS.length],
      ears: EARS[(i + 3) % EARS.length],
      eyes: EYES[(i + 2) % EYES.length],
      marking: MARKINGS[(i + 4) % MARKINGS.length],
      fur: FURS[(i + 1) % FURS.length],
    }),
  )
}
