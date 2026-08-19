export type Pt = { x: number; y: number }

export const YEAR10 = {
  trap: { population: 39, enteringCare: 99 },
  sterilise: { population: 65, enteringCare: 25 },
} as const

export const HOMES: Pt[] = [
  { x: 86, y: 168 },
  { x: 148, y: 148 },
  { x: 214, y: 172 },
  { x: 278, y: 144 },
  { x: 342, y: 168 },
  { x: 72, y: 248 },
  { x: 138, y: 268 },
  { x: 206, y: 246 },
  { x: 272, y: 274 },
  { x: 340, y: 252 },
  { x: 96, y: 348 },
  { x: 168, y: 368 },
  { x: 238, y: 346 },
  { x: 308, y: 372 },
  { x: 368, y: 348 },
  { x: 124, y: 430 },
  { x: 204, y: 448 },
  { x: 286, y: 432 },
  { x: 52, y: 308 },
  { x: 392, y: 308 },
]

export const DOOR_SLOTS: Pt[] = [
  { x: 768, y: 188 },
  { x: 812, y: 208 },
  { x: 856, y: 186 },
  { x: 900, y: 210 },
  { x: 944, y: 190 },
  { x: 756, y: 246 },
  { x: 800, y: 264 },
  { x: 844, y: 248 },
  { x: 888, y: 266 },
  { x: 932, y: 250 },
  { x: 772, y: 308 },
  { x: 816, y: 324 },
  { x: 860, y: 310 },
  { x: 904, y: 328 },
  { x: 948, y: 312 },
  { x: 784, y: 368 },
  { x: 832, y: 384 },
  { x: 880, y: 370 },
  { x: 928, y: 386 },
  { x: 800, y: 422 },
]

export const CLINIC: Pt = { x: 628, y: 214 }
export const INCOMING: Pt = { x: 18, y: 392 }
export const GATE: Pt = { x: 520, y: 300 }

export const STEPS = [
  {
    id: 'ask',
    height: 88,
    chapter: 'Two counts',
    caption:
      'Why can there be fewer cats living on the streets, but just as many ending up in pounds and shelters?',
  },
  {
    id: 'two-numbers',
    height: 78,
    chapter: 'Two counts',
    caption:
      'Those are two different numbers. How many cats still live on this street. And how many turn up at a pound or shelter this year.',
  },
  {
    id: 'naive',
    height: 78,
    chapter: 'The mix-up',
    caption: 'A quieter street does not always mean a quieter pound.',
  },
  {
    id: 'trap-is',
    height: 100,
    chapter: 'Way 1 · Catch and take away',
    caption:
      'First way: catch the cat and take it away. That cat is now at the pound. Catching cats is how they get there.',
  },
  {
    id: 'through',
    height: 140,
    chapter: 'Way 1 · Catch and take away',
    caption:
      'Watch both sides. Every cat that leaves the street walks through that door. The street looks emptier because the pound is busier.',
  },
  {
    id: 'vacancy',
    height: 120,
    chapter: 'Empty space',
    caption:
      'Taking a cat away leaves a gap — food and a place to live. Other cats that have not been desexed move in. They can still have kittens.',
  },
  {
    id: 'again',
    height: 100,
    chapter: 'Empty space',
    caption: 'Those new cats can be caught too. The street can stay quieter. The door stays just as busy.',
  },
  {
    id: 'now-the-model',
    height: 88,
    chapter: 'Looking 10 years ahead',
    caption:
      'This picture is only to show the idea. It is not a real neighbourhood count. Next we look 10 years ahead. If what Australia does now counts as 100…',
  },
  {
    id: 'year10-trap',
    height: 132,
    chapter: 'Way 1 after 10 years',
    caption:
      'Catch twice as many cats. After 10 years the street is much quieter — 39, if what we do now is 100 — but almost as many cats still arrive at the pound: 99.',
  },
  {
    id: 'other-method',
    height: 168,
    chapter: 'A different way',
    caption:
      'Now a completely different way. Same street. We start again. This time: desex the cat, then send it home.',
  },
  {
    id: 'return',
    height: 132,
    chapter: 'Way 2 · Desex and send home',
    caption:
      'The cat is desexed and comes back. That trip is not a trip to the pound. The cat still lives here, but cannot have kittens.',
  },
  {
    id: 'hold',
    height: 112,
    chapter: 'Way 2 · Desex and send home',
    caption:
      'Because the cat comes home, there is less empty space for new cats that can still have kittens. Cats drawn as an outline have been desexed.',
  },
  {
    id: 'year10-ster',
    height: 132,
    chapter: 'Way 2 after 10 years',
    caption:
      'Same idea — what we do now is 100. Desex about five cats a year for every thousand people who live there: 65 still on the street, 25 arriving at the pound.',
  },
  {
    id: 'point',
    height: 124,
    chapter: 'The point',
    caption:
      'Catching enough cats can mean fewer living on the street, but it cannot mean fewer arriving at the pound — because catching them is how they get there. Desexing them and sending them home can lower both.',
  },
] as const

export type StepId = (typeof STEPS)[number]['id']

const TRAP_LEAVE = [
  { i: 0, a: 0.04, b: 0.18 },
  { i: 2, a: 0.08, b: 0.22 },
  { i: 4, a: 0.12, b: 0.28 },
  { i: 5, a: 0.16, b: 0.32 },
  { i: 7, a: 0.22, b: 0.38 },
  { i: 9, a: 0.28, b: 0.44 },
  { i: 11, a: 0.34, b: 0.5 },
  { i: 13, a: 0.4, b: 0.56 },
  { i: 15, a: 0.46, b: 0.62 },
  { i: 17, a: 0.52, b: 0.68 },
  { i: 1, a: 0.58, b: 0.74 },
  { i: 8, a: 0.64, b: 0.8 },
  { i: 19, a: 0.7, b: 0.86 },
]

const TRAP_NEW = [
  { home: 0, appear: 0.32, leaveA: 0.58, leaveB: 0.74, slot: 13 },
  { home: 4, appear: 0.4, leaveA: 0.66, leaveB: 0.82, slot: 14 },
  { home: 7, appear: 0.48, leaveA: 0.74, leaveB: 0.9, slot: 15 },
  { home: 11, appear: 0.56, leaveA: 0.8, leaveB: 0.94, slot: 16 },
  { home: 15, appear: 0.64, leaveA: 0.86, leaveB: 0.98, slot: 17 },
]

const STER_WAVES = [
  { i: 3, go: 0.04, back: 0.16 },
  { i: 0, go: 0.06, back: 0.18 },
  { i: 6, go: 0.08, back: 0.2 },
  { i: 10, go: 0.1, back: 0.22 },
  { i: 14, go: 0.12, back: 0.24 },
  { i: 1, go: 0.22, back: 0.36 },
  { i: 4, go: 0.24, back: 0.38 },
  { i: 8, go: 0.26, back: 0.4 },
  { i: 12, go: 0.28, back: 0.42 },
  { i: 16, go: 0.3, back: 0.44 },
  { i: 2, go: 0.42, back: 0.56 },
  { i: 5, go: 0.44, back: 0.58 },
  { i: 9, go: 0.46, back: 0.6 },
  { i: 11, go: 0.48, back: 0.62 },
  { i: 18, go: 0.5, back: 0.64 },
  { i: 7, go: 0.6, back: 0.74 },
  { i: 13, go: 0.62, back: 0.76 },
  { i: 15, go: 0.64, back: 0.78 },
  { i: 17, go: 0.66, back: 0.8 },
  { i: 19, go: 0.68, back: 0.82 },
]

const STER_FADE = [
  { i: 1, a: 0.5, b: 0.72 },
  { i: 5, a: 0.56, b: 0.78 },
  { i: 8, a: 0.62, b: 0.84 },
  { i: 15, a: 0.7, b: 0.9 },
  { i: 18, a: 0.76, b: 0.94 },
]

const STER_POUND = [
  { i: 2, a: 0.52, b: 0.68 },
  { i: 19, a: 0.72, b: 0.88 },
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

export type Actor = {
  x: number
  y: number
  opacity: number
  sterilised: boolean
  kitten?: boolean
  atDoor: boolean
}

export type NumbersKind = 'off' | 'model-trap' | 'model-ster'

export type Scene = {
  step: (typeof STEPS)[number]
  local: number
  actors: Actor[]
  doorOn: number
  clinicOn: number
  vacancyOn: number
  metersOn: number
  mode: 'trap' | 'sterilise'
  numbers: NumbersKind
  method: 0 | 1 | 2
  methodTag: string
  resetBanner: number
  compareOn: boolean
  note: string
}

function trapActors(story: number): Actor[] {
  const leaveAt = new Map(TRAP_LEAVE.map((d) => [d.i, d]))
  const actors: Actor[] = HOMES.map((home, i) => {
    const leave = leaveAt.get(i)
    let pt = home
    let atDoor = false
    if (leave) {
      const t = remap(story, leave.a, leave.b)
      const dest = DOOR_SLOTS[i % DOOR_SLOTS.length] ?? DOOR_SLOTS[0]
      pt = travel(t, home, GATE, dest)
      atDoor = t > 0.72
    }
    return { x: pt.x, y: pt.y, opacity: 1, sterilised: false, atDoor }
  })

  for (const cat of TRAP_NEW) {
    const home = HOMES[cat.home] ?? HOMES[0]
    const dest = DOOR_SLOTS[cat.slot] ?? DOOR_SLOTS[0]
    const shown = remap(story, cat.appear, cat.appear + 0.08)
    if (shown <= 0) continue
    const walkIn = remap(story, cat.appear, cat.appear + 0.16)
    const start = lerpPt(INCOMING, home, walkIn)
    const t = remap(story, cat.leaveA, cat.leaveB)
    const pt = t > 0 ? travel(t, home, GATE, dest) : start
    actors.push({
      x: pt.x,
      y: pt.y,
      opacity: shown,
      sterilised: false,
      kitten: true,
      atDoor: t > 0.72,
    })
  }
  return actors
}

function sterActors(story: number): Actor[] {
  const waveAt = new Map(STER_WAVES.map((d) => [d.i, d]))
  const fadeAt = new Map(STER_FADE.map((d) => [d.i, d]))
  const poundAt = new Map(STER_POUND.map((d) => [d.i, d]))

  return HOMES.map((home, i) => {
    const wave = waveAt.get(i)
    const fade = fadeAt.get(i)
    const toPound = poundAt.get(i)
    let pt = home
    let sterilised = false
    let atDoor = false
    if (wave) {
      const trip = goAndBack(story, wave.go, wave.back, home, CLINIC)
      pt = trip.pt
      sterilised = story >= wave.back
    }
    if (toPound) {
      const t = remap(story, toPound.a, toPound.b)
      if (t > 0) {
        const dest = DOOR_SLOTS[i % 6] ?? DOOR_SLOTS[0]
        pt = travel(t, home, GATE, dest)
        atDoor = t > 0.72
      }
    }
    const opacity = fade ? 1 - remap(story, fade.a, fade.b) * 0.82 : 1
    return { x: pt.x, y: pt.y, opacity, sterilised, atDoor }
  })
}

export function sceneFromProgress(progress: number): Scene {
  const p = clamp(progress)
  const weights = STEPS.map((s) => s.height)
  const total = weights.reduce((sum, w) => sum + w, 0)
  let t = p * (total - 0.001)
  let index = 0
  let local = 0
  for (let i = 0; i < STEPS.length; i++) {
    const w = weights[i] ?? 100
    if (t <= w || i === STEPS.length - 1) {
      index = i
      local = clamp(t / w)
      break
    }
    t -= w
  }
  const step = STEPS[index] ?? STEPS[0]
  const id = step.id

  let trapStory = 0
  let sterStory = 0
  let doorOn = 0
  let clinicOn = 0
  let vacancyOn = 0
  let metersOn = 0
  let mode: Scene['mode'] = 'trap'
  let numbers: NumbersKind = 'off'
  let methodTag = 'Watch the street and the door'
  let method: 0 | 1 | 2 = 0
  let resetBanner = 0
  let compareOn = false
  let note = 'This picture is to show the idea. It is not a count of real cats.'

  if (id === 'ask') {
    doorOn = remap(local, 0.35, 1)
  } else if (id === 'two-numbers') {
    doorOn = 1
    metersOn = remap(local, 0.2, 0.7)
  } else if (id === 'naive') {
    doorOn = 1
    metersOn = 1
  } else if (id === 'trap-is') {
    doorOn = 1
    metersOn = 1
    method = 1
    methodTag = 'Way 1 · Catch and take away'
    trapStory = remap(local, 0.15, 1) * 0.12
  } else if (id === 'through') {
    doorOn = 1
    metersOn = 1
    method = 1
    methodTag = 'Way 1 · Catch and take away'
    trapStory = lerp(0.12, 0.62, local)
  } else if (id === 'vacancy') {
    doorOn = 1
    metersOn = 1
    method = 1
    methodTag = 'Way 1 · Catch and take away'
    vacancyOn = remap(local, 0, 0.35)
    trapStory = lerp(0.5, 0.78, local)
  } else if (id === 'again') {
    doorOn = 1
    metersOn = 1
    method = 1
    methodTag = 'Way 1 · Catch and take away'
    vacancyOn = 1
    trapStory = lerp(0.78, 1, local)
  } else if (id === 'now-the-model') {
    doorOn = 1
    metersOn = 1
    method = 1
    methodTag = 'Way 1 · Catch and take away'
    vacancyOn = 1 - remap(local, 0.55, 1)
    trapStory = 1
    numbers = local > 0.55 ? 'model-trap' : 'off'
    note =
      'If what Australia does now counts as 100, these figures show what catching twice as many cats does after 10 years.'
  } else if (id === 'year10-trap') {
    doorOn = 1
    metersOn = 1
    method = 1
    methodTag = 'Way 1 · Catch and take away'
    trapStory = 1
    numbers = 'model-trap'
    note = 'What we do now is 100. These numbers look 10 years ahead. They are not a count of the cats in the picture.'
  } else if (id === 'other-method') {
    doorOn = 1
    clinicOn = remap(local, 0.48, 0.78)
    metersOn = remap(local, 0.7, 1)
    method = 2
    methodTag = 'Way 2 · Desex and send home'
    resetBanner = 1 - remap(local, 0.68, 0.94)
    trapStory = 0
    numbers = 'off'
    vacancyOn = 1 - remap(local, 0, 0.22)
    note = 'Same street. A different way. The cats are back. We start the story again.'
  } else if (id === 'return') {
    mode = 'sterilise'
    doorOn = 1
    clinicOn = 1
    metersOn = 1
    method = 2
    methodTag = 'Way 2 · Desex and send home'
    sterStory = remap(local, 0.1, 1) * 0.28
    note = 'Solid black cats can still have kittens. Cats with an empty middle have been desexed and sent home.'
  } else if (id === 'hold') {
    mode = 'sterilise'
    doorOn = 1
    clinicOn = 1
    metersOn = 1
    method = 2
    methodTag = 'Way 2 · Desex and send home'
    sterStory = lerp(0.28, 0.78, local)
    note = 'Solid black cats can still have kittens. Cats with an empty middle have been desexed and sent home.'
  } else if (id === 'year10-ster') {
    mode = 'sterilise'
    doorOn = 1
    clinicOn = 1
    metersOn = 1
    method = 2
    methodTag = 'Way 2 · Desex and send home'
    sterStory = 1
    numbers = 'model-ster'
    note =
      'What we do now is 100 again. This is after 10 years of desexing about five cats a year for every thousand people.'
  } else {
    mode = 'sterilise'
    doorOn = 1
    clinicOn = 1
    metersOn = 1
    method = 2
    methodTag = 'The two ways, side by side'
    sterStory = 1
    numbers = 'model-ster'
    compareOn = true
    note = 'The picture showed how it works. The 39, 99, 65 and 25 numbers look 10 years ahead.'
  }

  let actors: Actor[]
  if (id === 'other-method') {
    const fadeOut = 1 - remap(local, 0.08, 0.36)
    const fadeIn = remap(local, 0.5, 0.82)
    actors = [
      ...trapActors(1).map((cat) => ({ ...cat, opacity: cat.opacity * fadeOut })),
      ...trapActors(0).map((cat) => ({ ...cat, opacity: fadeIn })),
    ]
  } else {
    actors = mode === 'trap' ? trapActors(trapStory) : sterActors(sterStory)
  }

  return {
    step,
    local,
    actors,
    doorOn,
    clinicOn,
    vacancyOn,
    metersOn,
    mode,
    numbers,
    method,
    methodTag,
    resetBanner,
    compareOn,
    note,
  }
}
