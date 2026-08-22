import { useMemo, useState } from 'react'
import { Experiment } from '../../components/Experiment.tsx'
import { CatFace } from './CatFace.tsx'
import { generateCat, generateGallery, type Cat } from './cat-generator.ts'
import './styles.css'

const GALLERY_SIZE = 16

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="icf-slider">
      <span>
        {label}
        <em>{Math.round(value)}°</em>
      </span>
      <input
        type="range"
        min={-55}
        max={55}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export default function IllustratedCatFaces() {
  const gallery = useMemo(() => generateGallery(GALLERY_SIZE), [])
  const [cat, setCat] = useState<Cat>(() => gallery[4])
  const [yaw, setYaw] = useState(0)
  const [pitch, setPitch] = useState(0)
  const [roll, setRoll] = useState(0)

  return (
    <Experiment number="01k" title="Illustrated cat faces">
      <div className="icf">
        <p className="icf-note">
          Can a handful of ink-doodle parts make many distinct cats?
          <span>Visual experiment — not the population model.</span>
        </p>

        <div className="icf-layout">
          <section className="icf-main">
            <div className="icf-stage">
              <CatFace
                cat={cat}
                yaw={yaw}
                pitch={pitch}
                roll={roll}
                onYawDrag={setYaw}
              />
            </div>
            <div className="icf-controls">
              <button type="button" className="icf-new" onClick={() => setCat(generateCat())}>
                New cat
              </button>
              <Slider label="Yaw" value={yaw} onChange={setYaw} />
              <Slider label="Pitch" value={pitch} onChange={setPitch} />
              <Slider label="Roll" value={roll} onChange={setRoll} />
            </div>
          </section>

          <section className="icf-gallery" aria-label="Generated cats">
            {gallery.map((item) => (
              <button
                key={item.seed}
                type="button"
                className={item.seed === cat.seed ? 'is-active' : undefined}
                aria-pressed={item.seed === cat.seed}
                aria-label={`Cat ${item.seed}`}
                onClick={() => setCat(item)}
              >
                <CatFace cat={item} />
              </button>
            ))}
          </section>
        </div>
      </div>
    </Experiment>
  )
}
