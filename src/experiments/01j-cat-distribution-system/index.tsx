import { useEffect, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import { PLAY_MS, maxBeat, simulate, type Mode } from './system.ts'
import './cat-distribution.css'

export default function CatDistributionSystem() {
  const [mode, setMode] = useState<Mode>('none')
  const [beat, setBeat] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [snap, setSnap] = useState(false)

  const last = maxBeat(mode)
  const scene = simulate(beat, mode)

  useEffect(() => {
    if (!playing) return
    if (beat >= last) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => setBeat((value) => value + 1), PLAY_MS)
    return () => window.clearTimeout(id)
  }, [playing, beat, last])

  useEffect(() => {
    if (!snap) return
    const id = window.requestAnimationFrame(() => setSnap(false))
    return () => window.cancelAnimationFrame(id)
  }, [snap])

  function restart(nextMode = mode) {
    setMode(nextMode)
    setSnap(true)
    setBeat(0)
    setPlaying(false)
  }

  function step() {
    setPlaying(false)
    if (beat >= last) {
      restart()
      return
    }
    setBeat((value) => value + 1)
  }

  function togglePlay() {
    if (beat >= last) {
      setSnap(true)
      setBeat(0)
      setPlaying(true)
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
    <Experiment number="01j" title="The Cat Distribution System">
      <div className={`cat-distribution ${snap ? 'is-snap' : ''}`}>
        <p className="cds-note">
          The Cat Distribution System isn’t magic. Cats make more cats.
          <span>Illustrative timing — not the research model.</span>
        </p>

        <div
          className="cds-stage"
          role="img"
          aria-label="One breeding pair produces litters that travel down into the community"
        >
          <p className="cds-title">The Cat Distribution System</p>

          <div className="cds-world">
            <span
              className="cds-pair-mark is-on"
              style={{ left: `${scene.plusX}%`, top: `${scene.plusY}%` }}
              aria-hidden
            >
              +
            </span>

            <div className="cds-boundary">
              <span>Community</span>
            </div>

            {scene.ghosts.map((ghost) => (
              <span
                key={ghost.id}
                className="cds-ghost is-on"
                style={{ left: `${ghost.x}%`, top: `${ghost.y}%` }}
                aria-hidden
              >
                🐈
              </span>
            ))}

            {scene.cats.map((cat) => {
              if (!cat.born || cat.gone) return null
              return (
                <span
                  key={cat.id}
                  className={[
                    'cds-cat',
                    'is-in',
                    cat.kitten ? 'is-kitten' : '',
                    cat.nesting ? 'is-nesting' : '',
                    cat.inCommunity ? 'is-settled' : '',
                    cat.desexed ? 'is-desexed' : '',
                    cat.exiting ? 'is-exiting' : '',
                    cat.focus ? 'is-focus' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
                  aria-hidden
                >
                  🐈
                </span>
              )
            })}

            <p className={`cds-trap-cue ${scene.trapCue ? 'is-on' : ''}`}>Trapped → Impounded</p>
          </div>
        </div>

        <div className="cds-controls">
          <div className="cds-modes">
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
          <div className="cds-transport">
            <button type="button" onClick={step}>
              {beat >= last ? 'Again' : 'Next'}
            </button>
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
