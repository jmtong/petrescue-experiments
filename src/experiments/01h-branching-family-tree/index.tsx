import { useEffect, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import {
  INTERVENTION_TICK,
  MAX_TICK,
  RING,
  TICK_MS,
  VIEW,
  YEAR_LABELS,
  branchFromPair,
  capStub,
  pairBridge,
  pairPosition,
  simulate,
  treeHome,
  type Mode,
} from './tree.ts'
import './family-tree.css'

function CatFace({ desexed, secondary }: { desexed?: boolean; secondary?: boolean }) {
  return (
    <g className={`ft-face ${secondary ? 'is-secondary' : ''}`}>
      {desexed ? (
        <polygon className="ear" points="-6.2,-4 -10.5,-13 -5.2,-12 -1.8,-6" />
      ) : (
        <polygon className="ear" points="-6.2,-4 -8,-14 -1.2,-6.5" />
      )}
      <polygon className="ear" points="6.2,-4 8,-14 1.2,-6.5" />
      <ellipse className="body" cx="0" cy="2.5" rx="9.5" ry="7.2" />
      <path className="tail" d="M8.5 5 Q 16 2 14 -6" />
      {desexed ? <ellipse className="ft-collar" cx="0" cy="5.5" rx="6.2" ry="2.6" /> : null}
    </g>
  )
}

function CatCard({
  year,
  desexed,
  secondary,
  label,
}: {
  year: number
  desexed?: boolean
  secondary?: boolean
  label?: string
}) {
  const ring = RING[Math.min(year, RING.length - 1)]
  return (
    <g className={`${desexed ? 'is-desexed' : ''} ${secondary ? 'is-mate' : ''}`}>
      <rect className="ft-card" x="-20" y="-24" width="40" height="48" rx="9" />
      <circle className="ft-avatar" cx="0" cy="-3" r="13.5" />
      <circle className="ft-ring" cx="0" cy="-3" r="13.5" style={{ stroke: ring }} />
      <g transform="translate(0 -3)">
        <CatFace desexed={desexed} secondary={secondary} />
      </g>
      {label ? (
        <text className="ft-name" x="0" y="18" textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  )
}

function statusLine(mode: Mode, intervened: boolean) {
  if (!intervened || mode === 'none') return ''
  if (mode === 'trap') return 'Cats left for the pound. Other branches keep having kittens.'
  return 'Those cats stay. Their future branches stop.'
}

export default function BranchingFamilyTree() {
  const [mode, setMode] = useState<Mode>('none')
  const [tick, setTick] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [snap, setSnap] = useState(false)

  const scene = simulate(tick, mode)
  const showImpound = mode === 'trap' && scene.intervened

  useEffect(() => {
    if (!playing) return
    if (tick >= MAX_TICK) {
      setPlaying(false)
      return
    }
    const hold =
      tick === 0
        ? TICK_MS + 700
        : tick === INTERVENTION_TICK - 1 && mode !== 'none'
          ? TICK_MS + 550
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
    <Experiment number="01h" title="Branching family tree">
      <div className={`family-tree ${snap ? 'is-snap' : ''} is-year-${scene.year}`}>
        <p className="ft-note">
          One undesexed female
          <span>Illustrative timing and numbers — not the research model.</span>
        </p>

        <div className="ft-stage">
          <svg
            className="ft-svg"
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label="Animated family tree of community cats over four years"
          >
            {YEAR_LABELS.map((label, year) => {
              const active = scene.year >= year
              return (
                <g key={label} className={`ft-year ${active ? 'is-on' : ''}`}>
                  <text x="28" y={scene.yearY[year] + 4}>
                    {label}
                  </text>
                  <line x1="96" y1={scene.yearY[year]} x2="1000" y2={scene.yearY[year]} />
                </g>
              )
            })}

            <g className={`ft-impound ${showImpound ? 'is-on' : ''}`}>
              <rect x="1020" y="150" width="140" height="160" rx="10" />
              <text x="1090" y="178" textAnchor="middle">
                Trapped
              </text>
              <text className="ft-impound-sub" x="1090" y="196" textAnchor="middle">
                → Impounded
              </text>
            </g>

            {scene.links.map((link, i) => {
              if (link.kind === 'pair' && link.mateId) {
                const mother = scene.cats.find((cat) => cat.id === link.motherId)
                const mate = scene.mates.find((item) => item.id === link.mateId)
                if (!mother || !mate) return null
                const home = treeHome(mother.id)
                return (
                  <path
                    key={`pair-${link.mateId}`}
                    className="ft-branch is-on is-pair"
                    d={pairBridge(home, mate)}
                  />
                )
              }

              if (link.kind === 'cap') {
                const cat = scene.cats.find((item) => item.id === link.motherId)
                if (!cat) return null
                const stub = capStub(treeHome(cat.id), scene.cardHalf)
                return (
                  <g key={`cap-${link.motherId}`} className="ft-cap is-on">
                    <path d={stub.line} />
                    <circle cx={stub.cx} cy={stub.cy} r="4.5" />
                  </g>
                )
              }

              if (link.kind === 'litter' && link.childId) {
                const child = scene.cats.find((cat) => cat.id === link.childId)
                if (!child?.born) return null
                const pair = link.mateId ? pairPosition(link.mateId) : null
                const motherHome = treeHome(link.motherId)
                const origin = pair
                  ? { x: pair.pairX, y: pair.pairY }
                  : { x: motherHome.x, y: motherHome.y + scene.cardHalf }
                const childPos = child.place === 'impound' ? treeHome(child.id) : child
                return (
                  <path
                    key={`lit-${link.childId}-${i}`}
                    className={`ft-branch is-on ${child.place === 'impound' ? 'is-dim' : ''}`}
                    d={branchFromPair(origin, childPos, scene.cardHalf)}
                  />
                )
              }

              return null
            })}

            {scene.mates.map((mate) => (
              <g
                key={mate.id}
                className={`ft-cat is-mate-slot ${mate.visible ? 'is-in' : 'is-out'}`}
                transform={`translate(${mate.x} ${mate.y}) scale(${scene.scale * 0.72})`}
              >
                <CatCard year={scene.year} secondary />
              </g>
            ))}

            {scene.cats.map((cat) => {
              const shown = cat.born
              const atPound = cat.place === 'impound'
              return (
                <g
                  key={cat.id}
                  className={`ft-cat-slot ${atPound ? 'is-to-pound' : ''}`}
                  transform={`translate(${cat.x} ${cat.y})`}
                >
                  <g
                    className={`ft-cat ${cat.kitten ? 'is-kitten' : ''} ${shown ? 'is-in' : 'is-out'} ${atPound ? 'is-impounded' : ''}`}
                    style={{ transform: `scale(${shown ? cat.scale : 0.35})` }}
                  >
                    <CatCard
                      year={cat.year}
                      desexed={cat.desexed}
                      label={cat.id === 'f0' && tick === 0 ? 'one female' : undefined}
                    />
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        <p className={`ft-status ${scene.intervened ? 'is-on' : ''}`}>{statusLine(mode, scene.intervened)}</p>

        <div className="ft-controls">
          <div className="ft-modes">
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
          <div className="ft-transport">
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
