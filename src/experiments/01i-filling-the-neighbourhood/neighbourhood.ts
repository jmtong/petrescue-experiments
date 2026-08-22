/** Illustrative toy model — not the research population model. */

export type Mode = 'none' | 'trap' | 'desex'
export type ClusterId = 'yard-n' | 'yard-w' | 'lane' | 'park' | 'shed' | 'yard-se'

export type Spot = {
  id: string
  cluster: ClusterId
  x: number
  y: number
}

export type CatDef = {
  id: string
  parentId: string | null
  cluster: ClusterId
  spotId: string
  bornAt: number
  matureAt: number
  /** Immigrant filling vacated space after trapping (not a birth). */
  immigrant?: boolean
}

export type CatState = {
  id: string
  parentId: string | null
  cluster: ClusterId
  x: number
  y: number
  born: boolean
  living: boolean
  kitten: boolean
  desexed: boolean
  removed: boolean
  immigrant: boolean
  rot: number
  scale: number
}

export const VIEW = { w: 1040, h: 640 }
export const MAX_TICK = 9
export const TICK_MS = 1100
export const YEAR_LABELS = ['START', 'YEAR 1', 'YEAR 2', 'YEAR 3', 'YEAR 4'] as const

/** Trap pulses — repeated remove → space → refill cycles. */
export const TRAP_TICKS = [3, 5, 7] as const
/** Desex after clusters densify: wave 1 (yard-n/lane), wave 2 (park/shed). */
export const DESEX_WAVE1_TICK = 5
export const DESEX_WAVE2_TICK = 7

export function yearFromTick(tick: number) {
  if (tick <= 0) return 0
  if (tick <= 2) return 1
  if (tick <= 4) return 2
  if (tick <= 6) return 3
  return 4
}

function hash(id: string) {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n * 31 + id.charCodeAt(i)) % 997
  return n / 997
}

function jitter(id: string, span: number) {
  return (hash(id) - 0.5) * span
}

type ClusterSeed = {
  id: ClusterId
  cx: number
  cy: number
  count: number
  spreadX: number
  spreadY: number
}

const CLUSTER_SEEDS: ClusterSeed[] = [
  { id: 'yard-n', cx: 168, cy: 168, count: 8, spreadX: 88, spreadY: 58 },
  { id: 'yard-w', cx: 108, cy: 355, count: 7, spreadX: 72, spreadY: 70 },
  { id: 'lane', cx: 430, cy: 295, count: 9, spreadX: 46, spreadY: 150 },
  { id: 'park', cx: 740, cy: 270, count: 9, spreadX: 110, spreadY: 90 },
  { id: 'shed', cx: 545, cy: 490, count: 7, spreadX: 90, spreadY: 48 },
  { id: 'yard-se', cx: 265, cy: 505, count: 7, spreadX: 95, spreadY: 55 },
]

export const SPOTS: Spot[] = []
const spotById: Record<string, Spot> = {}

for (const seed of CLUSTER_SEEDS) {
  for (let i = 0; i < seed.count; i += 1) {
    const id = `${seed.id}-${i}`
    const angle = (i / seed.count) * Math.PI * 2 + hash(id) * 1.2
    const radius = 0.25 + hash(`${id}-r`) * 0.75
    const spot: Spot = {
      id,
      cluster: seed.id,
      x: seed.cx + Math.cos(angle) * seed.spreadX * radius + jitter(`${id}-x`, 14),
      y: seed.cy + Math.sin(angle) * seed.spreadY * radius + jitter(`${id}-y`, 12),
    }
    SPOTS.push(spot)
    spotById[id] = spot
  }
}

function spotsIn(cluster: ClusterId) {
  return SPOTS.filter((s) => s.cluster === cluster)
}

function pickSpot(cluster: ClusterId, used: Set<string>, preferNear?: Spot): Spot {
  const pool = spotsIn(cluster)
  const free = pool.filter((s) => !used.has(s.id))
  const choices = free.length ? free : pool
  if (preferNear) {
    choices.sort((a, b) => {
      const da = (a.x - preferNear.x) ** 2 + (a.y - preferNear.y) ** 2
      const db = (b.x - preferNear.x) ** 2 + (b.y - preferNear.y) ** 2
      return da - db
    })
    return choices[0]
  }
  return choices[Math.floor(hash(cluster + used.size) * choices.length) % choices.length]
}

const CATS: CatDef[] = []
const byId: Record<string, CatDef> = {}

function addCat(
  id: string,
  parentId: string | null,
  cluster: ClusterId,
  spotId: string,
  bornAt: number,
  immigrant = false,
) {
  const cat: CatDef = {
    id,
    parentId,
    cluster,
    spotId,
    bornAt,
    matureAt: bornAt === 0 ? 0 : bornAt + 1,
    immigrant,
  }
  CATS.push(cat)
  byId[id] = cat
  return cat
}

function placeLitter(
  parentId: string,
  tick: number,
  kids: { id: string; cluster: ClusterId }[],
  used: Set<string>,
) {
  const parent = byId[parentId]
  const parentSpot = spotById[parent.spotId]
  for (const kid of kids) {
    const spot = pickSpot(kid.cluster, used, parentSpot)
    used.add(spot.id)
    addCat(kid.id, parentId, kid.cluster, spot.id, tick)
  }
}

const usedAtBuild = new Set<string>()

{
  const s0 = pickSpot('yard-n', usedAtBuild)
  usedAtBuild.add(s0.id)
  addCat('f0', null, 'yard-n', s0.id, 0)
  const s1 = pickSpot('yard-n', usedAtBuild, s0)
  usedAtBuild.add(s1.id)
  addCat('m0', null, 'yard-n', s1.id, 0)
}

/* YEAR 1 — small litter near founders; one kitten drifts to the lane */
placeLitter(
  'f0',
  2,
  [
    { id: 'a', cluster: 'yard-n' },
    { id: 'b', cluster: 'yard-w' },
    { id: 'c', cluster: 'lane' },
  ],
  usedAtBuild,
)

/* YEAR 2 — clusters form across yards, lane, park */
placeLitter(
  'a',
  4,
  [
    { id: 'a1', cluster: 'yard-n' },
    { id: 'a2', cluster: 'lane' },
    { id: 'a3', cluster: 'lane' },
  ],
  usedAtBuild,
)
placeLitter(
  'b',
  4,
  [
    { id: 'b1', cluster: 'yard-w' },
    { id: 'b2', cluster: 'yard-w' },
    { id: 'b3', cluster: 'yard-se' },
  ],
  usedAtBuild,
)
placeLitter(
  'c',
  4,
  [
    { id: 'c1', cluster: 'lane' },
    { id: 'c2', cluster: 'park' },
    { id: 'c3', cluster: 'park' },
  ],
  usedAtBuild,
)

/* YEAR 3 — neighbourhood densifies */
placeLitter(
  'a1',
  6,
  [
    { id: 'a1a', cluster: 'yard-n' },
    { id: 'a1b', cluster: 'lane' },
    { id: 'a1c', cluster: 'lane' },
  ],
  usedAtBuild,
)
placeLitter(
  'a2',
  6,
  [
    { id: 'a2a', cluster: 'lane' },
    { id: 'a2b', cluster: 'park' },
    { id: 'a2c', cluster: 'park' },
  ],
  usedAtBuild,
)
placeLitter(
  'b1',
  6,
  [
    { id: 'b1a', cluster: 'yard-w' },
    { id: 'b1b', cluster: 'yard-w' },
    { id: 'b1c', cluster: 'yard-se' },
  ],
  usedAtBuild,
)
placeLitter(
  'c1',
  6,
  [
    { id: 'c1a', cluster: 'shed' },
    { id: 'c1b', cluster: 'shed' },
    { id: 'c1c', cluster: 'lane' },
  ],
  usedAtBuild,
)
placeLitter(
  'c2',
  6,
  [
    { id: 'c2a', cluster: 'park' },
    { id: 'c2b', cluster: 'park' },
    { id: 'c2c', cluster: 'shed' },
  ],
  usedAtBuild,
)

/* YEAR 4 — fills remaining pockets */
placeLitter(
  'a1a',
  8,
  [
    { id: 'z1', cluster: 'yard-n' },
    { id: 'z2', cluster: 'lane' },
    { id: 'z3', cluster: 'yard-w' },
  ],
  usedAtBuild,
)
placeLitter(
  'a2a',
  8,
  [
    { id: 'z4', cluster: 'lane' },
    { id: 'z5', cluster: 'park' },
    { id: 'z6', cluster: 'park' },
    { id: 'z7', cluster: 'shed' },
  ],
  usedAtBuild,
)
placeLitter(
  'b1a',
  8,
  [
    { id: 'z8', cluster: 'yard-w' },
    { id: 'z9', cluster: 'yard-se' },
    { id: 'z10', cluster: 'yard-se' },
  ],
  usedAtBuild,
)
placeLitter(
  'c1a',
  8,
  [
    { id: 'z11', cluster: 'shed' },
    { id: 'z12', cluster: 'shed' },
    { id: 'z13', cluster: 'park' },
  ],
  usedAtBuild,
)
placeLitter(
  'c2a',
  8,
  [
    { id: 'z14', cluster: 'park' },
    { id: 'z15', cluster: 'park' },
    { id: 'z16', cluster: 'lane' },
  ],
  usedAtBuild,
)
placeLitter(
  'b2',
  8,
  [
    { id: 'z17', cluster: 'yard-se' },
    { id: 'z18', cluster: 'yard-w' },
  ],
  usedAtBuild,
)
placeLitter(
  'c3',
  8,
  [
    { id: 'z19', cluster: 'park' },
    { id: 'z20', cluster: 'shed' },
  ],
  usedAtBuild,
)

/** Immigrants only appear in trap mode (vacancy refill). */
const IMMIGRANTS: { id: string; cluster: ClusterId; tick: number }[] = [
  { id: 'in1', cluster: 'yard-n', tick: 4 },
  { id: 'in2', cluster: 'lane', tick: 4 },
  { id: 'in3', cluster: 'park', tick: 4 },
  { id: 'in4', cluster: 'yard-w', tick: 4 },
  { id: 'in5', cluster: 'yard-n', tick: 6 },
  { id: 'in6', cluster: 'lane', tick: 6 },
  { id: 'in7', cluster: 'shed', tick: 6 },
  { id: 'in8', cluster: 'park', tick: 6 },
  { id: 'in9', cluster: 'yard-se', tick: 6 },
  { id: 'in10', cluster: 'yard-n', tick: 8 },
  { id: 'in11', cluster: 'lane', tick: 8 },
  { id: 'in12', cluster: 'park', tick: 8 },
  { id: 'in13', cluster: 'shed', tick: 8 },
  { id: 'in14', cluster: 'yard-w', tick: 8 },
  { id: 'in15', cluster: 'yard-se', tick: 8 },
]

for (const item of IMMIGRANTS) {
  const spot = pickSpot(item.cluster, usedAtBuild)
  usedAtBuild.add(spot.id)
  addCat(item.id, null, item.cluster, spot.id, item.tick, true)
}

/**
 * Trap batches — remove a noticeable share, leave breeders so space can refill.
 * Prefer denser / visible adults; leave some intact lines + later immigrants.
 */
const TRAP_BATCHES: Record<number, string[]> = {
  3: ['f0', 'm0', 'a'],
  5: ['a1', 'a2', 'a3', 'c1', 'c2', 'in1', 'in2'],
  7: ['a1a', 'a1b', 'a2a', 'a2b', 'c1a', 'c2a', 'in5', 'in6', 'in8'],
}

/** Wave 1: dense yard-n + lane hotspot. Wave 2: park + shed hotspot. */
const DESEX_WAVE1 = new Set([
  'f0',
  'm0',
  'a',
  'c',
  'a1',
  'a2',
  'a3',
  'c1',
  'a1a',
  'a1b',
  'a1c',
  'a2a',
  'c1c',
])
const DESEX_WAVE2 = new Set([
  'c2',
  'c3',
  'a2b',
  'a2c',
  'c1a',
  'c1b',
  'c2a',
  'c2b',
  'c2c',
  'z5',
  'z6',
  'z7',
  'z11',
  'z12',
  'z13',
  'z14',
  'z15',
  'z19',
  'z20',
])

function motherRemovedBefore(motherId: string, litterTick: number, mode: Mode) {
  if (mode !== 'trap') return false
  for (const pulse of TRAP_TICKS) {
    if (pulse <= litterTick && TRAP_BATCHES[pulse]?.includes(motherId)) return true
  }
  return false
}

function motherDesexedBefore(motherId: string, litterTick: number, mode: Mode, tick: number) {
  if (mode !== 'desex') return false
  if (DESEX_WAVE1.has(motherId) && tick >= DESEX_WAVE1_TICK && litterTick >= DESEX_WAVE1_TICK) {
    return true
  }
  if (DESEX_WAVE2.has(motherId) && tick >= DESEX_WAVE2_TICK && litterTick >= DESEX_WAVE2_TICK) {
    return true
  }
  return false
}

function isDesexedAt(catId: string, mode: Mode, tick: number) {
  if (mode !== 'desex') return false
  if (DESEX_WAVE1.has(catId) && tick >= DESEX_WAVE1_TICK) return true
  if (DESEX_WAVE2.has(catId) && tick >= DESEX_WAVE2_TICK) return true
  return false
}

function removedByTrap(catId: string, tick: number, mode: Mode) {
  if (mode !== 'trap') return false
  for (const pulse of TRAP_TICKS) {
    if (tick >= pulse && TRAP_BATCHES[pulse]?.includes(catId)) return true
  }
  return false
}

function isBorn(cat: CatDef, tick: number, mode: Mode) {
  if (cat.bornAt > tick) return false
  if (cat.immigrant) return mode === 'trap'
  if (!cat.parentId) return true
  const mother = byId[cat.parentId]
  if (!mother) return false
  if (motherRemovedBefore(mother.id, cat.bornAt, mode)) return false
  if (motherDesexedBefore(mother.id, cat.bornAt, mode, tick)) return false
  return true
}

export function simulate(tick: number, mode: Mode) {
  const year = yearFromTick(tick)
  const trapPulse = mode === 'trap' && (TRAP_TICKS as readonly number[]).includes(tick)
  const desexPulse =
    mode === 'desex' && (tick === DESEX_WAVE1_TICK || tick === DESEX_WAVE2_TICK)

  const cats: CatState[] = CATS.map((cat) => {
    const born = isBorn(cat, tick, mode)
    const removed = born && removedByTrap(cat.id, tick, mode)
    const living = born && !removed
    const desexed = living && isDesexedAt(cat.id, mode, tick)
    const kitten = living && tick < cat.matureAt
    const spot = spotById[cat.spotId]
    const rot = Math.round((hash(cat.id) - 0.5) * 28)
    return {
      id: cat.id,
      parentId: cat.parentId,
      cluster: cat.cluster,
      x: spot.x + jitter(`${cat.id}-jx`, kitten ? 6 : 4),
      y: spot.y + jitter(`${cat.id}-jy`, kitten ? 6 : 4),
      born,
      living,
      kitten,
      desexed,
      removed,
      immigrant: Boolean(cat.immigrant),
      rot,
      scale: kitten ? 0.72 : cat.immigrant ? 0.92 : 1,
    }
  })

  const living = cats.filter((c) => c.living)
  const removed = cats.filter((c) => c.removed)
  const desexed = living.filter((c) => c.desexed)

  return {
    cats,
    living,
    removed,
    desexed,
    year,
    trapPulse,
    desexPulse,
    livingCount: living.length,
  }
}

export function statusLine(mode: Mode, tick: number, trapPulse: boolean, _desexPulse: boolean) {
  if (mode === 'trap') {
    if (trapPulse) return 'Cats removed. Space opens up — for a while.'
    if (tick > TRAP_TICKS[0]) return 'Remaining cats breed, and others move into the gaps.'
    return ''
  }
  if (mode === 'desex') {
    if (tick === DESEX_WAVE1_TICK) return 'Dense hotspots desexed. Those cats stay.'
    if (tick === DESEX_WAVE2_TICK) return 'More hotspots treated. Those clusters stop producing kittens.'
    if (tick > DESEX_WAVE1_TICK) return 'Treated cats remain. Untreated spots still have litters — fewer overall.'
    return ''
  }
  return ''
}
