import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import { INDEX, STEPS, clamp, stepIndex, type StepId } from './data.ts'
import './styles.css'

function readProgress(el: HTMLElement) {
  const total = el.offsetHeight - window.innerHeight
  if (total <= 0) return 0
  return clamp(-el.getBoundingClientRect().top / total)
}

type CatLook = 'plain' | 'pound' | 'home' | 'newcomer'

const STREET_COUNT = 100
const STREET_COLS = 10
const STREET_ORIGIN = { x: 18, y: 22 }
const STREET_GAP = { x: 22, y: 20 }

/** Busy vs quiet pound clusters are a picture of the door, not the 99 / 25 intake index. */
const POUND_BUSY = 24
const POUND_QUIET = 5
/** Teal newcomers on empty plots — not the 18.7 immigration figure. */
const NEWCOMERS = 6

function streetSpot(i: number) {
  const col = i % STREET_COLS
  const row = Math.floor(i / STREET_COLS)
  return {
    x: STREET_ORIGIN.x + col * STREET_GAP.x,
    y: STREET_ORIGIN.y + row * STREET_GAP.y,
  }
}

function poundSpot(i: number) {
  const cols = 4
  const col = i % cols
  const row = Math.floor(i / cols)
  return { x: 268 + col * 18, y: 36 + row * 20 }
}

function CatBlob({
  x,
  y,
  look,
}: {
  x: number
  y: number
  look: CatLook
}) {
  return (
    <g className={`tvs-blob is-${look}`} transform={`translate(${x} ${y})`}>
      <ellipse className="blob-ear" cx="-5.2" cy="-7" rx="2.8" ry="3.6" />
      <ellipse className="blob-ear" cx="5.2" cy="-7" rx="2.8" ry="3.6" />
      <ellipse className="blob-body" cx="0" cy="3" rx="8.2" ry="7" />
      <ellipse className="blob-head" cx="0" cy="-3.2" rx="6.4" ry="5.2" />
      <path className="blob-face" d="M-2.6 -3.6 q 1.1 -1.2 2.2 0" />
      <path className="blob-face" d="M0.4 -3.6 q 1.1 -1.2 2.2 0" />
      <path className="blob-face" d="M-1.4 -0.2 q 1.4 1.6 2.8 0" />
    </g>
  )
}

function EmptySpot({ x, y }: { x: number; y: number }) {
  return <ellipse className="tvs-empty" cx={x} cy={y} rx="8" ry="5" />
}

function TownArt({ method, step }: { method: 'trap' | 'sterilise'; step: StepId }) {
  const trapOn = method === 'trap' && step !== 'setup'
  const year10Street =
    method === 'trap' &&
    (step === 'trap-pop' || step === 'trap-intake' || step === 'ster-both' || step === 'vacancy')
  const sterOn =
    method === 'sterilise' &&
    (step === 'ster-return' || step === 'ster-both' || step === 'vacancy')
  const vacancy = method === 'trap' && step === 'vacancy'

  const streetLive = method === 'trap'
    ? year10Street
      ? INDEX.trap.population10
      : trapOn
        ? STREET_COUNT - POUND_BUSY
        : STREET_COUNT
    : sterOn
      ? INDEX.sterilise.population10
      : STREET_COUNT

  const poundCount = method === 'trap' && trapOn ? POUND_BUSY : sterOn ? POUND_QUIET : 0
  const showPound = (method === 'trap' && trapOn) || sterOn
  const isSetup = step === 'setup'

  return (
    <svg className="tvs-art" viewBox="0 0 360 250" aria-hidden>
      {showPound ? (
        <rect className="tvs-pound-bed" x="250" y="16" width="98" height="214" rx="14" />
      ) : null}

      {Array.from({ length: STREET_COUNT }, (_, i) => {
        const spot = streetSpot(i)
        if (i < streetLive) {
          const look: CatLook =
            method === 'sterilise' && sterOn ? 'home' : 'plain'
          return <CatBlob key={`s-${i}`} x={spot.x} y={spot.y} look={look} />
        }
        if (vacancy && i < streetLive + NEWCOMERS) {
          return <CatBlob key={`n-${i}`} x={spot.x} y={spot.y} look="newcomer" />
        }
        return <EmptySpot key={`e-${i}`} x={spot.x} y={spot.y} />
      })}

      {Array.from({ length: poundCount }, (_, i) => {
        const spot = poundSpot(i)
        return <CatBlob key={`p-${i}`} x={spot.x} y={spot.y} look="pound" />
      })}

      {isSetup ? (
        <text className="tvs-art-label" x="117" y="242">
          Cats living outside today
        </text>
      ) : null}
      {method === 'trap' && trapOn ? (
        <text className="tvs-art-label" x="299" y="228">
          <tspan x="299" dy="0">
            Cats arriving
          </tspan>
          <tspan x="299" dy="14">
            at the pound
          </tspan>
        </text>
      ) : null}
      {sterOn ? (
        <text className="tvs-art-label is-home" x="299" y="228">
          <tspan x="299" dy="0">
            Fewer cats arriving
          </tspan>
          <tspan x="299" dy="14">
            at the pound
          </tspan>
        </text>
      ) : null}
    </svg>
  )
}

function BigStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: number
  hint: string
  tone: 'warn' | 'good' | 'quiet'
}) {
  return (
    <div className={`tvs-stat is-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{hint}</span>
      <div className="tvs-stat-bar" aria-hidden>
        <b style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ImmChip({
  label,
  value,
  tone,
  max = 20,
}: {
  label: string
  value: number
  tone: 'warn' | 'good' | 'quiet'
  max?: number
}) {
  return (
    <div className={`tvs-chip is-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <div className="tvs-stat-bar">
        <b style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  )
}

export default function TrappingVsSterilising() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const update = () => {
      frame = 0
      setProgress(readProgress(track))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const step = STEPS[stepIndex(progress)]
  const id = step.id
  const showImm = id === 'vacancy'
  const showTrapPop = id === 'trap-pop' || id === 'trap-intake' || id === 'ster-both'
  const showTrapIntake = id === 'trap-intake' || id === 'ster-both'
  const showSter = id === 'ster-both'
  const highlightSter =
    id === 'setup' || id === 'ster-return' || id === 'ster-both' || id === 'vacancy'
  const highlightTrap =
    id === 'setup' ||
    id === 'trap-door' ||
    id === 'trap-pop' ||
    id === 'trap-intake' ||
    id === 'ster-both' ||
    id === 'vacancy'

  return (
    <Experiment number="01g" title="Catching cats vs desexing them">
      <div className={`tvs ${showImm ? 'is-imm' : ''}`}>
        <div className="tvs-scrolly" ref={trackRef}>
          <div className="tvs-stage">
            <div className="tvs-hero">
              <p className="tvs-pill">{step.kicker}</p>
              <h2 className="tvs-headline">{step.caption}</h2>
              <p className="tvs-scale-note">
                This street is a scaled-down picture: <strong>today = 100 cats</strong>. Across
                Australian towns and suburbs, cats living outside are in the hundreds of thousands
                (about 700,000, with a very wide range).
              </p>
              <p className="tvs-scroll-hint">Keep scrolling</p>
            </div>

            <div className="tvs-cards">
              <article className={`tvs-card is-trap ${highlightTrap ? 'is-on' : 'is-dim'}`}>
                <div className="tvs-card-top">
                  <span className="tvs-tag">Town A</span>
                  <h3>Catch and take away</h3>
                  <p>Caught cats go to the pound, and leave the street.</p>
                </div>
                <div className="tvs-card-art">
                  <TownArt method="trap" step={id} />
                </div>
                {showTrapPop ? (
                  <div className="tvs-stats">
                    <BigStat
                      label="Cats on the street"
                      value={INDEX.trap.population10}
                      hint="After 10 years. Today = 100."
                      tone="warn"
                    />
                    {showTrapIntake ? (
                      <BigStat
                        label="Arriving at the pound"
                        value={INDEX.trap.care10}
                        hint={`After 10 years. After 20 years: ${INDEX.trap.care20}.`}
                        tone="warn"
                      />
                    ) : null}
                  </div>
                ) : null}
              </article>

              <article className={`tvs-card is-ster ${highlightSter ? 'is-on' : 'is-dim'}`}>
                <div className="tvs-card-top">
                  <span className="tvs-tag">Town B</span>
                  <h3>Desex and send home</h3>
                  <p>Caught cats are desexed, then live on the same street.</p>
                </div>
                <div className="tvs-card-art">
                  <TownArt method="sterilise" step={id} />
                </div>
                {showSter ? (
                  <div className="tvs-stats">
                    <BigStat
                      label="Cats on the street"
                      value={INDEX.sterilise.population10}
                      hint="After 10 years. Today = 100."
                      tone="good"
                    />
                    <BigStat
                      label="Arriving at the pound"
                      value={INDEX.sterilise.care10}
                      hint={`After 10 years. After 20 years: ${INDEX.sterilise.care20}.`}
                      tone="good"
                    />
                  </div>
                ) : null}
              </article>
            </div>

            {showImm ? (
              <div className="tvs-imm">
                <p className="tvs-imm-kicker">New cats moving into empty spots</p>
                <p className="tvs-imm-unit">After 10 years, for every 10,000 people who live there</p>
                <div className="tvs-imm-row">
                  <ImmChip label="Catch twice as many" value={INDEX.trap.immigration10} tone="warn" />
                  <ImmChip label="Desex and send home" value={INDEX.sterilise.immigration10} tone="good" />
                  <ImmChip label="What we do today" value={INDEX.current.immigration10} tone="quiet" />
                </div>
              </div>
            ) : null}

            <p className="tvs-source">
              Each cat on the street stands for one point on the index (today = 100). The cats in
              this pound strip are a picture of how busy the pound looks — not a count of 99 or 25. Urban
              stray / free-living cats in Australia: point estimate 700,000, plausible range
              70,000–2.56 million. Indexed results from the PetRescue cat population model (Boone
              et al. 2019 structure, fitted to Chua/Rand/Morton 2023 and the Banyule and Rosewood
              programmes).
            </p>
          </div>

          <div className="tvs-steps">
            {STEPS.map((item) => (
              <section key={item.id} className="tvs-step" />
            ))}
          </div>
        </div>
      </div>
    </Experiment>
  )
}
