export type Mode = 'none' | 'trap' | 'desex'
export type Sex = 'f' | 'm'

export type LitterDef = {
  tick: number
  year: number
  mateId: string
  childIds: string[]
}

export type CatDef = {
  id: string
  parentId: string | null
  year: number
  sex: Sex
  bornAt: number
  matureAt: number
  litters: LitterDef[]
}

export type CatState = {
  id: string
  parentId: string | null
  year: number
  sex: Sex
  x: number
  y: number
  born: boolean
  kitten: boolean
  desexed: boolean
  removed: boolean
  targeted: boolean
  place: 'tree' | 'impound'
  scale: number
}

export type MateState = {
  id: string
  motherId: string
  x: number
  y: number
  visible: boolean
  pairX: number
  pairY: number
}

export type LinkState = {
  kind: 'pair' | 'litter' | 'cap'
  motherId: string
  mateId?: string
  childId?: string
  visible: boolean
  capped?: boolean
}

export const VIEW = { w: 1180, h: 740 }
export const MAX_TICK = 9
/** Intervention fires at the start of Year 3. */
export const INTERVENTION_TICK = 5
export const TICK_MS = 1100
export const TARGET_IDS = ['f0', 'a']
export const YEAR_LABELS = ['START', 'YEAR 1', 'YEAR 2', 'YEAR 3', 'YEAR 4'] as const
export const RING = ['#5f8f7a', '#8a6f9b', '#d4a07a', '#c27b6a', '#9a6b55'] as const

const TREE_LEFT = 118
const TREE_RIGHT = 980
const IMPOUND = { x: 1085, y: 210 }
const YEAR_Y = [108, 230, 360, 500, 640]

function isTarget(id: string) {
  return TARGET_IDS.includes(id)
}

function hash(id: string) {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n * 31 + id.charCodeAt(i)) % 997
  return n / 997
}

function jitter(id: string, span: number) {
  return (hash(id) - 0.5) * span
}

const byId: Record<string, CatDef> = {}
export const CATS: CatDef[] = []
const MATES: { id: string; motherId: string; tick: number; year: number }[] = []

function add(id: string, parentId: string | null, year: number, sex: Sex, bornAt: number) {
  const cat: CatDef = {
    id,
    parentId,
    year,
    sex,
    bornAt,
    matureAt: bornAt === 0 ? 0 : bornAt + 1,
    litters: [],
  }
  CATS.push(cat)
  byId[id] = cat
  return cat
}

function litter(
  motherId: string,
  tick: number,
  year: number,
  mateId: string,
  kids: [string, Sex][],
) {
  const mother = byId[motherId]
  const childIds: string[] = []
  for (const [id, sex] of kids) {
    add(id, motherId, year, sex, tick)
    childIds.push(id)
  }
  mother.litters.push({ tick, year, mateId, childIds })
  MATES.push({ id: mateId, motherId, tick, year })
}

/* Illustrative schedule — not the research model.
   START: founder alone
   YEAR 1: one small litter
   YEAR 2: daughters begin branching
   YEAR 3–4: density accelerates (unless desexed targets stop) */
add('f0', null, 0, 'f', 0)

litter('f0', 2, 1, 'm-f0-1', [
  ['a', 'f'],
  ['b', 'f'],
  ['c', 'm'],
])

litter('a', 4, 2, 'm-a-1', [
  ['a1', 'f'],
  ['a2', 'f'],
  ['a3', 'f'],
  ['a4', 'm'],
])
litter('b', 4, 2, 'm-b-1', [
  ['b1', 'f'],
  ['b2', 'f'],
  ['b3', 'm'],
])

litter('f0', 6, 3, 'm-f0-2', [
  ['d', 'f'],
  ['e', 'f'],
  ['f', 'm'],
])
litter('a', 6, 3, 'm-a-2', [
  ['a5', 'f'],
  ['a6', 'f'],
  ['a7', 'm'],
])
litter('b', 6, 3, 'm-b-2', [
  ['b4', 'f'],
  ['b5', 'f'],
  ['b6', 'f'],
])
litter('a1', 6, 3, 'm-a1-1', [
  ['a1a', 'f'],
  ['a1b', 'f'],
  ['a1c', 'm'],
])
litter('a2', 6, 3, 'm-a2-1', [
  ['a2a', 'f'],
  ['a2b', 'm'],
  ['a2c', 'f'],
])
litter('b1', 6, 3, 'm-b1-1', [
  ['b1a', 'f'],
  ['b1b', 'f'],
  ['b1c', 'm'],
])

litter('a1', 8, 4, 'm-a1-2', [
  ['a1d', 'f'],
  ['a1e', 'f'],
  ['a1f', 'm'],
  ['a1g', 'f'],
])
litter('a2', 8, 4, 'm-a2-2', [
  ['a2d', 'f'],
  ['a2e', 'f'],
  ['a2f', 'm'],
  ['a2g', 'f'],
])
litter('a3', 8, 4, 'm-a3-1', [
  ['a3a', 'f'],
  ['a3b', 'f'],
  ['a3c', 'm'],
  ['a3d', 'f'],
])
litter('b1', 8, 4, 'm-b1-2', [
  ['b1d', 'f'],
  ['b1e', 'm'],
  ['b1f', 'f'],
  ['b1g', 'f'],
])
litter('b2', 8, 4, 'm-b2-1', [
  ['b2a', 'f'],
  ['b2b', 'f'],
  ['b2c', 'm'],
  ['b2d', 'f'],
])
litter('a1a', 8, 4, 'm-a1a-1', [
  ['z1', 'f'],
  ['z2', 'm'],
  ['z3', 'f'],
])
litter('a1b', 8, 4, 'm-a1b-1', [
  ['z4', 'f'],
  ['z5', 'f'],
  ['z6', 'm'],
])
litter('b1a', 8, 4, 'm-b1a-1', [
  ['z7', 'f'],
  ['z8', 'm'],
  ['z9', 'f'],
])
litter('b4', 8, 4, 'm-b4-1', [
  ['z10', 'f'],
  ['z11', 'f'],
  ['z12', 'm'],
])
litter('d', 8, 4, 'm-d-1', [
  ['z13', 'f'],
  ['z14', 'm'],
  ['z15', 'f'],
])

function childrenOf(id: string) {
  return byId[id].litters.flatMap((item) => item.childIds)
}

const POS: Record<string, { x: number; y: number }> = {}
const MATE_POS: Record<string, { x: number; y: number; pairX: number; pairY: number }> = {}

function layout() {
  const leafGap = 1
  function placeX(id: string, next: number): number {
    const kids = childrenOf(id)
    if (kids.length === 0) {
      POS[id] = { x: next, y: 0 }
      return next + leafGap
    }
    let cursor = next
    const xs: number[] = []
    for (const kid of kids) {
      cursor = placeX(kid, cursor)
      xs.push(POS[kid].x)
    }
    POS[id] = { x: (xs[0] + xs[xs.length - 1]) / 2, y: 0 }
    return cursor
  }

  placeX('f0', 0)
  const maxX = Math.max(...CATS.map((c) => POS[c.id].x), 1)
  const width = TREE_RIGHT - TREE_LEFT

  for (const cat of CATS) {
    const unit = POS[cat.id]
    const pack = 0.55 + cat.year * 0.14
    const span = width * Math.min(1, 0.42 + pack)
    const center = (TREE_LEFT + TREE_RIGHT) / 2
    const xNorm = unit.x / maxX
    const crowded = cat.year >= 3 ? jitter(cat.id, 18 + cat.year * 8) : jitter(cat.id, 6)
    const yCrowd = cat.year >= 3 ? jitter(`${cat.id}-y`, 22 + cat.year * 6) : jitter(`${cat.id}-y`, 4)
    POS[cat.id] = {
      x: center - span / 2 + xNorm * span + crowded,
      y: YEAR_Y[cat.year] + yCrowd,
    }
  }

  // Founder alone — lots of empty space at START
  POS.f0 = { x: (TREE_LEFT + TREE_RIGHT) / 2, y: YEAR_Y[0] }

  for (const mate of MATES) {
    const mother = POS[mate.motherId]
    const side = hash(mate.id) > 0.5 ? 1 : -1
    const mx = mother.x + side * (28 + mate.year * 2)
    const my = mother.y + 2
    MATE_POS[mate.id] = {
      x: mx,
      y: my,
      pairX: (mother.x + mx) / 2,
      pairY: mother.y + 18,
    }
  }
}

layout()

function motherAllowsBirth(motherId: string, litterTick: number, mode: Mode, tick: number) {
  if (litterTick > tick) return false
  if (mode === 'none') return true
  if (tick < INTERVENTION_TICK) return true
  if (litterTick >= INTERVENTION_TICK && isTarget(motherId)) return false
  return true
}

function isBorn(cat: CatDef, tick: number, mode: Mode) {
  if (cat.bornAt > tick) return false
  if (!cat.parentId) return true
  const mother = byId[cat.parentId]
  const event = mother.litters.find((item) => item.childIds.includes(cat.id))
  if (!event) return false
  return motherAllowsBirth(mother.id, event.tick, mode, tick)
}

/** Pair appears one tick before litter, stays briefly into the litter tick. */
function mateVisible(mateTick: number, tick: number) {
  return tick === mateTick - 1 || tick === mateTick
}

export function yearFromTick(tick: number) {
  if (tick <= 0) return 0
  if (tick <= 2) return 1
  if (tick <= 4) return 2
  if (tick <= 6) return 3
  return 4
}

export function yearBandY(year: number) {
  return YEAR_Y[year] ?? YEAR_Y[YEAR_Y.length - 1]
}

export function densityScale(living: number) {
  if (living < 8) return 1
  if (living < 18) return 0.88
  if (living < 32) return 0.72
  if (living < 48) return 0.6
  return 0.52
}

export function branchFromPair(
  pair: { x: number; y: number },
  child: { x: number; y: number },
  cardHalf: number,
) {
  const y2 = child.y - cardHalf
  const mid = (pair.y + y2) / 2
  return `M ${pair.x} ${pair.y} V ${mid} H ${child.x} V ${y2}`
}

export function pairBridge(mother: { x: number; y: number }, mate: { x: number; y: number }) {
  return `M ${mother.x} ${mother.y + 8} H ${mate.x}`
}

export function capStub(cat: { x: number; y: number }, cardHalf: number) {
  const y1 = cat.y + cardHalf
  const y2 = y1 + 22
  return {
    line: `M ${cat.x} ${y1} V ${y2}`,
    cx: cat.x,
    cy: y2,
  }
}

export function simulate(tick: number, mode: Mode) {
  const intervened = tick >= INTERVENTION_TICK && mode !== 'none'
  const year = yearFromTick(tick)

  const bornFlags = CATS.map((cat) => isBorn(cat, tick, mode))
  const livingCount = CATS.reduce((count, cat, i) => {
    if (!bornFlags[i]) return count
    if (intervened && mode === 'trap' && isTarget(cat.id)) return count
    return count + 1
  }, 0)
  const scale = densityScale(livingCount)
  const cardHalf = 26 * scale

  const cats: CatState[] = CATS.map((cat, i) => {
    const born = bornFlags[i]
    const targeted = isTarget(cat.id)
    const removed = Boolean(born && intervened && mode === 'trap' && targeted)
    const desexed = Boolean(born && intervened && mode === 'desex' && targeted)
    const kitten = born && tick < cat.matureAt
    const home = POS[cat.id]
    const targetIndex = TARGET_IDS.indexOf(cat.id)
    return {
      id: cat.id,
      parentId: cat.parentId,
      year: cat.year,
      sex: cat.sex,
      x: removed ? IMPOUND.x + jitter(cat.id, 36) : home.x,
      y: removed ? IMPOUND.y + 42 + Math.max(0, targetIndex) * 56 : home.y,
      born,
      kitten,
      desexed,
      removed,
      targeted,
      place: removed ? 'impound' : 'tree',
      scale: !born ? scale : kitten ? scale * 0.78 : scale,
    }
  })

  const mates: MateState[] = MATES.map((mate) => {
    const motherBorn = isBorn(byId[mate.motherId], tick, mode)
    const litterOk = motherAllowsBirth(mate.motherId, mate.tick, mode, tick)
    const show = motherBorn && litterOk && mateVisible(mate.tick, tick)
    const pos = MATE_POS[mate.id]
    return {
      id: mate.id,
      motherId: mate.motherId,
      x: pos.x,
      y: pos.y,
      visible: show,
      pairX: pos.pairX,
      pairY: pos.pairY,
    }
  })

  const links: LinkState[] = []

  for (const mate of mates) {
    if (!mate.visible) continue
    links.push({
      kind: 'pair',
      motherId: mate.motherId,
      mateId: mate.id,
      visible: true,
    })
  }

  for (const cat of cats) {
    if (!cat.parentId || !cat.born) continue
    const mother = byId[cat.parentId]
    const event = mother.litters.find((item) => item.childIds.includes(cat.id))
    if (!event) continue
    const motherState = cats.find((item) => item.id === mother.id)
    if (!motherState?.born) continue
    links.push({
      kind: 'litter',
      motherId: mother.id,
      mateId: event.mateId,
      childId: cat.id,
      visible: true,
    })
  }

  if (mode === 'desex' && intervened) {
    for (const id of TARGET_IDS) {
      const cat = cats.find((item) => item.id === id)
      if (!cat?.born || cat.removed) continue
      links.push({ kind: 'cap', motherId: id, visible: true, capped: true })
    }
  }

  const living = cats.filter((cat) => cat.born && !cat.removed).length
  const impounded = cats.filter((cat) => cat.place === 'impound')

  return {
    cats,
    mates,
    links,
    year,
    living,
    scale,
    cardHalf,
    intervened,
    impounded,
    yearY: YEAR_Y,
  }
}

export function pairPosition(mateId: string) {
  return MATE_POS[mateId]
}

export function treeHome(id: string) {
  return POS[id]
}
