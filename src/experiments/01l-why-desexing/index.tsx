import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import { CatMark } from './CatMark.tsx'
import {
  CARE,
  CARE_SLOTS,
  CLINIC,
  FAMILY_IDS,
  GATE,
  HOME,
  VIEW,
  YEARS,
  catsAtYear,
  clamp,
  countAt,
  illustrativePopulation,
  lerp,
  lerpPt,
  remap,
  startingCats,
  travel,
  type Future,
} from './illustrativePopulation.ts'
import './why-desexing.css'

type Box = { x: number; y: number; w: number; h: number }
type Frame = { box: Box; cat: number }

/** Reference width for on-screen-constant label sizing. */
const REF_W = VIEW.w

const FRAMES: Record<'close' | 'family' | 'wide', Frame> = {
  close: { box: { x: 100, y: 124, w: 300, h: 242 }, cat: 1 },
  family: { box: { x: 40, y: 76, w: 420, h: 338 }, cat: 1.15 },
  wide: { box: { x: 0, y: 12, w: 760, h: 612 }, cat: 1.5 },
}

const BANDS: { id: Future; a: number; b: number }[] = [
  { id: 'noIntervention', a: 0.6, b: 0.72 },
  { id: 'trapRemove', a: 0.72, b: 0.86 },
  { id: 'targetedDesexing', a: 0.86, b: 1.0001 },
]

const FUTURE_CAPTION: Record<Future, string> = {
  noIntervention: 'Every intact cat can add more cats.',
  trapRemove: 'The street thins — into pounds, shelters and rescues.',
  targetedDesexing: 'The cats stay. The kittens stop.',
}

const FAMILY = startingCats.filter((c) => (FAMILY_IDS as readonly string[]).includes(c.id))
const OTHERS = startingCats.filter((c) => !c.progenitor && c.parentId === null)
const MAE = startingCats.find((c) => c.progenitor)!

function lerpBox(a: Box, b: Box, t: number): Box {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    w: lerp(a.w, b.w, t),
    h: lerp(a.h, b.h, t),
  }
}

function lerpFrame(a: Frame, b: Frame, t: number): Frame {
  if (t <= 0) return a
  if (t >= 1) return b
  return { box: lerpBox(a.box, b.box, t), cat: lerp(a.cat, b.cat, t) }
}

function readProgress(el: HTMLElement) {
  const total = el.offsetHeight - window.innerHeight
  if (total <= 0) return 0
  return clamp(-el.getBoundingClientRect().top / total)
}

/** The shared header is sticky and its height varies with wrapping. Measure it. */
function useHeaderOffset(ref: React.RefObject<HTMLElement | null>) {
  const [offset, setOffset] = useState(84)

  useEffect(() => {
    const header = ref.current?.closest('.experiment')?.querySelector('.experiment-header')
    if (!(header instanceof HTMLElement)) return
    const measure = () => setOffset(header.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ref])

  return offset
}

function ScaledText({
  x,
  y,
  k,
  size,
  className,
  opacity = 1,
  anchor = 'start',
  children,
}: {
  x: number
  y: number
  k: number
  size: number
  className?: string
  opacity?: number
  anchor?: 'start' | 'middle' | 'end'
  children: ReactNode
}) {
  if (opacity <= 0.01) return null
  return (
    <text
      className={className}
      transform={`translate(${x} ${y}) scale(${k})`}
      fontSize={size}
      textAnchor={anchor}
      opacity={opacity}
    >
      {children}
    </text>
  )
}

function House({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.52
  return (
    <g>
      <polygon className="wd-roof" points={`${x},${y} ${x + w / 2},${y - h * 0.72} ${x + w},${y}`} />
      <rect className="wd-wall" x={x + 6} y={y} width={w - 12} height={h} />
    </g>
  )
}

function Ground({ houses, quiet = 1 }: { houses: number; quiet?: number }) {
  return (
    <g>
      <path
        className="wd-land"
        d="M34 96 C 60 54, 150 40, 250 52 C 350 34, 460 46, 536 62 C 560 68, 566 100, 562 130 L 556 372 C 470 402, 340 410, 230 400 C 130 392, 44 366, 32 330 Z"
      />
      <path className="wd-lane" d="M 48 262 C 160 236, 260 292, 372 264 C 452 244, 510 282, 556 268" />
      <g opacity={houses * quiet}>
        <ellipse className="wd-green" cx="150" cy="98" rx="52" ry="22" />
        <ellipse className="wd-green" cx="430" cy="86" rx="58" ry="22" />
        <ellipse className="wd-green" cx="368" cy="380" rx="62" ry="20" />
        <House x={86} y={150} w={62} />
        <House x={250} y={112} w={70} />
        <House x={430} y={140} w={58} />
        <House x={100} y={320} w={60} />
        <House x={300} y={356} w={68} />
        <House x={462} y={300} w={56} />
        <circle className="wd-tree" cx="60" cy="140" r="13" />
        <circle className="wd-tree" cx="388" cy="112" r="12" />
        <circle className="wd-tree" cx="524" cy="238" r="12" />
        <circle className="wd-tree" cx="220" cy="380" r="11" />
      </g>
    </g>
  )
}

function Clinic({ opacity, k }: { opacity: number; k: number }) {
  if (opacity <= 0.01) return null
  return (
    <g opacity={opacity}>
      <rect className="wd-wall" x={CLINIC.x - 30} y={CLINIC.y - 12} width="60" height="38" />
      <polygon
        className="wd-roof"
        points={`${CLINIC.x - 35},${CLINIC.y - 12} ${CLINIC.x},${CLINIC.y - 36} ${CLINIC.x + 35},${CLINIC.y - 12}`}
      />
      <path className="wd-cross" d={`M ${CLINIC.x} ${CLINIC.y + 2} v14 M ${CLINIC.x - 7} ${CLINIC.y + 9} h14`} />
      <ScaledText className="wd-place" x={CLINIC.x} y={CLINIC.y + 46} k={k} size={15} anchor="middle">
        Desexing
      </ScaledText>
    </g>
  )
}

function CareSystem({ opacity, k }: { opacity: number; k: number }) {
  if (opacity <= 0.01) return null
  return (
    <g opacity={opacity}>
      <path
        className="wd-gate"
        d={`M ${GATE.x} ${GATE.y - 6} C ${GATE.x - 10} ${GATE.y + 26}, ${CARE.x - 22} ${CARE.y - 6}, ${CARE.x + 4} ${CARE.y + 34}`}
      />
      <rect className="wd-care" x={CARE.x} y={CARE.y} width={CARE.w} height={CARE.h} />
      <ScaledText className="wd-place" x={CARE.x + 70} y={CARE.y - 14} k={k} size={16}>
        Pounds, shelters &amp; rescues
      </ScaledText>
    </g>
  )
}

function TrapGlyph({
  x,
  y,
  scale,
  opacity,
}: {
  x: number
  y: number
  scale: number
  opacity: number
}) {
  if (opacity <= 0.01) return null
  const w = 42
  const h = 30
  const bars = [-0.5, 0, 0.5].map((f) => f * w)
  return (
    <g
      className="wd-trap"
      transform={`translate(${x} ${y}) scale(${scale})`}
      opacity={opacity}
    >
      <rect x={-w} y={-h} width={w * 2} height={h * 2} rx={3} />
      {bars.map((bx) => (
        <path key={bx} d={`M ${bx} ${-h} L ${bx} ${h}`} className="wd-trap-bar" />
      ))}
      <path d={`M ${-w} 0 L ${w} 0`} className="wd-trap-bar" />
    </g>
  )
}

function CatAt({
  x,
  y,
  scale,
  opacity,
  look,
  desexed,
  kitten,
  progenitor,
}: {
  x: number
  y: number
  scale: number
  opacity: number
  look: number
  desexed?: boolean
  kitten?: boolean
  progenitor?: boolean
}) {
  if (opacity <= 0.01) return null
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <CatMark look={look} desexed={desexed} kitten={kitten} progenitor={progenitor} />
    </g>
  )
}

function StoryCats({
  familyT,
  others,
  iv,
  catScale,
  k,
  quiet,
}: {
  familyT: number
  others: number
  iv: number
  catScale: number
  k: number
  quiet: number
}) {
  const trapA = remap(iv, 0.03, 0.09) * (1 - remap(iv, 0.14, 0.2))
  const goCare = remap(iv, 0.14, 0.34)
  const resetT = remap(iv, 0.44, 0.52)
  const trapB = remap(iv, 0.56, 0.61) * (1 - remap(iv, 0.64, 0.69))
  const goVet = remap(iv, 0.62, 0.72)
  const backHome = remap(iv, 0.74, 0.86)
  const desexed = iv >= 0.78

  const outPos = travel(goCare, HOME, GATE, CARE_SLOTS[0])
  const vetPos =
    backHome > 0 ? lerpPt(CLINIC, HOME, backHome) : goVet > 0 ? lerpPt(HOME, CLINIC, goVet) : HOME

  const vacancy = remap(goCare, 0.55, 0.85) * (1 - resetT)
  const inCare = remap(goCare, 0.85, 1) * (1 - resetT)
  const returned = remap(iv, 0.86, 0.92)
  const heroEmphasis = 1 + remap(iv, 0.02, 0.12) * 0.3

  return (
    <g>
      {OTHERS.map((cat) => (
        <CatAt
          key={cat.id}
          x={cat.x}
          y={cat.y}
          scale={catScale}
          opacity={others * quiet}
          look={cat.look}
        />
      ))}

      {FAMILY.map((cat, i) => {
        const shown = remap(familyT, 0.06 + i * 0.13, 0.24 + i * 0.13)
        const grown = remap(familyT, 0.5 + i * 0.08, 0.82 + i * 0.08)
        return (
          <CatAt
            key={cat.id}
            x={cat.x}
            y={cat.y}
            scale={catScale * lerp(0.68, 1, grown)}
            opacity={shown * quiet}
            look={cat.look}
            kitten={grown < 0.85}
          />
        )
      })}

      <g opacity={vacancy}>
        <circle className="wd-vacancy" cx={HOME.x} cy={HOME.y} r={26 * catScale} />
        <ScaledText className="wd-note" x={HOME.x} y={HOME.y + 96} k={k} size={18} anchor="middle">
          Her spot is empty.
        </ScaledText>
      </g>

      <CatAt
        x={outPos.x}
        y={outPos.y}
        scale={catScale * heroEmphasis}
        opacity={1 - resetT}
        look={MAE.look}
        progenitor
      />

      <CatAt
        x={vetPos.x}
        y={vetPos.y}
        scale={catScale * heroEmphasis}
        opacity={resetT}
        look={MAE.look}
        progenitor
        desexed={desexed}
      />

      <TrapGlyph
        x={HOME.x}
        y={HOME.y - 2}
        scale={catScale * 0.85}
        opacity={Math.max(trapA, trapB)}
      />

      <ScaledText
        className="wd-note"
        x={CARE.x + CARE.w / 2}
        y={CARE.y + CARE.h + 28}
        k={k}
        size={18}
        anchor="middle"
        opacity={inCare}
      >
        Entered the care system.
      </ScaledText>

      <ScaledText
        className="wd-note"
        x={HOME.x}
        y={HOME.y - 40 * catScale}
        k={k}
        size={17}
        anchor="middle"
        opacity={returned}
      >
        Desexed and returned.
      </ScaledText>
    </g>
  )
}

function FutureCats({
  future,
  year,
  catScale,
}: {
  future: Future
  year: number
  catScale: number
}) {
  return (
    <g>
      {catsAtYear(future, year).map((cat) => (
        <CatAt
          key={cat.id}
          x={cat.x}
          y={cat.y}
          scale={catScale}
          opacity={cat.opacity}
          look={cat.look}
          desexed={cat.desexed}
          kitten={cat.kitten}
          progenitor={cat.progenitor}
        />
      ))}
    </g>
  )
}

function Timeline({ year, opacity }: { year: number; opacity: number }) {
  const active = YEARS.reduce((best, y) => (Math.abs(y - year) < Math.abs(best - year) ? y : best), 0)
  return (
    <div className="wd-timeline" style={{ opacity }} aria-hidden={opacity < 0.5}>
      <span className="wd-timeline-kicker">Year</span>
      <div className="wd-timeline-track">
        {YEARS.map((tick) => (
          <span key={tick} className={`wd-tick${tick === active ? ' is-on' : ''}`}>
            {tick}
          </span>
        ))}
      </div>
    </div>
  )
}

function PayoffBand({ future }: { future: Future }) {
  const def = illustrativePopulation[future]
  const counts = countAt(future, 4)
  const box = FRAMES.wide.box
  const k = box.w / REF_W

  return (
    <section className="wd-band">
      <div className="wd-band-head">
        <h3>{def.label}</h3>
        <p className="wd-band-counts">
          <strong>{counts.home}</strong> in the neighbourhood
          {future === 'targetedDesexing' ? <span> ({counts.desexed} desexed)</span> : null}
          <span className="wd-band-sep">·</span>
          <strong>{counts.care}</strong> entered the care system
        </p>
      </div>
      <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} aria-label={`${def.label} at year four`}>
        <Ground houses={1} />
        <Clinic opacity={future === 'targetedDesexing' ? 1 : 0} k={k} />
        <CareSystem opacity={1} k={k} />
        <FutureCats future={future} year={4} catScale={FRAMES.wide.cat} />
      </svg>
    </section>
  )
}

function storyCaption(p: number, iv: number) {
  if (p < 0.09) return 'One undesexed cat lives here.'
  if (p < 0.22) return 'Her kittens grow up. One reproductive cat becomes several.'
  if (p < 0.34) return 'Every street already has cats. This is a population.'
  if (iv < 0.12) return 'A trap goes down.'
  if (iv < 0.34) return 'Trapped.'
  if (iv < 0.44) return 'Removed. Trapping is how a cat gets there.'
  if (iv < 0.56) return 'Same cat. Same street. A different choice.'
  if (iv < 0.62) return 'Trapped again.'
  if (iv < 0.84) return 'Taken to be desexed.'
  return 'Returned to the same spot. Still here — no more kittens.'
}

export default function WhyDesexing() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const headerOffset = useHeaderOffset(rootRef)

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

  const p = progress
  const familyT = remap(p, 0.09, 0.22)
  const houses = remap(p, 0.22, 0.33)
  const others = remap(p, 0.24, 0.35)
  const worldExtras = remap(p, 0.35, 0.42)
  const iv = clamp((p - 0.34) / 0.26)
  const storyOpacity = 1 - remap(p, 0.585, 0.618)

  let frame = lerpFrame(FRAMES.close, FRAMES.family, remap(p, 0.09, 0.2))
  frame = lerpFrame(frame, FRAMES.wide, remap(p, 0.22, 0.33))

  // The intervention journey spans the whole world, so focus comes from
  // quietening everything except the cat being followed.
  const dimT = remap(p, 0.345, 0.395) * (1 - remap(p, 0.57, 0.61))
  const quiet = lerp(1, 0.28, dimT)

  const box = frame.box
  const k = box.w / REF_W

  const bands = BANDS.map((band) => {
    const opacity =
      remap(p, band.a - 0.012, band.a + 0.012) * (1 - remap(p, band.b - 0.012, band.b + 0.012))
    const span = band.b - 0.02 - (band.a + 0.015)
    const year = clamp((p - (band.a + 0.015)) / span) * 4
    return { ...band, opacity, year }
  })

  const activeBand = bands.reduce((best, b) => (b.opacity > best.opacity ? b : best), bands[0])
  const inFutures = activeBand.opacity > 0.5
  const timelineOpacity = remap(p, 0.6, 0.65)
  const isReset = storyOpacity > 0.5 && iv >= 0.44 && iv < 0.56

  const clinicOpacity = Math.max(
    worldExtras * storyOpacity,
    bands.find((b) => b.id === 'targetedDesexing')!.opacity,
  )
  const careOpacity = Math.max(worldExtras * storyOpacity, inFutures ? 1 : 0)

  return (
    <Experiment number="01l" title="Why desexing">
      <div
        className="why-desexing"
        ref={rootRef}
        style={{ ['--wd-stage-top' as string]: `${headerOffset}px` }}
      >
        <div className="wd-track" ref={trackRef}>
          <div className="wd-stage">
            <div className="wd-chrome">
              <p className="wd-disclaimer">
                Illustrative timing and numbers — not the research model.
              </p>
              <Timeline year={activeBand.year} opacity={timelineOpacity} />
            </div>

            <div className="wd-scene">
              <div className="wd-panel">
                <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} aria-label="Neighbourhood">
                  <Ground houses={houses} quiet={quiet} />
                  <Clinic opacity={clinicOpacity} k={k} />
                  <CareSystem opacity={careOpacity} k={k} />

                  <g opacity={storyOpacity}>
                    {storyOpacity > 0.01 ? (
                      <StoryCats
                        familyT={familyT}
                        others={others}
                        iv={iv}
                        catScale={frame.cat}
                        k={k}
                        quiet={quiet}
                      />
                    ) : null}
                  </g>

                  {bands.map((band) =>
                    band.opacity > 0.01 ? (
                      <g key={band.id} opacity={band.opacity}>
                        <FutureCats future={band.id} year={band.year} catScale={frame.cat} />
                      </g>
                    ) : null,
                  )}
                </svg>
              </div>
            </div>

            <div className="wd-copy">
              <p className="wd-scenario" style={{ opacity: activeBand.opacity }}>
                {illustrativePopulation[activeBand.id].label}
              </p>
              <p className={`wd-caption${isReset ? ' is-pivot' : ''}`}>
                {inFutures ? FUTURE_CAPTION[activeBand.id] : storyCaption(p, iv)}
              </p>
            </div>
          </div>
        </div>

        <div className="wd-payoff">
          <header className="wd-payoff-head">
            <p className="wd-payoff-kicker">Year 4</p>
            <h2>Same street, three choices</h2>
          </header>
          {BANDS.map((band) => (
            <PayoffBand key={band.id} future={band.id} />
          ))}
          <p className="wd-payoff-foot">
            Illustrative sequence only. Counts are hand-authored to show the mechanism, not
            modelled output. Under trap + remove, two intact cats arrive to fill vacated
            territory — a real mechanism, but the number and timing here are placeholders.
          </p>
        </div>
      </div>
    </Experiment>
  )
}
