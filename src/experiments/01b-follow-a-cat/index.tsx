import { useEffect, useRef, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import { beats } from './beats.ts'
import { Neighbourhood } from './Neighbourhood.tsx'
import { sceneFromBeat } from './scene.ts'
import './follow-a-cat.css'

export default function FollowACat() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.62
      let best = 0
      let bestDist = Infinity
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        const box = el.getBoundingClientRect()
        const center = box.top + box.height * 0.72
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const beat = beats[active] ?? beats[0]
  const scene = sceneFromBeat(beat.id)

  return (
    <Experiment number="01b" title="Follow a cat">
      <div className="follow-a-cat">
        <section className="follow-open">
          <p className="kicker">A disposable prototype</p>
          <h2>Follow one cat, then the numbers.</h2>
          <p>
            Two interventions, told as a street-level story. The 10-year model
            waits until the last chapter.
          </p>
          <p className="hint">Scroll</p>
        </section>

        <div className="follow-scrolly">
          <div className="follow-stage">
            <p className="follow-stage-label">{beat.chapter}</p>
            <Neighbourhood scene={scene} />
            <aside
              className={`follow-stats ${scene.stats !== 'off' ? 'is-on' : ''}`}
              aria-hidden={scene.stats === 'off'}
            >
              <p className="stat-kicker">Ten years out</p>
              <p className={`stat ${scene.stats !== 'off' ? 'is-on' : ''}`}>
                Current practice = 100
              </p>
              <p className={`stat ${scene.stats === 'trap' || scene.stats === 'both' ? 'is-on' : ''}`}>
                Double trapping
                <span className="nums">population 39, intake 99</span>
              </p>
              <p className={`stat ${scene.stats === 'both' ? 'is-on' : ''}`}>
                Sterilisation 5/1,000/year
                <span className="nums">population 65, intake 25</span>
              </p>
            </aside>
          </div>

          <div className="follow-steps">
            {beats.map((item, i) => (
              <section
                key={item.id}
                className="follow-step"
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
              >
                <p className="follow-caption">{item.caption}</p>
              </section>
            ))}
          </div>
        </div>

        <section className="follow-close">
          <p>
            A sketch to test whether one animal’s path makes the population
            indices easier to hold.
          </p>
        </section>
      </div>
    </Experiment>
  )
}
