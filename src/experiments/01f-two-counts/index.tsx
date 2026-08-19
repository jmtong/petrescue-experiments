import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import {
  CLINIC,
  STEPS,
  YEAR10,
  clamp,
  sceneFromProgress,
  type Actor,
} from './scene.ts'
import './two-counts.css'

function readProgress(el: HTMLElement) {
  const total = el.offsetHeight - window.innerHeight
  if (total <= 0) return 0
  return clamp(-el.getBoundingClientRect().top / total)
}

function IndexBar({ value }: { value: number }) {
  return (
    <div className="tc-bar" aria-hidden>
      <span className="tc-bar-base" />
      <span className="tc-bar-fill" style={{ width: `${value}%` }} />
    </div>
  )
}

function CatMark({
  actor,
  className,
}: {
  actor: Actor
  className?: string
}) {
  const s = actor.kitten ? 0.72 : 1
  return (
    <g
      className={`tc-cat ${actor.sterilised ? 'is-sterilised' : ''} ${className ?? ''}`}
      transform={`translate(${actor.x} ${actor.y}) scale(${s})`}
      opacity={actor.opacity}
    >
      <polygon className="ear" points="-3.6,-3.8 -4.4,-9.6 0.7,-4.6" />
      <polygon className="ear" points="3.6,-3.8 4.4,-9.6 -0.7,-4.6" />
      <circle className="body" r="6.6" cy="0.3" />
    </g>
  )
}

function Neighbourhood({
  doorOn,
  clinicOn,
  vacancyOn,
}: {
  doorOn: number
  clinicOn: number
  vacancyOn: number
}) {
  return (
    <g>
      <path
        className="land"
        d="M28 86 C 48 54, 140 42, 230 58 C 330 38, 410 56, 458 78 L 478 468 C 360 502, 220 494, 110 486 C 52 478, 22 452, 16 420 Z"
      />
      <path
        className="path"
        fill="none"
        d="M40 300 C 120 272, 200 328, 292 300 C 360 278, 420 318, 470 292"
      />
      <circle className="tree" cx="54" cy="102" r="18" />
      <circle className="tree" cx="430" cy="108" r="15" />
      <circle className="tree" cx="236" cy="292" r="12" />

      <g>
        <polygon className="roof" points="62,148 108,108 154,148" />
        <rect className="wall" x="72" y="148" width="72" height="44" />
      </g>
      <g>
        <polygon className="roof" points="188,126 242,84 296,126" />
        <rect className="wall" x="198" y="126" width="86" height="48" />
      </g>
      <g>
        <polygon className="roof" points="318,158 362,124 406,158" />
        <rect className="wall" x="326" y="158" width="72" height="40" />
      </g>
      <g>
        <polygon className="roof" points="88,248 138,208 188,248" />
        <rect className="wall" x="98" y="248" width="80" height="46" />
      </g>
      <g>
        <polygon className="roof" points="248,268 306,224 364,268" />
        <rect className="wall" x="258" y="268" width="92" height="48" />
      </g>
      <g>
        <polygon className="roof" points="118,368 168,332 218,368" />
        <rect className="wall" x="128" y="368" width="80" height="44" />
      </g>
      <g>
        <polygon className="roof" points="268,388 322,348 376,388" />
        <rect className="wall" x="278" y="388" width="86" height="46" />
      </g>

      <g className="vacancy" opacity={vacancyOn}>
        <ellipse cx="86" cy="168" rx="22" ry="14" />
        <ellipse cx="206" cy="246" rx="22" ry="14" />
        <ellipse cx="168" cy="368" rx="22" ry="14" />
        <text className="place-label" x="210" y="500">
          Empty space left behind
        </text>
      </g>

      <g className="clinic" opacity={clinicOn}>
        <rect className="wall" x="592" y="168" width="72" height="46" />
        <polygon className="roof" points="586,168 628,142 670,168" />
        <path className="plus" d="M628 182 v16 M620 190 h16" />
        <text className="place-label" x="628" y="232">
          Desexing
        </text>
      </g>

      <g className="door" opacity={Math.max(doorOn, 0.18)}>
        <rect className="door-box" x="720" y="128" width="268" height="332" rx="6" />
        <rect className="door-open" x="812" y="168" width="84" height="168" />
        <path className="door-leaf" d="M812 168 H896 V336 H812" />
        <circle className="knob" cx="884" cy="252" r="4" />
        <text className="place-label" x="854" y="118">
          Cats arriving this year
        </text>
        <text className="place-sub" x="854" y="478">
          Pounds, shelters &amp; rescues
        </text>
      </g>
    </g>
  )
}

export default function TwoCounts() {
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

  const scene = sceneFromProgress(progress)
  const model =
    scene.numbers === 'model-trap'
      ? YEAR10.trap
      : scene.numbers === 'model-ster'
        ? YEAR10.sterilise
        : null
  const wrapClass = [
    'two-counts',
    scene.method === 1 ? 'is-method-one' : '',
    scene.method === 2 || scene.resetBanner > 0.35 ? 'is-method-two' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Experiment number="01f" title="Two counts">
      <div className={wrapClass}>
        <div className="tc-scrolly" ref={trackRef}>
          <div className="tc-stage">
            <p className="tc-chapter">{scene.methodTag}</p>

            <div className={`tc-methods ${scene.method > 0 || scene.resetBanner > 0 ? 'is-on' : ''}`}>
              <span className={scene.method === 1 ? 'is-current' : undefined}>1 Catch and take away</span>
              <span className={scene.method === 2 ? 'is-current' : undefined}>2 Desex and send home</span>
            </div>

            <div className={`tc-meters ${scene.metersOn > 0.2 ? 'is-on' : ''} ${model ? 'is-indexed' : ''}`}>
              <div>
                <p className="tc-meter-kicker">On the street</p>
                <p className="tc-meter-sub">Cats still living here</p>
                {model ? (
                  <>
                    <strong>{model.population}</strong>
                    <span className="tc-meter-unit">after 10 years, if what we do now is 100</span>
                    <IndexBar value={model.population} />
                  </>
                ) : (
                  <span className="tc-meter-watch">Watch the picture. It is a story, not a real count.</span>
                )}
              </div>
              <div>
                <p className="tc-meter-kicker">Through the door</p>
                <p className="tc-meter-sub">Cats arriving at pounds and shelters this year</p>
                {model ? (
                  <>
                    <strong>{model.enteringCare}</strong>
                    <span className="tc-meter-unit">after 10 years, if what we do now is 100</span>
                    <IndexBar value={model.enteringCare} />
                  </>
                ) : (
                  <span className="tc-meter-watch">Watch the picture. It is a story, not a real count.</span>
                )}
              </div>
            </div>

            <svg className="tc-svg" viewBox="0 0 1040 540" aria-label="Street and pound door">
              <Neighbourhood
                doorOn={scene.doorOn}
                clinicOn={scene.clinicOn}
                vacancyOn={scene.vacancyOn}
              />
              {scene.actors.map((actor, i) => (
                <CatMark key={`${scene.mode}-${i}`} actor={actor} />
              ))}
              {scene.clinicOn > 0.4 ? (
                <circle className="clinic-dot" cx={CLINIC.x} cy={CLINIC.y} r="3" opacity={scene.clinicOn} />
              ) : null}
            </svg>

            <div className={`tc-reset ${scene.resetBanner > 0.05 ? 'is-on' : ''}`} style={{ opacity: scene.resetBanner }}>
              <p className="tc-reset-kicker">Not catch and take away</p>
              <p>A different way</p>
              <p className="tc-reset-sub">Desex the cat, then send it home</p>
            </div>

            {scene.compareOn ? (
              <div className="tc-compare">
                <p>
                  Catch twice as many: {YEAR10.trap.population} on the street, {YEAR10.trap.enteringCare} through
                  the door.
                </p>
                <p>
                  Desex and send home: {YEAR10.sterilise.population} on the street, {YEAR10.sterilise.enteringCare}{' '}
                  through the door.
                </p>
              </div>
            ) : null}

            <p className="tc-note">{scene.note}</p>
          </div>

          <div className="tc-steps">
            {STEPS.map((item) => (
              <section key={item.id} className="tc-step" style={{ minHeight: `${item.height}vh` }}>
                <p className="tc-caption">{item.caption}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Experiment>
  )
}
