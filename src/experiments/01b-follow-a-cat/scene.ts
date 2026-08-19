export type CatPlace = 'home' | 'trap' | 'pound'
export type FieldMode = 'off' | 'many' | 'trap' | 'sterilise'
export type StatsMode = 'off' | 'baseline' | 'trap' | 'both'

export type SceneState = {
  catPlace: CatPlace
  catSterilised: boolean
  trapVisible: boolean
  trapClosed: boolean
  replacement: boolean
  emptyTerritory: boolean
  noKittens: boolean
  field: FieldMode
  stats: StatsMode
  highlightPound: boolean
}

export function sceneFromBeat(id: string): SceneState {
  switch (id) {
    case 'meet':
      return base()
    case 'territory':
      return base()
    case 'ch1':
      return base()
    case 'trap-set':
      return { ...base(), trapVisible: true }
    case 'caught':
      return {
        ...base(),
        catPlace: 'trap',
        trapVisible: true,
        trapClosed: true,
      }
    case 'to-pound':
      return {
        ...base(),
        catPlace: 'pound',
        highlightPound: true,
        emptyTerritory: true,
      }
    case 'empty':
      return {
        ...base(),
        catPlace: 'pound',
        highlightPound: true,
        emptyTerritory: true,
      }
    case 'replacement':
      return {
        ...base(),
        catPlace: 'pound',
        highlightPound: true,
        emptyTerritory: false,
        replacement: true,
      }
    case 'reset':
    case 'ch2':
      return base()
    case 'caught-again':
      return {
        ...base(),
        catPlace: 'trap',
        trapVisible: true,
        trapClosed: true,
      }
    case 'desexed':
      return {
        ...base(),
        catPlace: 'trap',
        trapVisible: true,
        trapClosed: true,
        catSterilised: true,
      }
    case 'returned':
      return {
        ...base(),
        catPlace: 'home',
        catSterilised: true,
      }
    case 'no-kittens':
      return {
        ...base(),
        catPlace: 'home',
        catSterilised: true,
        noKittens: true,
      }
    case 'ch3':
      return {
        ...base(),
        catPlace: 'home',
        catSterilised: true,
        noKittens: true,
      }
    case 'field':
      return {
        ...base(),
        catPlace: 'home',
        catSterilised: true,
        field: 'many',
        stats: 'baseline',
      }
    case 'trap-stats':
      return {
        ...base(),
        catPlace: 'home',
        catSterilised: true,
        field: 'trap',
        stats: 'trap',
      }
    case 'sterilise-stats':
    case 'question':
      return {
        ...base(),
        catPlace: 'home',
        catSterilised: true,
        field: 'sterilise',
        stats: 'both',
      }
    default:
      return base()
  }
}

function base(): SceneState {
  return {
    catPlace: 'home',
    catSterilised: false,
    trapVisible: false,
    trapClosed: false,
    replacement: false,
    emptyTerritory: false,
    noKittens: false,
    field: 'off',
    stats: 'off',
    highlightPound: false,
  }
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(18)

export const CAT_HOME = { x: 248, y: 418 }
export const CAT_POUND = { x: 792, y: 248 }

export type CatMark = {
  i: number
  x: number
  y: number
  rot: number
  delay: number
}

export const MARKS: CatMark[] = Array.from({ length: 100 }, (_, i) => ({
  i,
  x: 48 + rng() * 904,
  y: 56 + rng() * 468,
  rot: (rng() - 0.5) * 36,
  delay: rng() * 0.55,
}))
