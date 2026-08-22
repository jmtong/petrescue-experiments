import { useEffect, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import {
  MAX_TICK,
  TICK_MS,
  TRAP_TICKS,
  VIEW,
  YEAR_LABELS,
  simulate,
  statusLine,
  yearFromTick,
  type Mode,
} from './neighbourhood.ts'
import './filling.css'

function CatMark({
  desexed,
  kitten,
  immigrant,
}: {
  desexed?: boolean
  kitten?: boolean
  immigrant?: boolean
}) {
  return (
    <g
      className={`fn-face ${desexed ? 'is-desexed' : ''} ${kitten ? 'is-kitten' : ''} ${immigrant ? 'is-immigrant' : ''}`}
    >
      {desexed ? (
        <polygon className="ear" points="-7,-2 -12,-12 -6,-12 -2,-5" />
      ) : (
        <polygon className="ear" points="-7,-2 -9,-16 -1,-6" />
      )}
      <polygon className="ear" points="6,-2 9,-16 1,-6" />
      <ellipse className="body" cx="0" cy="4" rx="11" ry="8" />
      <path className="tail" d="M10 6 Q 21 1 17 -9" />
      {desexed ? <ellipse className="fn-collar" cx="0" cy="7.5" rx="7" ry="2.8" /> : null}
    </g>
  )
}

function NeighbourhoodBackdrop() {
  return (
    <g className="fn-world" aria-hidden>
      <rect className="fn-paper" width={VIEW.w} height={VIEW.h} />

      {/* yards / ground patches */}
      <ellipse className="fn-yard" cx="170" cy="175" rx="130" ry="95" />
      <ellipse className="fn-yard" cx="115" cy="360" rx="95" ry="110" />
      <ellipse className="fn-yard fn-yard-soft" cx="270" cy="510" rx="120" ry="70" />
      <ellipse className="fn-park" cx="740" cy="275" rx="145" ry="115" />
      <ellipse className="fn-park-soft" cx="780" cy="300" rx="60" ry="40" />

      {/* laneway */}
      <path
        className="fn-lane"
        d="M 380 40 C 400 180 410 280 395 400 C 380 520 360 600 340 640"
      />

      {/* houses — crude top-down blocks */}
      <g className="fn-house" transform="translate(70 70)">
        <rect x="0" y="18" width="78" height="62" rx="2" />
        <path className="roof" d="M-6 22 L39 -8 L84 22" />
        <rect className="door" x="30" y="46" width="16" height="24" rx="1" />
      </g>
      <g className="fn-house" transform="translate(200 55)">
        <rect x="0" y="20" width="90" height="70" rx="2" />
        <path className="roof" d="M-8 24 L45 -12 L98 24" />
        <rect className="door" x="18" y="52" width="14" height="26" rx="1" />
      </g>
      <g className="fn-house" transform="translate(40 280)">
        <rect x="0" y="16" width="70" height="58" rx="2" />
        <path className="roof" d="M-6 18 L35 -10 L76 18" />
        <rect className="door" x="26" y="40" width="14" height="22" rx="1" />
      </g>
      <g className="fn-house" transform="translate(200 450)">
        <rect x="0" y="14" width="82" height="56" rx="2" />
        <path className="roof" d="M-6 16 L41 -14 L88 16" />
        <rect className="door" x="34" y="36" width="14" height="24" rx="1" />
      </g>
      <g className="fn-house" transform="translate(880 70)">
        <rect x="0" y="18" width="72" height="58" rx="2" />
        <path className="roof" d="M-6 20 L36 -10 L78 20" />
        <rect className="door" x="28" y="42" width="14" height="22" rx="1" />
      </g>

      {/* sheds / bins / hiding spots */}
      <g className="fn-shed" transform="translate(480 450)">
        <rect x="0" y="0" width="44" height="34" rx="2" />
        <rect className="roof-flat" x="-4" y="-6" width="52" height="10" rx="1" />
      </g>
      <g className="fn-shed" transform="translate(560 470)">
        <rect x="0" y="0" width="36" height="28" rx="2" />
        <rect className="roof-flat" x="-3" y="-5" width="42" height="8" rx="1" />
      </g>
      <g className="fn-bin" transform="translate(510 520)">
        <rect x="0" y="0" width="16" height="20" rx="2" />
        <rect x="22" y="2" width="14" height="18" rx="2" />
      </g>
      <g className="fn-bin" transform="translate(150 240)">
        <rect x="0" y="0" width="14" height="18" rx="2" />
      </g>

      {/* a few trees in the park */}
      <circle className="fn-tree" cx="690" cy="220" r="22" />
      <circle className="fn-tree" cx="790" cy="240" r="18" />
      <circle className="fn-tree" cx="730" cy="320" r="16" />
      <circle className="fn-tree" cx="120" cy="500" r="14" />
    </g>
  )
}

export default function FillingTheNeighbourhood() {
  const [mode, setMode] = useState<Mode>('none')
  const [tick, setTick] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [snap, setSnap] = useState(false)

  const scene = simulate(tick, mode)
  const year = yearFromTick(tick)
  const status = statusLine(mode, tick, scene.trapPulse, scene.desexPulse)
  const showTrappedCue = mode === 'trap' && scene.removed.length > 0

  useEffect(() => {
    if (!playing) return
    if (tick >= MAX_TICK) {
      setPlaying(false)
      return
    }
    const hold =
      tick === 0
        ? TICK_MS + 700
        : (TRAP_TICKS as readonly number[]).includes(tick) && mode === 'trap'
          ? TICK_MS + 550
          : (tick === 5 || tick === 7) && mode === 'desex'
            ? TICK_MS + 450
            : TICK_MS
    const id = window.setTimeout(() => setTick((value) => value + 1), hold)
    return () => window.clearTimeout(id)
  }, [playing, tick, mode])

  function restart(nextMode = mode) {
    setMode(nextMode)
    setSnap(true)
    setTick(0)
    setPlaying(true)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setSnap(false))
    })
  }

  function togglePlay() {
    if (tick >= MAX_TICK && !playing) {
      restart()
      return
    }
    setPlaying((value) => !value)
  }

  const modes: { id: Mode; label: string }[] = [
    { id: 'none', label: 'No intervention' },
    { id: 'trap', label: 'Trap / remove' },
    { id: 'desex', label: 'Targeted desexing' },
  ]

  return (
    <Experiment number="01i" title="Filling the neighbourhood">
      <div className={`filling-hood ${snap ? 'is-snap' : ''} is-year-${year}`}>
        <p className="fn-note">
          Cats occupy the neighbourhood
          <span>Illustrative timing and numbers — not the research model.</span>
        </p>

        <div className="fn-stage">
          <svg
            className="fn-svg"
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label="Neighbourhood filling with community cats over four years"
          >
            <NeighbourhoodBackdrop />

            <g className="fn-years">
              {YEAR_LABELS.map((label, i) => (
                <text
                  key={label}
                  className={`fn-year ${year >= i ? 'is-on' : ''}`}
                  x="28"
                  y={120 + i * 18}
                >
                  {label}
                </text>
              ))}
            </g>

            {/* Extremely secondary trap cue — not a shelter diagram */}
            <g className={`fn-trapped-cue ${showTrappedCue ? 'is-on' : ''}`}>
              <text x="980" y="36" textAnchor="end">
                Trapped
              </text>
              <text className="fn-trapped-sub" x="980" y="52" textAnchor="end">
                {scene.removed.length} removed
              </text>
            </g>

            {scene.cats.map((cat) => {
              const shown = cat.living
              const leaving = cat.removed
              return (
                <g
                  key={cat.id}
                  className={`fn-cat ${shown ? 'is-in' : ''} ${leaving ? 'is-out' : ''} ${cat.desexed ? 'is-desexed' : ''}`}
                  transform={`translate(${cat.x} ${cat.y}) rotate(${cat.rot}) scale(${shown || leaving ? cat.scale : 0.4})`}
                >
                  <CatMark desexed={cat.desexed} kitten={cat.kitten} immigrant={cat.immigrant} />
                </g>
              )
            })}
          </svg>
        </div>

        <p className={`fn-status ${status ? 'is-on' : ''}`}>{status}</p>

        <div className="fn-controls">
          <div className="fn-modes">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={mode === item.id ? 'is-on' : undefined}
                aria-pressed={mode === item.id}
                onClick={() => restart(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="fn-transport">
            <button type="button" onClick={togglePlay}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={() => restart()}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </Experiment>
  )
}
