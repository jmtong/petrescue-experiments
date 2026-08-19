import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import './where-cats.css'

type Kind = 'intact' | 'sterilised' | 'newcomer'
type Chapter = 'trap' | 'trap-reveal' | 'sterilise' | 'sterilise-reveal' | 'compare'

type Cat = {
  id: string
  home: number
  x: number
  y: number
  kind: Kind
  opacity: number
  place: 'home' | 'care' | 'desex'
}

type Pt = { x: number; y: number }

const YEAR10 = {
  trap: { population: 39, enteringCare: 99 },
  sterilise: { population: 65, enteringCare: 25, rate: '5 cats per 1,000 residents each year' },
} as const

const VIEW = { w: 1280, h: 620 }
const DESEX: Pt = { x: 638, y: 292 }

const HOMES: Pt[] = [
  { x: 92, y: 148 },
  { x: 168, y: 128 },
  { x: 248, y: 152 },
  { x: 328, y: 132 },
  { x: 408, y: 148 },
  { x: 78, y: 248 },
  { x: 158, y: 268 },
  { x: 242, y: 238 },
  { x: 326, y: 262 },
  { x: 412, y: 246 },
  { x: 98, y: 368 },
  { x: 186, y: 388 },
  { x: 274, y: 358 },
  { x: 358, y: 382 },
  { x: 438, y: 364 },
  { x: 148, y: 478 },
  { x: 248, y: 492 },
  { x: 348, y: 478 },
]

const KIT_SPOTS: Pt[] = [
  { x: 198, y: 208 },
  { x: 468, y: 318 },
]

const POUND: Pt[] = [
  { x: 868, y: 168 },
  { x: 922, y: 156 },
  { x: 976, y: 170 },
  { x: 1030, y: 158 },
  { x: 1084, y: 172 },
  { x: 856, y: 226 },
  { x: 910, y: 238 },
  { x: 964, y: 224 },
  { x: 1018, y: 236 },
  { x: 1072, y: 222 },
  { x: 872, y: 292 },
  { x: 926, y: 304 },
  { x: 980, y: 288 },
  { x: 1034, y: 300 },
  { x: 1088, y: 286 },
  { x: 860, y: 358 },
  { x: 914, y: 370 },
  { x: 968, y: 354 },
  { x: 1022, y: 366 },
  { x: 1076, y: 352 },
  { x: 886, y: 424 },
  { x: 948, y: 432 },
  { x: 1010, y: 420 },
  { x: 1072, y: 428 },
]

/** Scripted illustration — not computed from the research model. */
const TRAP_YEARS: { leave: number[]; arrive: number[] }[] = [
  { leave: [], arrive: [] },
  { leave: [0, 4], arrive: [] },
  { leave: [1, 8], arrive: [0] },
  { leave: [2, 11], arrive: [] },
  { leave: [3, 6], arrive: [4] },
  { leave: [5, 13], arrive: [] },
  { leave: [7, 15], arrive: [1] },
  { leave: [9, 16], arrive: [] },
  { leave: [10], arrive: [8] },
  { leave: [12], arrive: [] },
  { leave: [14], arrive: [6] },
]

const STER_YEARS: { desex: number[]; toCare: number[]; kittens: number[] }[] = [
  { desex: [], toCare: [], kittens: [] },
  { desex: [0, 2, 4], toCare: [], kittens: [] },
  { desex: [1, 5, 7], toCare: [], kittens: [0] },
  { desex: [3, 8, 10], toCare: [], kittens: [] },
  { desex: [6, 9, 11], toCare: [], kittens: [1] },
  { desex: [12, 13], toCare: [], kittens: [] },
  { desex: [14, 16], toCare: [15], kittens: [] },
  { desex: [17], toCare: [], kittens: [] },
  { desex: [], toCare: [], kittens: [] },
  { desex: [], toCare: [], kittens: [] },
  { desex: [], toCare: [], kittens: [] },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function seedCats(): Cat[] {
  return HOMES.map((home, i) => ({
    id: `c${i}`,
    home: i,
    x: home.x,
    y: home.y,
    kind: 'intact',
    opacity: 1,
    place: 'home',
  }))
}

function atHome(cats: Cat[], home: number) {
  return cats.find((c) => c.home === home && c.place === 'home' && c.opacity > 0.4)
}

function occupied(cats: Cat[]) {
  return new Set(cats.filter((c) => c.place === 'home' && c.opacity > 0.2).map((c) => c.home))
}

function sendIdsToCare(cats: Cat[], ids: string[]) {
  let slot = cats.filter((c) => c.place === 'care').length
  return cats.map((c) => {
    if (!ids.includes(c.id)) return c
    const dest = POUND[slot % POUND.length]
    slot += 1
    return { ...c, x: dest.x, y: dest.y, place: 'care' as const }
  })
}

function homePoint(home: number) {
  return HOMES[home] ?? KIT_SPOTS[home - 100] ?? DESEX
}

/** Frozen Year-10 illustration from the same scripts as the story. */
function stageTrapYear10(): Cat[] {
  let cats = seedCats()
  for (let y = 1; y <= 10; y += 1) {
    const step = TRAP_YEARS[y]
    if (!step) continue
    const leavers = step.leave
      .map((home) => atHome(cats, home)?.id)
      .filter((id): id is string => Boolean(id))
    cats = sendIdsToCare(cats, leavers)
    for (const home of step.arrive) {
      if (occupied(cats).has(home)) continue
      const pt = HOMES[home]
      cats = [
        ...cats,
        {
          id: `n${y}-${home}`,
          home,
          x: pt.x,
          y: pt.y,
          kind: 'newcomer',
          opacity: 1,
          place: 'home',
        },
      ]
    }
  }
  return cats
}

function stageSteriliseYear10(): Cat[] {
  let cats = seedCats()
  for (let y = 1; y <= 10; y += 1) {
    const step = STER_YEARS[y]
    if (!step) continue
    for (const kit of step.kittens) {
      const pt = KIT_SPOTS[kit]
      cats = [
        ...cats,
        {
          id: `k${y}-${kit}`,
          home: 100 + kit,
          x: pt.x,
          y: pt.y,
          kind: 'newcomer',
          opacity: 1,
          place: 'home',
        },
      ]
    }
    const travellers = step.desex
      .map((home) => atHome(cats, home)?.id)
      .filter((id): id is string => Boolean(id))
    const kittensToDesex =
      y === 5 ? cats.filter((c) => c.id.startsWith('k') && c.place === 'home').map((c) => c.id) : []
    const outbound = [...travellers, ...kittensToDesex]
    cats = cats.map((c) => {
      if (!outbound.includes(c.id)) return c
      const home = homePoint(c.home)
      return { ...c, kind: 'sterilised', x: home.x, y: home.y, place: 'home' }
    })
    const toCare = step.toCare
      .map((home) => atHome(cats, home)?.id)
      .filter((id): id is string => Boolean(id))
    cats = sendIdsToCare(cats, toCare)
  }
  return cats
}

const TRAP_YEAR10_CATS = stageTrapYear10()
const STER_YEAR10_CATS = stageSteriliseYear10()

function CatMark({ kind, small }: { kind: Kind; small?: boolean }) {
  const sterilised = kind === 'sterilised'
  const s = small ? 0.78 : 1
  return (
    <g className={`cat ${kind}`} transform={`scale(${s})`}>
      {sterilised ? (
        <polygon className="ear" points="-7,-2 -12,-12 -6,-12 -2,-5" />
      ) : (
        <polygon className="ear" points="-7,-2 -9,-16 -1,-6" />
      )}
      <polygon className="ear" points="6,-2 9,-16 1,-6" />
      <ellipse className="body" cx="0" cy="4" rx="11" ry="8" />
      <path className="tail" d="M10 6 Q 21 1 17 -9" />
    </g>
  )
}

function Houses() {
  return (
    <g className="houses">
      <g>
        <polygon className="roof" points="118,86 168,48 218,86" />
        <rect className="wall" x="128" y="86" width="80" height="46" />
      </g>
      <g>
        <polygon className="roof" points="268,72 328,28 388,72" />
        <rect className="wall" x="280" y="72" width="96" height="52" />
      </g>
      <g>
        <polygon className="roof" points="58,188 108,154 158,188" />
        <rect className="wall" x="68" y="188" width="80" height="42" />
      </g>
      <g>
        <polygon className="roof" points="318,198 368,162 418,198" />
        <rect className="wall" x="328" y="198" width="80" height="44" />
      </g>
      <g>
        <polygon className="roof" points="168,318 228,278 288,318" />
        <rect className="wall" x="180" y="318" width="96" height="48" />
      </g>
      <g>
        <polygon className="roof" points="78,418 128,384 178,418" />
        <rect className="wall" x="88" y="418" width="80" height="40" />
      </g>
      <g>
        <polygon className="roof" points="298,428 348,392 398,428" />
        <rect className="wall" x="308" y="428" width="80" height="42" />
      </g>
      <circle className="tree" cx="48" cy="108" r="22" />
      <circle className="tree" cx="448" cy="96" r="18" />
      <circle className="tree" cx="52" cy="508" r="20" />
      <circle className="tree" cx="468" cy="518" r="16" />
    </g>
  )
}

function FlowScene({
  cats,
  showDesex,
  flowToCare,
  compact,
  snap,
}: {
  cats: Cat[]
  showDesex: boolean
  flowToCare: boolean
  compact?: boolean
  snap?: boolean
}) {
  const vacant = HOMES.map((_, i) => i).filter((i) => !occupied(cats).has(i))
  return (
    <svg
      className={`where-scene${compact ? ' is-compact' : ''}${snap || compact ? ' is-snap' : ''}`}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : 'Neighbourhood and care'}
    >
      <rect className="paper" width={VIEW.w} height={VIEW.h} />
      <rect className="ground" x="24" y="56" width="500" height="540" rx="18" />
      <rect className="care-ground" x="760" y="56" width="496" height="540" rx="18" />

      <text className="place-title" x="48" y="42">
        The neighbourhood
      </text>
      <text className="place-title" x="784" y="42">
        Pounds, shelters &amp; rescues
      </text>

      <Houses />

      <g className="corridor" opacity={flowToCare ? 1 : 0.22}>
        <path className={`flow-path${flowToCare ? '' : ' is-still'}`} d="M524 300 C 590 300, 700 300, 758 300" />
        <polygon className="flow-arrow" points="746,288 774,300 746,312" />
      </g>

      {showDesex && (
        <g className="desex-stop">
          <rect x="586" y="236" width="104" height="88" rx="10" />
          <path d="M638 262 v36 M620 280 h36" />
          <text x="638" y="348">
            Desexing
          </text>
        </g>
      )}

      <g className="care-building">
        <rect x="820" y="88" width="380" height="470" rx="8" />
        <path d="M820 168 H1200 M820 248 H1200 M820 328 H1200 M820 408 H1200" />
      </g>

      {vacant.map((i) => (
        <ellipse key={`v${i}`} className="vacant" cx={HOMES[i].x} cy={HOMES[i].y + 10} rx="16" ry="8" />
      ))}

      {cats.map((cat) => (
        <g
          key={cat.id}
          className={`cat-layer place-${cat.place}`}
          transform={`translate(${cat.x} ${cat.y})`}
          opacity={cat.opacity}
        >
          <CatMark kind={cat.kind} small={cat.kind === 'newcomer'} />
        </g>
      ))}
    </svg>
  )
}

export default function WhereDidTheCatsGo() {
  const [chapter, setChapter] = useState<Chapter>('trap')
  const [year, setYear] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [cats, setCats] = useState<Cat[]>(seedCats)
  const [snap, setSnap] = useState(false)
  const catsRef = useRef(cats)
  const gen = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const playLock = useRef(false)

  catsRef.current = cats

  const write = (next: Cat[] | ((list: Cat[]) => Cat[])) => {
    setCats((list) => {
      const value = typeof next === 'function' ? next(list) : next
      catsRef.current = value
      return value
    })
  }

  const resetScene = () => {
    gen.current += 1
    playLock.current = false
    setSnap(true)
    setPlaying(false)
    setYear(0)
    write(seedCats())
    requestAnimationFrame(() => setSnap(false))
  }

  const sendToCare = (ids: string[]) => {
    write((list) => {
      let slot = list.filter((c) => c.place === 'care').length
      return list.map((c) => {
        if (!ids.includes(c.id)) return c
        const dest = POUND[slot % POUND.length]
        slot += 1
        return { ...c, x: dest.x, y: dest.y, place: 'care' as const }
      })
    })
  }

  const runTrapYear = async (y: number, token: number) => {
    const step = TRAP_YEARS[y]
    if (!step) return

    const leavers = step.leave
      .map((home) => atHome(catsRef.current, home)?.id)
      .filter((id): id is string => Boolean(id))

    if (leavers.length) {
      sendToCare(leavers)
      await delay(820)
      if (gen.current !== token) return
    }

    for (const home of step.arrive) {
      if (gen.current !== token) return
      if (occupied(catsRef.current).has(home)) continue
      const pt = HOMES[home]
      write((list) => [
        ...list,
        {
          id: `n${y}-${home}`,
          home,
          x: pt.x,
          y: pt.y,
          kind: 'newcomer',
          opacity: 1,
          place: 'home',
        },
      ])
      await delay(120)
    }
  }

  const runSteriliseYear = async (y: number, token: number) => {
    const step = STER_YEARS[y]
    if (!step) return

    for (const kit of step.kittens) {
      const pt = KIT_SPOTS[kit]
      write((list) => [
        ...list,
        {
          id: `k${y}-${kit}`,
          home: 100 + kit,
          x: pt.x,
          y: pt.y,
          kind: 'newcomer',
          opacity: 1,
          place: 'home',
        },
      ])
    }

    const travellers = step.desex
      .map((home) => atHome(catsRef.current, home)?.id)
      .filter((id): id is string => Boolean(id))

    const kittensToDesex =
      y === 5
        ? catsRef.current.filter((c) => c.id.startsWith('k') && c.place === 'home').map((c) => c.id)
        : []
    const outbound = [...travellers, ...kittensToDesex]

    for (let i = 0; i < outbound.length; i += 1) {
      if (gen.current !== token) return
      const id = outbound[i]
      write((list) =>
        list.map((c) =>
          c.id === id
            ? { ...c, x: DESEX.x, y: DESEX.y + (i % 3) * 12 - 12, place: 'desex' as const }
            : c,
        ),
      )
      await delay(90)
    }

    if (outbound.length) {
      await delay(420)
      if (gen.current !== token) return
      write((list) =>
        list.map((c) => {
          if (!outbound.includes(c.id)) return c
          const home = HOMES[c.home] ?? KIT_SPOTS[c.home - 100] ?? DESEX
          return {
            ...c,
            kind: 'sterilised',
            x: home.x,
            y: home.y,
            place: 'home',
          }
        }),
      )
      await delay(620)
      if (gen.current !== token) return
    }

    const toCare = step.toCare
      .map((home) => atHome(catsRef.current, home)?.id)
      .filter((id): id is string => Boolean(id))
    if (toCare.length) {
      sendToCare(toCare)
      await delay(820)
    }
  }

  const play = async () => {
    if (playLock.current) return
    if (chapter !== 'trap' && chapter !== 'sterilise') return
    if (year >= 10) return

    const token = gen.current + 1
    gen.current = token
    playLock.current = true
    setPlaying(true)

    const from = year
    for (let y = from + 1; y <= 10; y += 1) {
      if (gen.current !== token) return
      if (chapter === 'trap') await runTrapYear(y, token)
      else await runSteriliseYear(y, token)
      if (gen.current !== token) return
      setYear(y)
      await delay(180)
    }

    playLock.current = false
    setPlaying(false)
    if (chapter === 'trap') setChapter('trap-reveal')
    if (chapter === 'sterilise') setChapter('sterilise-reveal')
  }

  const goSterilise = () => {
    resetScene()
    setChapter('sterilise')
  }

  const goCompare = () => {
    gen.current += 1
    playLock.current = false
    setPlaying(false)
    setYear(10)
    setChapter('compare')
  }

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const onWheel = (event: WheelEvent) => {
      if (chapter !== 'trap' && chapter !== 'sterilise') return
      if (playLock.current || year >= 10) return
      if (Math.abs(event.deltaY) < 24) return
      event.preventDefault()
      void play()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  })

  const showDesex = chapter === 'sterilise' || chapter === 'sterilise-reveal'
  const showPrompt = chapter === 'trap' || chapter === 'sterilise'
  const atStart = year === 0 && !playing
  const comparing = chapter === 'compare'

  let headline = 'What happens if we trap more cats?'
  if (chapter === 'sterilise') headline = 'What if cats are desexed instead?'
  if (chapter === 'trap-reveal') {
    headline = 'The neighbourhood is much emptier. But almost as many cats are still entering care.'
  }
  if (chapter === 'sterilise-reveal') headline = 'Sterilisation — 5 cats per 1,000 residents each year'
  if (comparing) {
    headline =
      "An emptier street doesn't necessarily mean fewer cats entering pounds and shelters. So where did the cats go?"
  }

  return (
    <Experiment number="01e" title="Where did the cats go">
      <div className={`where-cats${comparing ? ' is-compare' : ''}`} ref={stageRef}>
        <div className="where-bar">
          <p className="where-year">
            <span>Year</span>
            <strong>{year}</strong>
          </p>
          <p className="where-headline">{headline}</p>
          <div className="where-actions">
            {showPrompt && (
              <button type="button" className="play" onClick={() => void play()} disabled={playing || year >= 10}>
                {playing ? 'Playing' : 'Play'}
              </button>
            )}
            {chapter === 'trap-reveal' && (
              <button type="button" className="play is-next" onClick={goSterilise}>
                Continue
              </button>
            )}
            {chapter === 'sterilise-reveal' && (
              <button type="button" className="play is-next" onClick={goCompare}>
                Continue
              </button>
            )}
          </div>
        </div>

        {comparing ? (
          <div className="compare-stack">
            <div className="compare-row">
              <FlowScene cats={TRAP_YEAR10_CATS} showDesex={false} flowToCare compact />
              <dl className="compare-stats">
                <dt>Double trapping</dt>
                <dd>
                  Free-living index {YEAR10.trap.population}
                  <br />
                  Entering-care index {YEAR10.trap.enteringCare}
                </dd>
              </dl>
            </div>
            <div className="compare-row">
              <FlowScene cats={STER_YEAR10_CATS} showDesex flowToCare={false} compact />
              <dl className="compare-stats">
                <dt>Sterilise + return</dt>
                <dd>
                  Free-living index {YEAR10.sterilise.population}
                  <br />
                  Entering-care index {YEAR10.sterilise.enteringCare}
                </dd>
              </dl>
            </div>
          </div>
        ) : (
          <FlowScene cats={cats} showDesex={showDesex} flowToCare={!showDesex} snap={snap} />
        )}

        <div className="where-foot">
          {chapter === 'trap' && atStart && (
            <p className="hint">Play, or scroll, through ten modelled years. Marks are illustrative, not one cat each.</p>
          )}
          {chapter === 'sterilise' && atStart && (
            <p className="hint">Same starting neighbourhood. Open marks come home.</p>
          )}
          {chapter === 'trap-reveal' && (
            <dl className="indices">
              <div>
                <dt>Double trapping</dt>
                <dd>
                  Free-living population index: {YEAR10.trap.population}
                  <br />
                  Entering-care index: {YEAR10.trap.enteringCare}
                </dd>
              </div>
              <p className="baseline">Current practice = 100.</p>
            </dl>
          )}
          {chapter === 'sterilise-reveal' && (
            <dl className="indices">
              <div>
                <dt>Sterilisation — {YEAR10.sterilise.rate}</dt>
                <dd>
                  Free-living population index: {YEAR10.sterilise.population}
                  <br />
                  Entering-care index: {YEAR10.sterilise.enteringCare}
                </dd>
              </div>
              <p className="baseline">Current practice = 100.</p>
            </dl>
          )}
          {chapter === 'compare' && (
            <div className="ending">
              <p>
                With trap + remove, removing the cat is itself an admission into the pound/shelter system.
              </p>
              <p>With sterilise + return, the cat returns to where it was living but can no longer reproduce.</p>
              <p className="baseline">Current practice = 100. Marks are illustrative, not one cat each.</p>
            </div>
          )}
          {(chapter === 'sterilise' || chapter === 'sterilise-reveal' || chapter === 'compare') && (
            <p className="key">Solid mark: intact. Open mark: sterilised and returned.</p>
          )}
        </div>
      </div>
    </Experiment>
  )
}
