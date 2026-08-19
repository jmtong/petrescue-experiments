import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import { Neighbourhood } from './Neighbourhood.tsx'
import { STEPS, clamp, sceneFromProgress } from './scene.ts'
import './learn-then-compare.css'

const YEAR_TICKS = [0, 1, 5, 10]

function readProgress(el: HTMLElement) {
  const total = el.offsetHeight - window.innerHeight
  if (total <= 0) return 0
  return clamp(-el.getBoundingClientRect().top / total)
}

function YearTimeline({ yearAt }: { yearAt: number }) {
  const t = clamp(yearAt / 10)
  return (
    <div className="ltc-timeline" aria-label={`Year ${Math.round(yearAt)} of 10`}>
      <p className="ltc-timeline-kicker">Ten years</p>
      <div className="ltc-timeline-track">
        <div className="ltc-timeline-fill" style={{ width: `${t * 100}%` }} />
        <div className="ltc-timeline-play" style={{ left: `${t * 100}%` }} />
        {YEAR_TICKS.map((tick) => (
          <span
            key={tick}
            className={`ltc-timeline-tick ${yearAt >= tick - 0.15 ? 'is-on' : ''}`}
            style={{ left: `${(tick / 10) * 100}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LearnThenCompare() {
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

  return (
    <Experiment number="01c" title="Learn then compare">
      <div className="learn-then-compare">
        <div className="ltc-scrolly" ref={trackRef}>
          <div className="ltc-stage">
            <header className="ltc-chrome">
              <p className="ltc-chapter">{scene.step.chapter}</p>
              {scene.yearAt !== null ? <YearTimeline yearAt={scene.yearAt} /> : null}
            </header>

            <div className="ltc-visual">
              <Neighbourhood scene={scene} />
            </div>

            <div className="ltc-copy">
              <p className="ltc-caption">{scene.step.caption}</p>
              {scene.dataOn ? (
                <div className="ltc-plain">
                  <p>
                    <strong>Doubled trapping.</strong> 61% lower free-living
                    population than current practice, but only 1% fewer cats
                    entering care.
                  </p>
                  <p>
                    <strong>Sterilisation — 5 cats per 1,000 residents/year.</strong>{' '}
                    35% lower free-living population, and 75% fewer cats entering
                    care.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="ltc-steps">
            {STEPS.map((item) => (
              <section key={item.id} className="ltc-step" aria-label={item.caption} />
            ))}
          </div>
        </div>
      </div>
    </Experiment>
  )
}
