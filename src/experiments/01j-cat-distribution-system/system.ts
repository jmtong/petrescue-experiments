/** Illustrative metaphor timing — not the research population model. */

export type Mode = 'none' | 'trap' | 'desex'

export const PLAY_MS = 720

const PAIR = { ax: 40, bx: 54, y: 24, plusX: 47 }
const NEST_Y = 34
const NEST_XS = [40, 47, 54, 33, 61] as const
const SETTLE_Y = 64
export const BOUNDARY_Y = 50

export type Phase = 'pair' | 'nest' | 'community' | 'trap' | 'desex'

type Beat = {
  phase: Phase
  /** How many litters have been born by this beat (inclusive). */
  litters: number
  /** How many trap batches have fired. */
  traps: number
  desexed: boolean
  ghost: boolean
}

/**
 * One beat = one readable change.
 * Next / Play advance beats, not interpolated ticks.
 */
const BEATS: Record<Mode, Beat[]> = {
  none: [
    { phase: 'pair', litters: 0, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 1, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 1, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 2, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 2, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 3, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 3, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 4, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 4, traps: 0, desexed: false, ghost: false },
  ],
  trap: [
    { phase: 'pair', litters: 0, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 1, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 1, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 2, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 2, traps: 0, desexed: false, ghost: false },
    { phase: 'trap', litters: 2, traps: 1, desexed: false, ghost: false },
    { phase: 'nest', litters: 3, traps: 1, desexed: false, ghost: false },
    { phase: 'community', litters: 3, traps: 1, desexed: false, ghost: false },
    { phase: 'trap', litters: 3, traps: 2, desexed: false, ghost: false },
    { phase: 'nest', litters: 4, traps: 2, desexed: false, ghost: false },
    { phase: 'community', litters: 4, traps: 2, desexed: false, ghost: false },
  ],
  desex: [
    { phase: 'pair', litters: 0, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 1, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 1, traps: 0, desexed: false, ghost: false },
    { phase: 'nest', litters: 2, traps: 0, desexed: false, ghost: false },
    { phase: 'community', litters: 2, traps: 0, desexed: false, ghost: false },
    { phase: 'desex', litters: 2, traps: 0, desexed: true, ghost: true },
    { phase: 'desex', litters: 2, traps: 0, desexed: true, ghost: false },
  ],
}

const LITTER_SIZE = [3, 3, 4, 4]

function communityHome(slot: number) {
  const cols = 6
  const col = slot % cols
  const row = Math.floor(slot / cols)
  return {
    x: 18 + col * 12,
    y: SETTLE_Y + row * 9,
  }
}

export type SceneCat = {
  id: string
  x: number
  y: number
  born: boolean
  nesting: boolean
  travelling: boolean
  inCommunity: boolean
  kitten: boolean
  desexed: boolean
  exiting: boolean
  gone: boolean
  focus: boolean
}

export type GhostLitter = { id: string; x: number; y: number }

export type Scene = {
  cats: SceneCat[]
  plusX: number
  plusY: number
  trapCue: boolean
  desexed: boolean
  ghosts: GhostLitter[]
  done: boolean
}

export function maxBeat(mode: Mode) {
  return BEATS[mode].length - 1
}

export function simulate(beat: number, mode: Mode): Scene {
  const steps = BEATS[mode]
  const i = Math.max(0, Math.min(beat, steps.length - 1))
  const now = steps[i]!
  const done = beat >= steps.length - 1

  const cats: SceneCat[] = [
    {
      id: 'p0',
      x: PAIR.ax,
      y: PAIR.y,
      born: true,
      nesting: false,
      travelling: false,
      inCommunity: false,
      kitten: false,
      desexed: now.desexed,
      exiting: false,
      gone: false,
      focus: true,
    },
    {
      id: 'p1',
      x: PAIR.bx,
      y: PAIR.y,
      born: true,
      nesting: false,
      travelling: false,
      inCommunity: false,
      kitten: false,
      desexed: now.desexed,
      exiting: false,
      gone: false,
      focus: true,
    },
  ]

  let slot = 0
  const removeCount = now.traps * 3

  for (let litter = 1; litter <= now.litters; litter++) {
    const count = LITTER_SIZE[litter - 1] ?? 3
    const isCurrent = litter === now.litters && now.phase === 'nest'

    for (let k = 0; k < count; k++) {
      const nestX = NEST_XS[k] ?? NEST_XS[k % 3]!
      const home = communityHome(slot)
      const thisSlot = slot
      slot += 1

      const gone = thisSlot < removeCount
      const exiting = gone && now.phase === 'trap' && thisSlot >= (now.traps - 1) * 3

      let x = home.x
      let y = home.y
      let nesting = false
      let travelling = false
      let inCommunity = true
      let kitten = false

      if (isCurrent) {
        x = nestX
        y = NEST_Y
        nesting = true
        travelling = false
        inCommunity = false
        kitten = true
      }

      if (gone && !exiting) {
        x = home.x + 55
        y = home.y
      }
      if (exiting) {
        x = home.x + 55
        y = home.y
      }

      cats.push({
        id: `c${litter}-${k}`,
        x,
        y,
        born: true,
        nesting,
        travelling,
        inCommunity: inCommunity && !gone,
        kitten,
        desexed: false,
        exiting,
        gone: gone && !exiting,
        focus: nesting,
      })
    }
  }

  const ghosts: GhostLitter[] = []
  if (now.ghost) {
    for (let g = 0; g < 3; g++) {
      ghosts.push({ id: `g${g}`, x: NEST_XS[g]!, y: NEST_Y })
    }
  }

  return {
    cats,
    plusX: PAIR.plusX,
    plusY: PAIR.y,
    trapCue: now.phase === 'trap',
    desexed: now.desexed,
    ghosts,
    done,
  }
}
