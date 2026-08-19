import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import './neighbourhood.css'

type Tool = 'trap' | 'sterilise'
type Kind = 'intact' | 'sterilised' | 'newcomer'
type Phase = 'home' | 'to-pound' | 'pound' | 'to-clinic' | 'from-clinic' | 'arriving'

type Cat = {
  id: string
  plot: number
  kind: Kind
  phase: Phase
  x: number
  y: number
  rot: number
}

type Plot = { id: number; x: number; y: number }

const PLOTS: Plot[] = [
  { id: 0, x: 108, y: 196 },
  { id: 1, x: 186, y: 168 },
  { id: 2, x: 268, y: 198 },
  { id: 3, x: 352, y: 164 },
  { id: 4, x: 438, y: 188 },
  { id: 5, x: 92, y: 286 },
  { id: 6, x: 178, y: 312 },
  { id: 7, x: 262, y: 278 },
  { id: 8, x: 348, y: 304 },
  { id: 9, x: 434, y: 286 },
  { id: 10, x: 118, y: 398 },
  { id: 11, x: 208, y: 424 },
  { id: 12, x: 298, y: 396 },
  { id: 13, x: 388, y: 428 },
  { id: 14, x: 472, y: 392 },
  { id: 15, x: 158, y: 508 },
  { id: 16, x: 262, y: 522 },
  { id: 17, x: 372, y: 512 },
]

const CLINIC = { x: 620, y: 132 }
const POUND_ORIGIN = { x: 708, y: 178 }
const VIEW = { w: 1000, h: 620 }

let nextId = 0
function uid() {
  nextId += 1
  return `c${nextId}`
}

function seedCats(): Cat[] {
  return PLOTS.map((plot, i) => ({
    id: uid(),
    plot: plot.id,
    kind: 'intact' as const,
    phase: 'home' as const,
    x: plot.x,
    y: plot.y,
    rot: (i % 7) * 4 - 12,
  }))
}

function poundSlot(index: number) {
  const col = index % 4
  const row = Math.floor(index / 4)
  return {
    x: POUND_ORIGIN.x + col * 44 + (row % 2) * 10,
    y: POUND_ORIGIN.y + row * 38,
  }
}

function plotById(id: number) {
  return PLOTS.find((p) => p.id === id)!
}

function CatMark({ kind, rot }: { kind: Kind; rot: number }) {
  const sterilised = kind === 'sterilised'
  return (
    <g
      className={`cat ${sterilised ? 'sterilised' : ''} ${kind === 'newcomer' ? 'newcomer' : ''}`}
      transform={`rotate(${rot})`}
    >
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

function TrapDrawing() {
  return (
    <svg className="tool-art" viewBox="0 0 160 130" aria-hidden>
      <ellipse cx="80" cy="110" rx="58" ry="9" className="tool-shadow" />
      <rect x="30" y="40" width="100" height="60" rx="3" className="tool-line" />
      <path d="M30 52 H130 M30 66 H130 M30 80 H130 M30 94 H130" className="tool-wire" />
      <path d="M48 40 V100 M66 40 V100 M84 40 V100 M102 40 V100 M120 40 V100" className="tool-wire" />
      <path d="M30 40 L80 16 L130 40" className="tool-line" />
      <path d="M130 50 C146 46 152 72 136 80" className="tool-line" />
      <circle cx="80" cy="72" r="4.5" className="tool-accent" />
    </svg>
  )
}

function SteriliseDrawing() {
  return (
    <svg className="tool-art" viewBox="0 0 160 130" aria-hidden>
      <ellipse cx="80" cy="112" rx="52" ry="8" className="tool-shadow" />
      <ellipse cx="78" cy="78" rx="44" ry="26" className="tool-line" />
      <path d="M42 72 Q78 44 114 72" className="tool-line" />
      <g transform="translate(78 74)">
        <polygon className="ear-soft" points="-7,-2 -11,-11 -6,-11 -2,-4" />
        <polygon className="ear-soft" points="6,-2 9,-14 1,-5" />
        <ellipse cx="0" cy="6" rx="11" ry="8" className="body-soft" />
      </g>
      <g className="vet-cross" transform="translate(122 36)">
        <circle r="15" />
        <path d="M0 -9 V9 M-9 0 H9" />
      </g>
    </svg>
  )
}

function YearClock({ year }: { year: number }) {
  const angle = ((year % 12) - 3) * 30
  const rad = (angle * Math.PI) / 180
  return (
    <svg className="year-clock" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="50" className="clock-face" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
        const a = ((h - 3) * Math.PI) / 6
        return (
          <line
            key={h}
            x1={60 + Math.cos(a) * 38}
            y1={60 + Math.sin(a) * 38}
            x2={60 + Math.cos(a) * 46}
            y2={60 + Math.sin(a) * 46}
            className="clock-tick"
          />
        )
      })}
      <line
        x1="60"
        y1="60"
        x2={60 + Math.cos(rad) * 28}
        y2={60 + Math.sin(rad) * 28}
        className="clock-hand"
      />
      <circle cx="60" cy="60" r="3.5" className="clock-hub" />
    </svg>
  )
}

function NeighbourhoodScene({
  cats,
  hoverPlot,
  onPlot,
}: {
  cats: Cat[]
  hoverPlot: number | null
  onPlot: (plotId: number) => void
}) {
  const atHome = new Map(
    cats.filter((c) => c.phase === 'home' || c.phase === 'arriving').map((c) => [c.plot, c]),
  )

  return (
    <svg className="scene" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label="A neighbourhood of cats">
      <rect className="paper" width={VIEW.w} height={VIEW.h} />
      <path
        className="ground"
        d="M0 300 C 140 270 250 320 400 292 C 560 262 680 318 1000 288 V 620 H 0 Z"
      />
      <path className="road" d="M -30 430 C 160 400 280 460 460 428 C 640 396 820 450 1030 420" />

      <g className="house" transform="translate(28 150)">
        <path d="M8 86 L18 86 L28 42 L86 86 L96 86 V148 H8 Z" />
        <path className="roof" d="M4 90 L57 28 L110 90" />
        <rect className="door" x="44" y="108" width="22" height="40" rx="2" />
      </g>
      <g className="house" transform="translate(200 118)">
        <path d="M10 78 H108 V132 H10 Z" />
        <path className="roof" d="M2 80 L59 22 L116 80" />
        <rect className="door" x="28" y="96" width="18" height="36" rx="2" />
      </g>
      <g className="house" transform="translate(360 142)">
        <path d="M14 92 H118 V156 H14 Z" />
        <path className="roof" d="M6 96 L66 18 L126 96" />
        <rect className="door" x="34" y="112" width="22" height="44" rx="2" />
      </g>
      <g className="house" transform="translate(40 430)">
        <path d="M10 70 H96 V128 H10 Z" />
        <path className="roof" d="M4 72 L53 22 L102 72" />
        <rect className="door" x="40" y="88" width="18" height="40" rx="2" />
      </g>
      <g className="house" transform="translate(300 448)">
        <path d="M8 64 H100 V120 H8 Z" />
        <path className="roof" d="M2 66 L54 16 L106 66" />
        <rect className="door" x="22" y="82" width="16" height="38" rx="2" />
      </g>

      <g className="tree" transform="translate(150 250)">
        <rect className="trunk" x="-5" y="36" width="10" height="48" rx="2" />
        <ellipse cx="0" cy="22" rx="28" ry="34" />
      </g>
      <g className="tree" transform="translate(500 250)">
        <rect className="trunk" x="-6" y="40" width="12" height="52" rx="2" />
        <ellipse cx="0" cy="24" rx="32" ry="38" />
      </g>
      <g className="tree" transform="translate(520 470)">
        <rect className="trunk" x="-5" y="28" width="10" height="40" rx="2" />
        <ellipse cx="0" cy="16" rx="24" ry="28" />
      </g>

      <g className="clinic">
        <circle cx={CLINIC.x} cy={CLINIC.y} r="34" />
        <path d={`M${CLINIC.x} ${CLINIC.y - 13} V${CLINIC.y + 13} M${CLINIC.x - 13} ${CLINIC.y} H${CLINIC.x + 13}`} />
        <text x={CLINIC.x} y={CLINIC.y + 52} textAnchor="middle">
          Desexing
        </text>
      </g>

      <g className="pound">
        <rect x="668" y="92" width="292" height="268" rx="6" />
        <path d="M668 118 H960 M690 92 V360 M728 92 V360 M766 92 V360 M804 92 V360 M842 92 V360 M880 92 V360 M918 92 V360" />
        <text x="814" y="78" textAnchor="middle">
          Pounds, shelters &amp; rescues
        </text>
      </g>

      {PLOTS.map((plot) => {
        const home = atHome.get(plot.id)
        const vacant = !home
        return (
          <g
            key={plot.id}
            data-plot={plot.id}
            className={`plot${hoverPlot === plot.id ? ' is-hot' : ''}${vacant ? ' is-vacant' : ''}`}
            onPointerUp={() => onPlot(plot.id)}
          >
            <ellipse cx={plot.x} cy={plot.y + 12} rx="30" ry="17" />
            <circle cx={plot.x} cy={plot.y} r="28" />
          </g>
        )
      })}

      {cats.map((cat) => (
        <g
          key={cat.id}
          className={`cat-layer phase-${cat.phase}`}
          style={{ transform: `translate(${cat.x}px, ${cat.y}px)` }}
        >
          <CatMark kind={cat.kind} rot={cat.rot} />
        </g>
      ))}
    </svg>
  )
}

export default function ManageTheNeighbourhood() {
  const [cats, setCats] = useState<Cat[]>(seedCats)
  const [held, setHeld] = useState<Tool | null>(null)
  const [ptr, setPtr] = useState({ x: 0, y: 0 })
  const [hoverPlot, setHoverPlot] = useState<number | null>(null)
  const [year, setYear] = useState(0)
  const [busy, setBusy] = useState(false)
  const [actions, setActions] = useState(0)
  const [showCta, setShowCta] = useState(false)
  const [showModel, setShowModel] = useState(false)

  const heldRef = useRef<Tool | null>(null)
  const busyRef = useRef(false)
  const catsRef = useRef(cats)
  const timers = useRef<number[]>([])

  heldRef.current = held
  busyRef.current = busy
  catsRef.current = cats

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  useEffect(() => {
    if (actions >= 3) setShowCta(true)
  }, [actions])

  useEffect(() => {
    if (!held) {
      setHoverPlot(null)
      return
    }

    const onMove = (e: PointerEvent) => {
      setPtr({ x: e.clientX, y: e.clientY })
      setHoverPlot(plotFromPoint(e.clientX, e.clientY))
    }

    const onUp = (e: PointerEvent) => {
      const plot = plotFromPoint(e.clientX, e.clientY)
      if (plot != null) {
        applyTool(heldRef.current, plot)
        return
      }
      const onShelf = e.target instanceof Element && e.target.closest('.tool, .year-tool')
      if (!onShelf) {
        heldRef.current = null
        setHeld(null)
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [held])

  function later(ms: number, fn: () => void) {
    const t = window.setTimeout(fn, ms)
    timers.current.push(t)
  }

  function applyTool(tool: Tool | null, plotId: number) {
    if (!tool || busyRef.current) return
    const cat = catsRef.current.find((c) => c.plot === plotId && c.phase === 'home')
    if (!cat) return
    if (tool === 'sterilise' && cat.kind === 'sterilised') {
      heldRef.current = null
      setHeld(null)
      return
    }

    busyRef.current = true
    setBusy(true)
    heldRef.current = null
    setHeld(null)
    setActions((n) => n + 1)

    if (tool === 'trap') {
      setCats((prev) => {
        const dest = poundSlot(prev.filter((c) => c.phase === 'pound' || c.phase === 'to-pound').length)
        return prev.map((c) => (c.id === cat.id ? { ...c, phase: 'to-pound', x: dest.x, y: dest.y } : c))
      })
      later(900, () => {
        setCats((prev) => prev.map((c) => (c.id === cat.id ? { ...c, phase: 'pound' } : c)))
        busyRef.current = false
        setBusy(false)
      })
      return
    }

    setCats((prev) => prev.map((c) => (c.id === cat.id ? { ...c, phase: 'to-clinic', x: CLINIC.x, y: CLINIC.y } : c)))
    later(720, () => {
      const home = plotById(plotId)
      setCats((prev) =>
        prev.map((c) =>
          c.id === cat.id
            ? { ...c, kind: 'sterilised', phase: 'from-clinic', x: home.x, y: home.y }
            : c,
        ),
      )
      later(820, () => {
        setCats((prev) => prev.map((c) => (c.id === cat.id ? { ...c, phase: 'home' } : c)))
        busyRef.current = false
        setBusy(false)
      })
    })
  }

  function advanceYear() {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setYear((y) => y + 1)
    setActions((n) => n + 1)

    const occupied = new Set(catsRef.current.filter((c) => c.phase === 'home').map((c) => c.plot))
    const vacant = PLOTS.filter((p) => !occupied.has(p.id))
    const preferred = vacant.filter((_, i) => (year + i) % 2 === 0)
    const take = (preferred.length ? preferred : vacant).slice(
      0,
      Math.max(1, Math.ceil(vacant.length * 0.55)),
    )

    const newcomers: Cat[] = take.map((plot, i) => ({
      id: uid(),
      plot: plot.id,
      kind: 'newcomer',
      phase: 'arriving',
      x: plot.x + (i % 2 === 0 ? -90 : 80),
      y: plot.y + 110,
      rot: 8 - i * 3,
    }))

    if (!newcomers.length) {
      later(350, () => {
        busyRef.current = false
        setBusy(false)
      })
      return
    }

    setCats((prev) => [...prev, ...newcomers])
    later(50, () => {
      setCats((prev) =>
        prev.map((c) => {
          const n = newcomers.find((x) => x.id === c.id)
          if (!n) return c
          const home = plotById(n.plot)
          return { ...c, x: home.x, y: home.y }
        }),
      )
    })
    later(920, () => {
      setCats((prev) => prev.map((c) => (c.phase === 'arriving' ? { ...c, phase: 'home' } : c)))
      busyRef.current = false
      setBusy(false)
    })
  }

  function pickTool(tool: Tool, x: number, y: number) {
    if (busyRef.current || showModel) return
    const next = heldRef.current === tool ? null : tool
    heldRef.current = next
    setHeld(next)
    setPtr({ x, y })
  }

  return (
    <Experiment number="01d" title="Manage the neighbourhood">
      <div className={`manage-hood${held ? ' is-holding' : ''}`}>
        <p className="concept-label">Concept prototype — illustrative behaviour</p>
        <h2 className="hood-headline">How would you manage this population?</h2>
        <p className="hood-lede">
          Pick up a tool. Drop it on a cat. A sketch of cause and effect — not a calculation.
        </p>

        {!showModel && (
          <>
            <NeighbourhoodScene
              cats={cats}
              hoverPlot={hoverPlot}
              onPlot={(id) => applyTool(heldRef.current, id)}
            />

            <div className="bench">
              <button
                type="button"
                className={`tool${held === 'trap' ? ' is-held' : ''}`}
                aria-pressed={held === 'trap'}
                aria-label="Trap and take away"
                onPointerDown={(e) => {
                  e.preventDefault()
                  pickTool('trap', e.clientX, e.clientY)
                }}
              >
                <TrapDrawing />
                <span>Trap &amp; take away</span>
              </button>

              <button
                type="button"
                className={`tool${held === 'sterilise' ? ' is-held' : ''}`}
                aria-pressed={held === 'sterilise'}
                aria-label="Desex and return"
                onPointerDown={(e) => {
                  e.preventDefault()
                  pickTool('sterilise', e.clientX, e.clientY)
                }}
              >
                <SteriliseDrawing />
                <span>Desex &amp; return</span>
              </button>

              <button
                type="button"
                className="year-tool"
                onClick={advanceYear}
                disabled={busy}
                aria-label="Advance one year"
              >
                <YearClock year={year} />
                <span>
                  Advance one year
                  <em>Year {year}</em>
                </span>
              </button>
            </div>

            <p className="hood-hint">
              {held
                ? held === 'trap'
                  ? 'Drop the cage on a cat. It leaves the street and goes into care.'
                  : 'Drop this on a cat. It leaves for desexing, then comes home to the same patch.'
                : 'Dotted rings are vacant territories. Advance a year and some of them are taken by new intact cats.'}
            </p>
          </>
        )}

        {showCta && !showModel && (
          <button type="button" className="research-cta" onClick={() => setShowModel(true)}>
            See what the research model predicts after 10 years →
          </button>
        )}

        {showModel && (
          <div className="model-reveal">
            <p className="model-kicker">A research model — not this neighbourhood toy</p>
            <p className="model-note">
              Indexed so current practice = 100. These figures are supplied. They are not computed from
              the clicks above.
            </p>
            <blockquote>
              <p className="model-title">Double trapping</p>
              <p className="model-stat">
                <strong>39</strong> population
              </p>
              <p className="model-stat">
                <strong>99</strong> intake
              </p>
            </blockquote>
            <blockquote>
              <p className="model-title">Sterilisation 5 per 1,000 residents/year</p>
              <p className="model-stat">
                <strong>65</strong> population
              </p>
              <p className="model-stat">
                <strong>25</strong> intake
              </p>
            </blockquote>
            <button type="button" className="back-to-toy" onClick={() => setShowModel(false)}>
              ← Back to the neighbourhood
            </button>
          </div>
        )}

        {held && (
          <div className="held-ghost" style={{ left: ptr.x, top: ptr.y }} aria-hidden>
            {held === 'trap' ? <TrapDrawing /> : <SteriliseDrawing />}
          </div>
        )}
      </div>
    </Experiment>
  )
}

function plotFromPoint(x: number, y: number): number | null {
  for (const el of document.elementsFromPoint(x, y)) {
    const node = el.closest('[data-plot]')
    const id = node?.getAttribute('data-plot')
    if (id) return Number(id)
  }
  return null
}
