/**
 * Illustrative sequence only — not the research population model.
 * Every year, count and position below is hand-authored for legibility.
 */

export type Future = 'noIntervention' | 'trapRemove' | 'targetedDesexing'

export type CatDef = {
  id: string
  x: number
  y: number
  /** Index into the look table in CatMark. */
  look: number
  parentId: string | null
  bornYear: number
  matureYear: number
  progenitor?: boolean
  /** Intact cat moving into vacated territory. See SHOW_ILLUSTRATIVE_ARRIVALS. */
  arrival?: boolean
}

export const VIEW = { w: 760, h: 624 }
export const YEARS = [0, 2, 4] as const

export const HOME = { x: 250, y: 245 }
export const CLINIC = { x: 632, y: 116 }
export const GATE = { x: 356, y: 408 }
export const CARE = { x: 330, y: 452, w: 300, h: 130 }

export const CARE_SLOTS = [
  { x: 392, y: 496 },
  { x: 480, y: 496 },
  { x: 568, y: 496 },
  { x: 392, y: 546 },
  { x: 480, y: 546 },
  { x: 568, y: 546 },
]

/**
 * Placeholder only. Intact cats moving into territory vacated by removal is a
 * real mechanism in the briefing, but neither the magnitude nor the timing
 * used here is research-backed. Set to false to remove it entirely.
 */
export const SHOW_ILLUSTRATIVE_ARRIVALS = true

const START: CatDef[] = [
  { id: 'mae', x: 250, y: 245, look: 0, parentId: null, bornYear: -3, matureYear: -2, progenitor: true },
  { id: 'willow', x: 196, y: 222, look: 1, parentId: 'mae', bornYear: -1, matureYear: -0.2 },
  { id: 'soot', x: 306, y: 218, look: 2, parentId: 'mae', bornYear: -1, matureYear: -0.2 },
  { id: 'pip', x: 248, y: 300, look: 3, parentId: 'mae', bornYear: -1, matureYear: -0.2 },
  { id: 'ash', x: 96, y: 232, look: 4, parentId: null, bornYear: -2, matureYear: -1.2 },
  { id: 'mallow', x: 452, y: 214, look: 5, parentId: null, bornYear: -2, matureYear: -1.2 },
  { id: 'binx', x: 150, y: 368, look: 6, parentId: null, bornYear: -2, matureYear: -1.2 },
  { id: 'moss', x: 492, y: 354, look: 7, parentId: null, bornYear: -2, matureYear: -1.2 },
]

/** The three offspring that appear during the opening story beats. */
export const FAMILY_IDS = ['willow', 'soot', 'pip'] as const

function born(
  id: string,
  x: number,
  y: number,
  look: number,
  parentId: string,
  bornYear: number,
  arrival = false,
): CatDef {
  return { id, x, y, look, parentId, bornYear, matureYear: bornYear + 0.8, arrival }
}

const NO_INTERVENTION_BIRTHS: CatDef[] = [
  born('ni1', 206, 272, 8, 'mae', 1.1),
  born('ni2', 298, 268, 9, 'mae', 1.2),
  born('ni3', 64, 196, 10, 'ash', 1.3),
  born('ni4', 498, 192, 11, 'mallow', 1.5),
  born('ni5', 162, 252, 2, 'willow', 2.1),
  born('ni6', 346, 244, 3, 'soot', 2.3),
  born('ni7', 208, 336, 4, 'pip', 2.5),
  born('ni8', 180, 148, 5, 'willow', 2.9),
  born('ni9', 398, 206, 6, 'mallow', 3.1),
  born('ni10', 66, 286, 7, 'ash', 3.3),
  born('ni11', 256, 352, 8, 'pip', 3.4),
  born('ni12', 416, 318, 9, 'moss', 3.5),
  born('ni13', 352, 168, 10, 'soot', 3.6),
]

const TRAP_REMOVE_BIRTHS: CatDef[] = [
  born('tr1', 206, 272, 8, 'willow', 1.2),
  born('tr2', 498, 192, 11, 'mallow', 2.6),
  born('tr3', 256, 352, 9, 'moss', 3.6),
]

/** Intact newcomers taking vacated spots. Illustrative — see the flag above. */
const TRAP_REMOVE_ARRIVALS: CatDef[] = [
  born('ar1', 250, 245, 10, 'elsewhere', 2.2, true),
  born('ar2', 96, 232, 3, 'elsewhere', 3.6, true),
]

/** Year each cat is trapped and removed from the neighbourhood. */
const REMOVED_AT: Record<string, number> = {
  mae: 0.9,
  ash: 1.7,
  binx: 2.4,
  mallow: 3.2,
  soot: 3.5,
}

const TARGETED_BIRTHS: CatDef[] = [
  born('td1', 206, 272, 8, 'willow', 1.1),
  born('td2', 498, 192, 11, 'mallow', 2.2),
]

/** Year each cat is desexed and returned to the same spot. */
const DESEXED_AT: Record<string, number> = {
  mae: 0.9,
  willow: 1.3,
  soot: 1.7,
  ash: 2.1,
  mallow: 2.5,
  pip: 2.9,
  binx: 3.3,
  moss: 3.7,
  td1: 3.9,
}

type FutureDef = {
  label: string
  roster: CatDef[]
  removedAt: Record<string, number>
  desexedAt: Record<string, number>
}

export const illustrativePopulation: Record<Future, FutureDef> = {
  noIntervention: {
    label: 'No intervention',
    roster: START.concat(NO_INTERVENTION_BIRTHS),
    removedAt: {},
    desexedAt: {},
  },
  trapRemove: {
    label: 'Trap + remove',
    roster: START.concat(
      TRAP_REMOVE_BIRTHS,
      SHOW_ILLUSTRATIVE_ARRIVALS ? TRAP_REMOVE_ARRIVALS : [],
    ),
    removedAt: REMOVED_AT,
    desexedAt: {},
  },
  targetedDesexing: {
    label: 'Targeted desex + return',
    roster: START.concat(TARGETED_BIRTHS),
    removedAt: {},
    desexedAt: DESEXED_AT,
  },
}

export const startingCats = START

export type PlacedCat = {
  id: string
  x: number
  y: number
  look: number
  opacity: number
  kitten: boolean
  desexed: boolean
  place: 'home' | 'care'
  progenitor: boolean
  arrival: boolean
}

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

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export type Pt = { x: number; y: number }

export function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}

/** Two-leg journey so cats leave through the gate rather than across the roofs. */
export function travel(t: number, from: Pt, via: Pt, to: Pt): Pt {
  const first = remap(t, 0, 0.55)
  const second = remap(t, 0.55, 1)
  if (second > 0) return lerpPt(via, to, second)
  return lerpPt(from, via, first)
}

function slotOrder(removedAt: Record<string, number>) {
  return Object.entries(removedAt)
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => id)
}

export function catsAtYear(future: Future, year: number): PlacedCat[] {
  const def = illustrativePopulation[future]
  const order = slotOrder(def.removedAt)

  return def.roster.flatMap((cat) => {
    if (year + 0.0001 < cat.bornYear) return []

    const removedYear = def.removedAt[cat.id]
    const leaving = removedYear === undefined ? 0 : clamp((year - removedYear) / 0.45)
    const slot = CARE_SLOTS[order.indexOf(cat.id) % CARE_SLOTS.length]
    const pos =
      leaving > 0 ? travel(leaving, { x: cat.x, y: cat.y }, GATE, slot) : { x: cat.x, y: cat.y }

    const desexedYear = def.desexedAt[cat.id]

    return [
      {
        id: cat.id,
        x: pos.x,
        y: pos.y,
        look: cat.look,
        opacity: clamp((year - cat.bornYear) / 0.3),
        kitten: year < cat.matureYear,
        desexed: desexedYear !== undefined && year >= desexedYear,
        place: leaving >= 1 ? ('care' as const) : ('home' as const),
        progenitor: cat.progenitor === true,
        arrival: cat.arrival === true,
      },
    ]
  })
}

export function countAt(future: Future, year: number) {
  const cats = catsAtYear(future, year).filter((c) => c.opacity > 0.5)
  return {
    home: cats.filter((c) => c.place === 'home').length,
    care: cats.filter((c) => c.place === 'care').length,
    desexed: cats.filter((c) => c.place === 'home' && c.desexed).length,
  }
}
