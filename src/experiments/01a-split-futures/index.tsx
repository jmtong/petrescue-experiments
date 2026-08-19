import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import './styles.css'

type Pt = { x: number; y: number }

const YEAR10 = {
  trap: { population: 39, enteringCare: 99 },
  sterilise: { population: 65, enteringCare: 25 },
} as const

const HOMES: Pt[] = [
  { x: 56, y: 208 },
  { x: 86, y: 198 },
  { x: 118, y: 214 },
  { x: 158, y: 186 },
  { x: 188, y: 176 },
  { x: 218, y: 190 },
  { x: 258, y: 208 },
  { x: 292, y: 196 },
  { x: 326, y: 214 },
  { x: 352, y: 188 },
  { x: 72, y: 302 },
  { x: 108, y: 314 },
  { x: 142, y: 292 },
  { x: 178, y: 308 },
  { x: 214, y: 322 },
  { x: 252, y: 306 },
  { x: 288, y: 318 },
  { x: 322, y: 298 },
  { x: 48, y: 258 },
  { x: 362, y: 252 },
]

const TRAP_LEAVE = [
  { i: 0, a: 0.06, b: 0.22 },
  { i: 1, a: 0.1, b: 0.26 },
  { i: 3, a: 0.14, b: 0.3 },
  { i: 4, a: 0.18, b: 0.34 },
  { i: 6, a: 0.22, b: 0.38 },
  { i: 8, a: 0.28, b: 0.44 },
  { i: 10, a: 0.48, b: 0.64 },
  { i: 11, a: 0.52, b: 0.68 },
  { i: 13, a: 0.58, b: 0.74 },
  { i: 15, a: 0.64, b: 0.8 },
  { i: 18, a: 0.7, b: 0.86 },
  { i: 19, a: 0.76, b: 0.9 },
]

const TRAP_NEW = [
  { home: 0, appear: 0.36, leaveA: 0.62, leaveB: 0.78, pound: 0 },
  { home: 1, appear: 0.4, leaveA: 0.7, leaveB: 0.86, pound: 1 },
  { home: 3, appear: 0.46, leaveA: 0.74, leaveB: 0.9, pound: 2 },
  { home: 4, appear: 0.52, leaveA: 0.78, leaveB: 0.94, pound: 3 },
]

const STER_WAVES = [
  { i: 0, go: 0.04, back: 0.22 },
  { i: 2, go: 0.06, back: 0.24 },
  { i: 4, go: 0.08, back: 0.26 },
  { i: 7, go: 0.1, back: 0.28 },
  { i: 9, go: 0.12, back: 0.3 },
  { i: 1, go: 0.2, back: 0.38 },
  { i: 5, go: 0.22, back: 0.4 },
  { i: 8, go: 0.24, back: 0.42 },
  { i: 12, go: 0.26, back: 0.44 },
  { i: 16, go: 0.28, back: 0.46 },
  { i: 3, go: 0.36, back: 0.54 },
  { i: 6, go: 0.38, back: 0.56 },
  { i: 11, go: 0.4, back: 0.58 },
  { i: 14, go: 0.42, back: 0.6 },
  { i: 17, go: 0.44, back: 0.62 },
  { i: 10, go: 0.52, back: 0.7 },
  { i: 13, go: 0.54, back: 0.72 },
  { i: 15, go: 0.56, back: 0.74 },
  { i: 18, go: 0.58, back: 0.76 },
  { i: 19, go: 0.6, back: 0.78 },
]

const STER_FADE = [
  { i: 1, a: 0.42, b: 0.62 },
  { i: 3, a: 0.5, b: 0.7 },
  { i: 5, a: 0.56, b: 0.76 },
  { i: 8, a: 0.62, b: 0.8 },
  { i: 10, a: 0.66, b: 0.84 },
  { i: 11, a: 0.68, b: 0.86 },
  { i: 14, a: 0.74, b: 0.9 },
  { i: 16, a: 0.8, b: 0.94 },
  { i: 18, a: 0.84, b: 0.98 },
]

const STER_NEW = [
  { home: { x: 96, y: 236 }, appear: 0.16, go: 0.32, back: 0.5 },
  { home: { x: 240, y: 236 }, appear: 0.34, go: 0.48, back: 0.66 },
]

const POUND: Pt[] = [
  { x: 92, y: 428 },
  { x: 118, y: 442 },
  { x: 146, y: 424 },
  { x: 172, y: 438 },
  { x: 198, y: 422 },
  { x: 224, y: 444 },
  { x: 250, y: 426 },
  { x: 276, y: 440 },
  { x: 132, y: 456 },
  { x: 188, y: 458 },
  { x: 236, y: 456 },
  { x: 104, y: 456 },
  { x: 160, y: 418 },
  { x: 210, y: 418 },
  { x: 300, y: 430 },
  { x: 70, y: 438 },
]

const VET = { x: 338, y: 432 }
const GATE = { y: 368 }

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n))
}

function smooth(t: number) {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

function remap(t: number, a: number, b: number) {
  if (b === a) return t >= b ? 1 : 0
  return smooth((t - a) / (b - a))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}

function travel(t: number, from: Pt, gateY: number, to: Pt) {
  const first = remap(t, 0, 0.45)
  const second = remap(t, 0.45, 1)
  if (second > 0) return lerpPt({ x: from.x, y: gateY }, to, second)
  if (first > 0) return lerpPt(from, { x: from.x, y: gateY }, first)
  return from
}

function goAndBack(t: number, go: number, back: number, from: Pt, mid: Pt) {
  const outbound = remap(t, go, go + 0.08)
  const inbound = remap(t, back - 0.08, back)
  if (inbound > 0) return { pt: lerpPt(mid, from, inbound), away: inbound < 1 }
  if (outbound > 0) return { pt: lerpPt(from, mid, outbound), away: true }
  return { pt: from, away: false }
}

function yearFromProgress(p: number) {
  if (p < 0.42) return 0
  if (p < 0.72) return 5
  return 10
}

function captions(split: number, year: number, numbers: number): {
  intro?: string
  left?: string
  right?: string
} {
  if (split < 0.35) {
    return {
      intro:
        'Each mark is a free-living cat on one street — urban stray and community cats, not feral cats. Scroll.',
    }
  }

  if (numbers > 0.4) {
    return {
      left: `Year 10 model, indexed to current practice = 100. Free-living ${YEAR10.trap.population}, entering care ${YEAR10.trap.enteringCare}. Population falls; intake barely moves, because the trapped cat is the admission.`,
      right: `Same index. Free-living ${YEAR10.sterilise.population}, entering care ${YEAR10.sterilise.enteringCare}, at 5 desexing surgeries per 1,000 residents a year. Population falls more slowly; intake falls substantially.`,
    }
  }

  if (year === 0) {
    return {
      left: 'Trap + remove. Cats leave the street for pounds, shelters and rescues. The trapped cat is the admission.',
      right: 'Sterilise + return. Cats visit desexing, then come home. Open rings are sterilised.',
    }
  }

  if (year === 5) {
    return {
      left: 'Empty yards refill with new entire cats. Trapping keeps sending cats into care.',
      right: 'Returned cats hold their territory. Fewer new marks appear. Intake starts to drop.',
    }
  }

  return {
    left: 'The street is thinner, but the pound stays busy. Removal generates intake even as numbers fall.',
    right: 'The street thins more slowly. Adults and their future kittens do not enter care as a result of the surgery.',
  }
}

function readProgress(el: HTMLElement) {
  const total = el.offsetHeight - window.innerHeight
  if (total <= 0) return 0
  return clamp(-el.getBoundingClientRect().top / total)
}

function CatMark({
  x,
  y,
  opacity,
  sterilised,
  kitten,
}: {
  x: number
  y: number
  opacity: number
  sterilised?: boolean
  kitten?: boolean
}) {
  const s = kitten ? 0.72 : 1
  return (
    <g
      className={sterilised ? 'cat sterilised' : 'cat'}
      transform={`translate(${x} ${y}) scale(${s})`}
      opacity={opacity}
    >
      <polygon className="ear" points="-3.4,-3.6 -4.1,-9.2 0.6,-4.4" />
      <polygon className="ear" points="3.4,-3.6 4.1,-9.2 -0.6,-4.4" />
      <circle className="body" r="6.4" cy="0.2" />
    </g>
  )
}

function Neighbourhood({
  variant,
  destOpacity,
}: {
  variant: 'left' | 'right'
  destOpacity: number
}) {
  return (
    <g>
      <path
        className="street-land"
        d="M36 112 C 48 90, 110 82, 168 94 C 230 78, 300 88, 372 102 L 388 338 C 320 356, 240 348, 168 352 C 96 348, 48 338, 32 318 Z"
        style={{ fill: '#e4edd8', stroke: '#b7c4a8', strokeWidth: 1.4 }}
      />
      <path
        className="ink-soft"
        fill="none"
        d="M44 230 C 120 210, 180 258, 250 232 C 300 214, 340 248, 372 238"
      />
      <circle className="tree" cx="46" cy="118" r="16" fill="#d5e0c8" stroke="#8a9a78" />
      <circle className="tree" cx="362" cy="128" r="14" fill="#d5e0c8" stroke="#8a9a78" />
      <circle className="tree" cx="198" cy="236" r="11" fill="#d5e0c8" stroke="#8a9a78" />
      <g>
        <polygon className="roof" points="58,152 96,118 134,152" fill="#edd9c4" stroke="#8a7360" />
        <rect className="wall" x="64" y="152" width="64" height="42" fill="#fffaf2" stroke="#8a7360" />
      </g>
      <g>
        <polygon className="roof" points="168,128 214,92 260,128" fill="#edd9c4" stroke="#8a7360" />
        <rect className="wall" x="176" y="128" width="76" height="46" fill="#fffaf2" stroke="#8a7360" />
      </g>
      <g>
        <polygon className="roof" points="286,158 324,128 362,158" fill="#edd9c4" stroke="#8a7360" />
        <rect className="wall" x="292" y="158" width="64" height="38" fill="#fffaf2" stroke="#8a7360" />
      </g>
      <g>
        <polygon className="roof" points="84,248 128,214 172,248" fill="#edd9c4" stroke="#8a7360" />
        <rect className="wall" x="92" y="248" width="72" height="44" fill="#fffaf2" stroke="#8a7360" />
      </g>
      <g>
        <polygon className="roof" points="236,262 286,224 336,262" fill="#edd9c4" stroke="#8a7360" />
        <rect className="wall" x="246" y="262" width="80" height="46" fill="#fffaf2" stroke="#8a7360" />
      </g>
      {variant === 'left' ? (
        <g opacity={destOpacity}>
          <rect
            className="place"
            x="48"
            y="402"
            width="300"
            height="68"
            fill="#fbf8f1"
            stroke="#b8aa98"
          />
          <text className="place-label" x="58" y="396">
            Pounds, shelters &amp; rescues
          </text>
        </g>
      ) : (
        <g opacity={destOpacity}>
          <rect
            className="wall"
            x="312"
            y="404"
            width="52"
            height="36"
            fill="#fffaf2"
            stroke="#8a7360"
          />
          <polygon className="roof" points="308,404 338,384 368,404" fill="#edd9c4" stroke="#8a7360" />
          <path className="ink" fill="none" d="M338 414 v16 M330 422 h16" />
          <text className="place-label" x="248" y="428">
            Desexing
          </text>
        </g>
      )}
    </g>
  )
}

function TrapCats({ story }: { story: number }) {
  const leaveAt = new Map(TRAP_LEAVE.map((d) => [d.i, d]))

  return (
    <g>
      {HOMES.map((home, i) => {
        const leave = leaveAt.get(i)
        let pt = home
        if (leave) {
          const t = remap(story, leave.a, leave.b)
          pt = travel(t, home, GATE.y, POUND[i % POUND.length])
        }
        return <CatMark key={`t-${i}`} x={pt.x} y={pt.y} opacity={1} />
      })}
      {TRAP_NEW.map((cat, n) => {
        const home = HOMES[cat.home] ?? HOMES[0]
        const dest = POUND[12 + cat.pound] ?? POUND[0]
        const shown = remap(story, cat.appear, cat.appear + 0.08)
        if (shown <= 0) return null
        const t = remap(story, cat.leaveA, cat.leaveB)
        const pt = travel(t, home, GATE.y, dest)
        return (
          <CatMark
            key={`tn-${n}`}
            x={pt.x}
            y={pt.y}
            opacity={shown}
            kitten
          />
        )
      })}
    </g>
  )
}

function SteriliseCats({ story }: { story: number }) {
  const waveAt = new Map(STER_WAVES.map((d) => [d.i, d]))
  const fadeAt = new Map(STER_FADE.map((d) => [d.i, d]))

  return (
    <g>
      {HOMES.map((home, i) => {
        const wave = waveAt.get(i)
        const fade = fadeAt.get(i)
        let pt = home
        let sterilised = false
        if (wave) {
          const trip = goAndBack(story, wave.go, wave.back, home, VET)
          pt = trip.pt
          sterilised = story >= wave.back
        }
        const opacity = fade ? 1 - remap(story, fade.a, fade.b) : 1
        return (
          <CatMark
            key={`s-${i}`}
            x={pt.x}
            y={pt.y}
            opacity={opacity}
            sterilised={sterilised}
          />
        )
      })}
      {STER_NEW.map((cat, n) => {
        const shown = remap(story, cat.appear, cat.appear + 0.1)
        if (shown <= 0) return null
        const trip = goAndBack(story, cat.go, cat.back, cat.home, VET)
        return (
          <CatMark
            key={`sn-${n}`}
            x={trip.pt.x}
            y={trip.pt.y}
            opacity={shown}
            sterilised={story >= cat.back}
            kitten
          />
        )
      })}
    </g>
  )
}

export default function SplitFutures() {
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

  const split = remap(progress, 0.08, 0.28)
  const story = remap(progress, 0.28, 0.82)
  const numbers = remap(progress, 0.84, 0.93)
  const year = yearFromProgress(progress)
  const slide = split * 52
  const copy = captions(split, year, numbers)

  return (
    <Experiment number="01a" title="Split futures">
      <div className="split-futures">
        <div className="scroll-track" ref={trackRef}>
          <div className="stage">
            <div className="year-indicator">
              <span>Year</span>
              <strong>{year}</strong>
              <div className="year-ticks">
                {[0, 5, 10].map((tick) => (
                  <span key={tick} className={tick === year ? 'on' : undefined}>
                    {tick}
                  </span>
                ))}
              </div>
            </div>

            <div className="scene">
              <div className="panels">
                <div
                  className="panel"
                  style={{
                    transform: `translateX(${-slide}%)`,
                    zIndex: 2,
                  }}
                >
                  <svg viewBox="0 0 420 500" fill="#e4edd8" aria-label="Trap and remove">
                    <text className="panel-label" x="28" y="36" opacity={split}>
                      Trap + remove
                    </text>
                    <Neighbourhood variant="left" destOpacity={split} />
                    <TrapCats story={story} />
                    <g opacity={numbers}>
                      <text className="indices" x="28" y="486">
                        {YEAR10.trap.population} free-living
                      </text>
                      <text className="indices" x="168" y="486">
                        {YEAR10.trap.enteringCare} entering care
                      </text>
                    </g>
                  </svg>
                </div>

                <div
                  className="panel"
                  style={{
                    transform: `translateX(${slide}%)`,
                    opacity: split,
                  }}
                >
                  <svg viewBox="0 0 420 500" fill="#e4edd8" aria-label="Sterilise and return">
                    <text className="panel-label" x="28" y="36" opacity={split}>
                      Sterilise + return
                    </text>
                    <Neighbourhood variant="right" destOpacity={split} />
                    <SteriliseCats story={story} />
                    <g opacity={numbers}>
                      <text className="indices" x="28" y="486">
                        {YEAR10.sterilise.population} free-living
                      </text>
                      <text className="indices" x="168" y="486">
                        {YEAR10.sterilise.enteringCare} entering care
                      </text>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                className="split-rule"
                style={{ transform: `translateX(-50%) scaleY(${split})` }}
              />
            </div>

            <div className="explain">
              {copy.intro ? (
                <p className="explain-one">{copy.intro}</p>
              ) : (
                <div className="explain-split">
                  <p style={{ opacity: split }}>{copy.left}</p>
                  <p style={{ opacity: split }}>{copy.right}</p>
                </div>
              )}
              <p className="key" style={{ opacity: Math.max(split, 0.35) }}>
                Solid mark: intact cat. Open ring: sterilised and returned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Experiment>
  )
}
