export type Pt = { x: number; y: number }

export const HOME: Pt = { x: 248, y: 430 }
export const POUND_HERO: Pt = { x: 798, y: 210 }
export const CLINIC: Pt = { x: 790, y: 498 }
export const GATE: Pt = { x: 560, y: 360 }
export const INCOMING_START: Pt = { x: 40, y: 448 }

export const YEAR10 = {
  trap: { population: 39, enteringCare: 99 },
  sterilise: { population: 65, enteringCare: 25 },
} as const

export const STEPS = [
  {
    id: 'live',
    chapter: 'One cat',
    caption: 'This cat lives here, but isn’t someone’s pet.',
  },
  {
    id: 'two-ways',
    chapter: 'One cat',
    caption: 'There are two ways we could intervene.',
  },
  {
    id: 'trap',
    chapter: 'Trap + remove',
    caption: 'Trap + remove.',
  },
  {
    id: 'admission',
    chapter: 'Trap + remove',
    caption:
      'The cat has left the neighbourhood. It is now one more cat in a pound, shelter or rescue — that is what “entering care” means.',
  },
  {
    id: 'vacancy',
    chapter: 'Trap + remove',
    caption: 'Removing a cat can leave space for another cat to move in.',
  },
  {
    id: 'reset',
    chapter: 'Sterilise + return',
    caption: 'Same street. Same cat. Start again.',
  },
  {
    id: 'sterilise',
    chapter: 'Sterilise + return',
    caption: 'Sterilise + return.',
  },
  {
    id: 'stays',
    chapter: 'Sterilise + return',
    caption: 'The cat still lives here, but can no longer reproduce.',
  },
  {
    id: 'zoom',
    chapter: 'A population',
    caption:
      'Now imagine these approaches playing out across a whole population.',
  },
  {
    id: 'marks',
    chapter: 'A population',
    caption:
      'These marks stand in for population change. They are not one-for-one cats.',
  },
  {
    id: 'split',
    chapter: 'Two futures',
    caption: 'Trap + remove versus sterilise + return.',
  },
  {
    id: 'y0',
    chapter: 'Two futures',
    caption: 'Year 0. Same neighbourhood, two different next ten years.',
  },
  {
    id: 'y1',
    chapter: 'Two futures',
    caption: 'Year 1. Watch the cats, not the numbers.',
  },
  {
    id: 'y5',
    chapter: 'Two futures',
    caption: 'Year 5.',
  },
  {
    id: 'y10',
    chapter: 'Two futures',
    caption: 'Year 10.',
  },
  {
    id: 'data',
    chapter: 'The model',
    caption:
      'After 10 years, compared with continuing current practice (indexed to 100).',
  },
  {
    id: 'insight',
    chapter: 'The point',
    caption:
      'Fewer free-living cats doesn’t necessarily mean fewer cats entering pounds, shelters and rescues.',
  },
] as const

export type StepId = (typeof STEPS)[number]['id']

export const STREET_HOMES: Pt[] = [
  { x: 92, y: 348 },
  { x: 148, y: 392 },
  { x: 198, y: 336 },
  { x: 248, y: 430 },
  { x: 304, y: 372 },
  { x: 352, y: 428 },
  { x: 408, y: 348 },
  { x: 456, y: 404 },
  { x: 118, y: 468 },
  { x: 178, y: 508 },
  { x: 238, y: 498 },
  { x: 312, y: 512 },
  { x: 372, y: 476 },
  { x: 428, y: 524 },
  { x: 486, y: 468 },
  { x: 70, y: 408 },
  { x: 520, y: 392 },
  { x: 268, y: 300 },
  { x: 394, y: 300 },
  { x: 164, y: 300 },
]

export const SPLIT_HOMES: Pt[] = [
  { x: 56, y: 158 },
  { x: 86, y: 148 },
  { x: 118, y: 164 },
  { x: 158, y: 136 },
  { x: 188, y: 126 },
  { x: 218, y: 140 },
  { x: 258, y: 158 },
  { x: 292, y: 146 },
  { x: 326, y: 164 },
  { x: 352, y: 138 },
  { x: 72, y: 192 },
  { x: 108, y: 204 },
  { x: 142, y: 182 },
  { x: 178, y: 198 },
  { x: 214, y: 212 },
  { x: 252, y: 196 },
  { x: 288, y: 208 },
  { x: 322, y: 188 },
  { x: 48, y: 178 },
  { x: 362, y: 182 },
]

export const POUND_SLOTS: Pt[] = [
  { x: 78, y: 298 },
  { x: 108, y: 314 },
  { x: 138, y: 296 },
  { x: 168, y: 312 },
  { x: 198, y: 298 },
  { x: 228, y: 314 },
  { x: 258, y: 298 },
  { x: 288, y: 312 },
  { x: 94, y: 320 },
  { x: 148, y: 322 },
  { x: 202, y: 320 },
  { x: 256, y: 322 },
  { x: 118, y: 304 },
  { x: 178, y: 304 },
  { x: 238, y: 304 },
  { x: 310, y: 310 },
]

const SPLIT_VET: Pt = { x: 340, y: 282 }
const SPLIT_GATE_Y = 228

const TRAP_LEAVE = [
  { i: 0, a: 0.08, b: 0.22 },
  { i: 2, a: 0.12, b: 0.28 },
  { i: 5, a: 0.16, b: 0.32 },
  { i: 7, a: 0.22, b: 0.38 },
  { i: 8, a: 0.28, b: 0.44 },
  { i: 11, a: 0.36, b: 0.52 },
  { i: 13, a: 0.46, b: 0.62 },
  { i: 15, a: 0.54, b: 0.7 },
  { i: 16, a: 0.62, b: 0.78 },
  { i: 18, a: 0.7, b: 0.86 },
  { i: 1, a: 0.78, b: 0.92 },
  { i: 9, a: 0.84, b: 0.96 },
]

const TRAP_NEW = [
  { home: 0, appear: 0.26, leaveA: 0.58, leaveB: 0.74, pound: 0 },
  { home: 2, appear: 0.34, leaveA: 0.66, leaveB: 0.82, pound: 1 },
  { home: 5, appear: 0.48, leaveA: 0.78, leaveB: 0.92, pound: 2 },
  { home: 8, appear: 0.6, leaveA: 0.86, leaveB: 0.98, pound: 3 },
]

const STER_WAVES = [
  { i: 3, go: 0.04, back: 0.18 },
  { i: 0, go: 0.06, back: 0.2 },
  { i: 6, go: 0.08, back: 0.22 },
  { i: 10, go: 0.1, back: 0.24 },
  { i: 14, go: 0.12, back: 0.26 },
  { i: 1, go: 0.22, back: 0.38 },
  { i: 4, go: 0.24, back: 0.4 },
  { i: 7, go: 0.26, back: 0.42 },
  { i: 12, go: 0.28, back: 0.44 },
  { i: 17, go: 0.3, back: 0.46 },
  { i: 2, go: 0.4, back: 0.56 },
  { i: 5, go: 0.42, back: 0.58 },
  { i: 9, go: 0.44, back: 0.6 },
  { i: 11, go: 0.46, back: 0.62 },
  { i: 16, go: 0.48, back: 0.64 },
  { i: 8, go: 0.58, back: 0.74 },
  { i: 13, go: 0.6, back: 0.76 },
  { i: 15, go: 0.62, back: 0.78 },
  { i: 18, go: 0.64, back: 0.8 },
  { i: 19, go: 0.66, back: 0.82 },
]

const STER_FADE = [
  { i: 1, a: 0.5, b: 0.72 },
  { i: 5, a: 0.58, b: 0.78 },
  { i: 8, a: 0.66, b: 0.86 },
  { i: 15, a: 0.74, b: 0.92 },
  { i: 18, a: 0.8, b: 0.96 },
]

const STER_POUND = [
  { i: 1, a: 0.48, b: 0.64 },
  { i: 15, a: 0.7, b: 0.86 },
]

export function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n))
}

export function smooth(t: number) {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

export function remap(t: number, a: number, b: number) {
  if (b === a) return t >= b ? 1 : 0
  return smooth((t - a) / (b - a))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}

export function travel(t: number, from: Pt, mid: Pt, to: Pt) {
  const first = remap(t, 0, 0.45)
  const second = remap(t, 0.45, 1)
  if (second > 0) return lerpPt(mid, to, second)
  if (first > 0) return lerpPt(from, mid, first)
  return from
}

function goAndBack(t: number, go: number, back: number, from: Pt, mid: Pt) {
  const outbound = remap(t, go, go + 0.08)
  const inbound = remap(t, back - 0.08, back)
  if (inbound > 0) return { pt: lerpPt(mid, from, inbound), away: inbound < 1 }
  if (outbound > 0) return { pt: lerpPt(from, mid, outbound), away: true }
  return { pt: from, away: false }
}

export type Mode = 'one' | 'zoom' | 'split'

export type Actor = {
  x: number
  y: number
  opacity: number
  sterilised: boolean
  kitten?: boolean
  mark?: boolean
}

export type Scene = {
  step: (typeof STEPS)[number]
  local: number
  mode: Mode
  year: 0 | 1 | 5 | 10 | null
  hero: Actor & { wander: boolean; inCage: boolean }
  trapOn: boolean
  trapClosed: boolean
  territoryEmpty: boolean
  replacement: Actor
  poundHot: boolean
  clinicOn: boolean
  noKittens: boolean
  neighbours: Actor[]
  fieldOn: number
  trapStory: number
  sterStory: number
  numbersOn: boolean
  dataOn: boolean
  yearAt: number | null
}

function yearFromStory(story: number): 0 | 1 | 5 | 10 {
  if (story < 0.18) return 0
  if (story < 0.42) return 1
  if (story < 0.72) return 5
  return 10
}

export function trapActors(story: number): Actor[] {
  const leaveAt = new Map(TRAP_LEAVE.map((d) => [d.i, d]))
  const actors: Actor[] = SPLIT_HOMES.map((home, i) => {
    const leave = leaveAt.get(i)
    let pt = home
    if (leave) {
      const t = remap(story, leave.a, leave.b)
      const dest = POUND_SLOTS[i % POUND_SLOTS.length] ?? POUND_SLOTS[0]
      pt = travel(t, home, { x: home.x, y: SPLIT_GATE_Y }, dest)
    }
    return { x: pt.x, y: pt.y, opacity: 1, sterilised: false, mark: true }
  })

  for (const cat of TRAP_NEW) {
    const home = SPLIT_HOMES[cat.home] ?? SPLIT_HOMES[0]
    const dest = POUND_SLOTS[12 + cat.pound] ?? POUND_SLOTS[0]
    const shown = remap(story, cat.appear, cat.appear + 0.08)
    if (shown <= 0) continue
    const t = remap(story, cat.leaveA, cat.leaveB)
    const pt = travel(t, home, { x: home.x, y: SPLIT_GATE_Y }, dest)
    actors.push({
      x: pt.x,
      y: pt.y,
      opacity: shown,
      sterilised: false,
      kitten: true,
      mark: true,
    })
  }
  return actors
}

export function sterActors(story: number): Actor[] {
  const waveAt = new Map(STER_WAVES.map((d) => [d.i, d]))
  const fadeAt = new Map(STER_FADE.map((d) => [d.i, d]))
  const poundAt = new Map(STER_POUND.map((d) => [d.i, d]))

  return SPLIT_HOMES.map((home, i) => {
    const wave = waveAt.get(i)
    const fade = fadeAt.get(i)
    const toPound = poundAt.get(i)
    let pt = home
    let sterilised = false
    if (wave) {
      const trip = goAndBack(story, wave.go, wave.back, home, SPLIT_VET)
      pt = trip.pt
      sterilised = story >= wave.back
    }
    if (toPound) {
      const t = remap(story, toPound.a, toPound.b)
      if (t > 0) {
        const dest = POUND_SLOTS[i % 6] ?? POUND_SLOTS[0]
        pt = travel(t, home, { x: home.x, y: SPLIT_GATE_Y }, dest)
      }
    }
    const opacity = fade ? 1 - remap(story, fade.a, fade.b) * 0.85 : 1
    return { x: pt.x, y: pt.y, opacity, sterilised, mark: true }
  })
}

export function sceneFromProgress(progress: number): Scene {
  const p = clamp(progress)
  const n = STEPS.length
  const scaled = p * (n - 0.001)
  const index = Math.min(n - 1, Math.floor(scaled))
  const local = scaled - index
  const step = STEPS[index] ?? STEPS[0]
  const id = step.id

  let hero: Scene['hero'] = {
    ...HOME,
    opacity: 1,
    sterilised: false,
    wander: true,
    inCage: false,
  }
  let trapOn = false
  let trapClosed = false
  let territoryEmpty = false
  let replacement: Actor = {
    x: INCOMING_START.x,
    y: INCOMING_START.y,
    opacity: 0,
    sterilised: false,
  }
  let poundHot = false
  let clinicOn = false
  let noKittens = false
  let mode: Mode = 'one'
  let year: Scene['year'] = null
  let neighbours: Actor[] = []
  let fieldOn = 0
  let trapStory = 0
  let sterStory = 0
  let numbersOn = false
  let dataOn = false
  let yearAt: number | null = null

  if (id === 'live' || id === 'two-ways') {
    hero.wander = true
  }

  if (id === 'trap') {
    trapOn = true
    const close = remap(local, 0.08, 0.22)
    trapClosed = close > 0.85
    hero.inCage = close > 0.4
    hero.wander = false
    const leave = remap(local, 0.28, 1)
    if (leave > 0) {
      const pt = travel(leave, HOME, GATE, POUND_HERO)
      hero.x = pt.x
      hero.y = pt.y
      hero.inCage = leave < 0.92
      trapOn = leave < 0.55
      poundHot = leave > 0.7
    }
  }

  if (id === 'admission') {
    hero = {
      ...POUND_HERO,
      opacity: 1,
      sterilised: false,
      wander: false,
      inCage: false,
    }
    territoryEmpty = true
    poundHot = true
  }

  if (id === 'vacancy') {
    hero = {
      ...POUND_HERO,
      opacity: 1,
      sterilised: false,
      wander: false,
      inCage: false,
    }
    territoryEmpty = local < 0.82
    poundHot = true
    const walk = remap(local, 0.08, 0.9)
    const pt = lerpPt(INCOMING_START, HOME, walk)
    replacement = {
      x: pt.x,
      y: pt.y,
      opacity: remap(local, 0, 0.12),
      sterilised: false,
    }
  }

  if (id === 'reset') {
    const fadeOld = 1 - remap(local, 0, 0.45)
    replacement = {
      ...HOME,
      opacity: fadeOld,
      sterilised: false,
    }
    hero = {
      ...HOME,
      opacity: remap(local, 0.4, 0.85),
      sterilised: false,
      wander: local > 0.7,
      inCage: false,
    }
    poundHot = fadeOld > 0.4
  }

  if (id === 'sterilise') {
    clinicOn = true
    trapOn = local < 0.55
    hero.wander = false
    const close = remap(local, 0.05, 0.18)
    trapClosed = close > 0.8 && local < 0.42
    hero.inCage = close > 0.35 && local < 0.45
    const toClinic = remap(local, 0.28, 0.55)
    const back = remap(local, 0.62, 0.95)
    if (back > 0) {
      const homeward = lerpPt(CLINIC, HOME, back)
      hero.x = homeward.x
      hero.y = homeward.y
      hero.sterilised = true
      hero.inCage = false
    } else if (toClinic > 0) {
      const pt = travel(toClinic, HOME, GATE, CLINIC)
      hero.x = pt.x
      hero.y = pt.y
      hero.sterilised = toClinic > 0.85
    }
  }

  if (id === 'stays') {
    clinicOn = true
    hero = {
      ...HOME,
      opacity: 1,
      sterilised: true,
      wander: true,
      inCage: false,
    }
    noKittens = true
  }

  if (id === 'zoom' || id === 'marks') {
    clinicOn = true
    hero = {
      ...HOME,
      opacity: 1,
      sterilised: true,
      wander: id === 'zoom' && local < 0.4,
      inCage: false,
    }
    fieldOn = id === 'zoom' ? remap(local, 0.05, 0.7) : 1
    neighbours = STREET_HOMES.map((home, i) => ({
      x: home.x,
      y: home.y,
      opacity: i === 3 ? 0 : fieldOn,
      sterilised: false,
      mark: id === 'marks' || (id === 'zoom' && local > 0.55),
    }))
    mode = fieldOn > 0.85 ? 'zoom' : 'one'
  }

  if (
    id === 'split' ||
    id === 'y0' ||
    id === 'y1' ||
    id === 'y5' ||
    id === 'y10' ||
    id === 'data' ||
    id === 'insight'
  ) {
    mode = 'split'
    fieldOn = 1
    if (id === 'split') {
      year = 0
      yearAt = 0
      trapStory = 0
      sterStory = 0
    } else if (id === 'y0') {
      year = 0
      yearAt = 0
      trapStory = remap(local, 0, 1) * 0.04
      sterStory = trapStory
    } else if (id === 'y1') {
      year = local < 0.35 ? 0 : 1
      yearAt = lerp(0, 1, local)
      trapStory = lerp(0.04, 0.28, local)
      sterStory = lerp(0.04, 0.3, local)
    } else if (id === 'y5') {
      year = local < 0.2 ? 1 : 5
      yearAt = lerp(1, 5, local)
      trapStory = lerp(0.28, 0.68, local)
      sterStory = lerp(0.3, 0.7, local)
    } else if (id === 'y10') {
      year = local < 0.15 ? 5 : 10
      yearAt = lerp(5, 10, local)
      trapStory = lerp(0.68, 1, local)
      sterStory = lerp(0.7, 1, local)
    } else {
      year = 10
      yearAt = 10
      trapStory = 1
      sterStory = 1
    }
    numbersOn = id === 'data' || id === 'insight'
    dataOn = id === 'data'
  }

  if (mode === 'split') {
    year = year ?? yearFromStory(trapStory)
    if (yearAt === null) yearAt = year
  }

  return {
    step,
    local,
    mode,
    year,
    hero,
    trapOn,
    trapClosed,
    territoryEmpty,
    replacement,
    poundHot,
    clinicOn,
    noKittens,
    neighbours,
    fieldOn,
    trapStory,
    sterStory,
    numbersOn,
    dataOn,
    yearAt,
  }
}
