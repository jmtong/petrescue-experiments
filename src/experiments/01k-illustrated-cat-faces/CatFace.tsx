import { useRef, type ReactNode } from 'react'
import type { Cat } from './cat-generator.ts'
import {
  FRAME,
  clamp,
  closedSpline,
  dist,
  lerp,
  n,
  project,
  quad,
  tiltAt,
  type Projected,
  type Rotation,
  type Vec3,
} from './cat-projection.ts'

type CatFaceProps = {
  cat: Cat
  yaw?: number
  pitch?: number
  roll?: number
  /** Called while dragging horizontally; degrees. */
  onYawDrag?: (yaw: number) => void
}

function J(cat: Cat, i: number) {
  return cat.jitter[i % cat.jitter.length]
}

function placed(
  p: Projected,
  tilt: number,
  squashX: number,
  children: ReactNode,
) {
  return (
    <g
      transform={`translate(${n(p.x)} ${n(p.y)}) rotate(${n(tilt)}) scale(${n(p.scale * squashX)} ${n(p.scale)})`}
      opacity={lerp(0.42, 1, p.facing)}
    >
      {children}
    </g>
  )
}

function headContour(cat: Cat, rot: Rotation) {
  const points: { x: number; y: number }[] = []
  const steps = 12
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2 - Math.PI / 2
    const wobble = 1 + J(cat, i) * 0.09
    const side = Math.abs(Math.cos(a))
    const x = Math.cos(a) * cat.head.rx * wobble * (0.94 + cat.traits.cheekWidth * 0.06 * side)
    const y = Math.sin(a) * cat.head.ry * wobble
    const z = 0.18 + side * 0.32 * cat.traits.cheekWidth
    const p = project({ x, y, z }, rot)
    points.push(p)
  }
  return closedSpline(points)
}

function tuftTicks(origin: Projected, count: number, cat: Cat, start: number) {
  const ticks = []
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + (i - (count - 1) / 2) * 0.38 + J(cat, start + i) * 0.12
    const len = 6 + J(cat, start + 8 + i) * 2.2
    ticks.push(
      <path
        key={i}
        d={`M 0 0 Q ${n(Math.cos(a) * len * 0.4 + J(cat, start + i) * 1.2)} ${n(Math.sin(a) * len * 0.35)} ${n(Math.cos(a) * len)} ${n(Math.sin(a) * len)}`}
        fill="none"
      />,
    )
  }
  return (
    <g
      transform={`translate(${n(origin.x)} ${n(origin.y)})`}
      strokeWidth={1.05}
      fill="none"
    >
      {ticks}
    </g>
  )
}

function Ear({
  cat,
  base,
  tip,
  rot,
  side,
}: {
  cat: Cat
  base: Vec3
  tip: Vec3
  rot: Rotation
  side: 'left' | 'right'
}) {
  const b = project(base, rot)
  const t = project(tip, rot)
  const h = Math.max(14, dist(b, t))
  const w = cat.ear.width * FRAME.radius * b.scale * 1.05
  const angle = (Math.atan2(t.y - b.y, t.x - b.x) * 180) / Math.PI + 90
  const k = side === 'left' ? 12 : 16
  const lean = J(cat, k) * 3
  const inner = `M ${n(-w * 0.28)} ${n(-h * 0.08)} Q ${n(J(cat, k + 1) * 2.4)} ${n(-h * 0.38)} ${n(J(cat, k + 1) * 2)} ${n(-h * 0.62)} Q ${n(w * 0.12)} ${n(-h * 0.28)} ${n(w * 0.28)} ${n(-h * 0.08)} Q ${n(lean)} ${n(-h * 0.02)} ${n(-w * 0.28)} ${n(-h * 0.08)} Z`
  const outer = `M ${n(-w * 0.52 + J(cat, k) * 1.4)} ${n(h * 0.08)} Q ${n(-w * 0.22)} ${n(-h * 0.42)} ${n(lean)} ${n(-h)} Q ${n(w * 0.2)} ${n(-h * 0.4)} ${n(w * 0.52 + J(cat, k + 2) * 1.4)} ${n(h * 0.1)} Q ${n(J(cat, k + 3) * 2.2)} ${n(h * 0.24)} ${n(-w * 0.52 + J(cat, k) * 1.4)} ${n(h * 0.08)} Z`

  return (
    <g
      transform={`translate(${n(b.x)} ${n(b.y)}) rotate(${n(angle)})`}
      opacity={lerp(0.55, 1, b.facing)}
    >
      <path d={outer} className="icf-fill" />
      <path d={inner} fill="#e7cfc4" stroke="none" opacity={lerp(0.35, 0.9, b.facing)} />
      <path d={outer} fill="none" />
    </g>
  )
}

function Eye({
  cat,
  anchor,
  pupil,
  rot,
  side,
}: {
  cat: Cat
  anchor: Vec3
  pupil: Vec3
  rot: Rotation
  side: 'left' | 'right'
}) {
  const p = project(anchor, rot)
  if (p.facing < 0.16) return null
  const pupilP = project(pupil, rot)
  const tilt = tiltAt(anchor, rot)
  const squash = lerp(0.48, 1, p.facing)
  const style = cat.traits.eyes
  const k = side === 'left' ? 18 : 22
  const rx =
    style === 'wide' ? 13.5 : style === 'sleepy' ? 12.2 : style === 'almond' ? 12 : 10.2
  const ry =
    style === 'wide' ? 12 : style === 'sleepy' ? 4.6 : style === 'almond' ? 7.2 : 9.4
  const pr = style === 'wide' ? 3.4 : style === 'sleepy' ? 2.2 : 3.8 + J(cat, k + 1) * 0.4
  const outlinePts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    const j = 1 + J(cat, k + i) * 0.1
    const almond = style === 'almond' ? 1 + Math.abs(Math.cos(a)) * 0.18 : 1
    return {
      x: Math.cos(a) * rx * j * almond,
      y: Math.sin(a) * ry * j,
    }
  })

  return (
    <g>
      {placed(
        p,
        tilt,
        squash,
        <>
          <path d={closedSpline(outlinePts)} className="icf-eye-fill" />
          {style === 'sleepy' && (
            <path
              d={`M ${n(-rx)} ${n(-0.8)} Q ${n(J(cat, k) * 1.6)} ${n(-ry - 1.5 + J(cat, k) * 0.8)} ${n(rx)} ${n(-0.4)}`}
              fill="none"
              strokeWidth={1.7}
            />
          )}
        </>,
      )}
      <ellipse
        cx={n(pupilP.x + J(cat, k + 2) * 0.4)}
        cy={n(pupilP.y + (style === 'sleepy' ? 0.6 : 0))}
        rx={n(pr * pupilP.scale * squash)}
        ry={n((style === 'sleepy' ? pr * 0.55 : pr) * pupilP.scale)}
        fill={cat.ink}
        stroke="none"
        opacity={lerp(0.55, 1, pupilP.facing)}
      />
    </g>
  )
}

function Markings({ cat, rot }: { cat: Cat; rot: Rotation }) {
  const { marking, patchSide } = cat.traits
  if (marking === 'none') return null

  const ink = cat.ink
  const forehead = project(cat.anchors.forehead, rot)
  const nose = project(cat.anchors.nose, rot)
  const patchAnchor = patchSide === 'left' ? cat.anchors.leftEye : cat.anchors.rightEye
  const patch = project(patchAnchor, rot)
  const tilt = tiltAt(cat.anchors.forehead, rot)

  if (marking === 'forehead-stripe') {
    return placed(
      forehead,
      tilt,
      1,
      <path
        d={`M ${n(J(cat, 0) * 1.5)} ${n(-16)} Q ${n(2 + J(cat, 1) * 3)} ${n(-2)} ${n(J(cat, 2) * 1.2)} ${n(14)}`}
        fill="none"
        stroke={ink}
        strokeWidth={2.4}
        opacity={0.8}
      />,
    )
  }

  if (marking === 'one-eye-patch') {
    const blob = [
      { x: -16, y: -12 },
      { x: 4, y: -14 },
      { x: 15, y: -2 },
      { x: 10, y: 12 },
      { x: -8, y: 14 },
      { x: -18, y: 2 },
    ].map((pt, i) => ({
      x: pt.x + J(cat, i) * 2.2,
      y: pt.y + J(cat, i + 3) * 2.2,
    }))
    return placed(
      patch,
      tiltAt(patchAnchor, rot),
      lerp(0.7, 1, patch.facing),
      <path d={closedSpline(blob)} fill={ink} opacity={0.16} stroke="none" />,
    )
  }

  if (marking === 'nose-patch') {
    return placed(
      nose,
      tiltAt(cat.anchors.nose, rot),
      1,
      <ellipse
        cx={J(cat, 3)}
        cy={n(-6)}
        rx={n(7 + J(cat, 4) * 1.5)}
        ry={n(9 + J(cat, 5) * 1.4)}
        fill={ink}
        opacity={0.14}
        stroke="none"
      />,
    )
  }

  if (marking === 'tabby') {
    const m = `M ${n(-11)} ${n(-4)} Q ${n(-6 + J(cat, 2))} ${n(-16)} ${n(-1)} ${n(-5)} Q 0 ${n(-18 + J(cat, 3) * 2)} ${n(1)} ${n(-5)} Q ${n(6 + J(cat, 4))} ${n(-16)} ${n(11)} ${n(-4)}`
    const cheek = (side: number, anchor: Vec3) => {
      const p = project(anchor, rot)
      return (
        <g
          key={side}
          transform={`translate(${n(p.x)} ${n(p.y)}) rotate(${n(tiltAt(anchor, rot))})`}
          opacity={lerp(0.3, 0.75, p.facing)}
        >
          <path
            d={`M ${n(side * 12)} ${n(-2)} Q ${n(side * 22)} ${n(4 + J(cat, 6) * 2)} ${n(side * 18)} ${n(12)}`}
            fill="none"
            strokeWidth={1.5}
          />
          <path
            d={`M ${n(side * 11)} ${n(4)} Q ${n(side * 20)} ${n(10)} ${n(side * 16)} ${n(16)}`}
            fill="none"
            strokeWidth={1.25}
          />
        </g>
      )
    }
    return (
      <g>
        {placed(
          forehead,
          tilt,
          1,
          <path d={m} fill="none" strokeWidth={1.8} />,
        )}
        {cheek(-1, cat.anchors.leftEye)}
        {cheek(1, cat.anchors.rightEye)}
      </g>
    )
  }

  const muzzle = project(cat.anchors.muzzle, rot)
  const chin = project(cat.anchors.chin, rot)
  const bib = closedSpline([
    { x: muzzle.x - 22 * cat.traits.muzzleWidth, y: muzzle.y - 4 },
    { x: muzzle.x + 22 * cat.traits.muzzleWidth, y: muzzle.y - 4 },
    { x: chin.x + 16, y: chin.y + 4 },
    { x: chin.x - 16, y: chin.y + 4 },
  ].map((pt, i) => ({ x: pt.x + J(cat, i) * 2, y: pt.y + J(cat, i + 4) * 1.5 })))

  return <path d={bib} fill="#fbf7f0" stroke="none" opacity={0.92} />
}

function Muzzle({ cat, rot }: { cat: Cat; rot: Rotation }) {
  const p = project(cat.anchors.muzzle, rot)
  const tilt = tiltAt(cat.anchors.muzzle, rot)
  const w = 16 * cat.traits.muzzleWidth
  const left = `M 0 ${n(2)} Q ${n(-w * 0.2)} ${n(-4 + J(cat, 14) * 1.5)} ${n(-w)} ${n(3)} Q ${n(-w * 0.55)} ${n(12 + J(cat, 15) * 2)} 0 ${n(6)} Z`
  const right = `M 0 ${n(2)} Q ${n(w * 0.2)} ${n(-4 + J(cat, 16) * 1.5)} ${n(w)} ${n(3)} Q ${n(w * 0.55)} ${n(12 + J(cat, 17) * 2)} 0 ${n(6)} Z`
  return placed(
    p,
    tilt,
    lerp(0.72, 1, p.facing),
    <g className="icf-muzzle" opacity={0.95}>
      <path d={left} />
      <path d={right} />
    </g>,
  )
}

function Nose({ cat, rot }: { cat: Cat; rot: Rotation }) {
  const p = project(cat.anchors.nose, rot)
  const tilt = tiltAt(cat.anchors.nose, rot)
  const s = 5.2 * cat.traits.noseSize
  const d = `M ${n(-s)} ${n(-s * 0.15)} Q ${n(J(cat, 20) * 1.2)} ${n(-s * 0.85)} ${n(s)} ${n(-s * 0.15)} Q ${n(s * 0.55)} ${n(s * 0.7)} 0 ${n(s * 0.85)} Q ${n(-s * 0.55)} ${n(s * 0.7)} ${n(-s)} ${n(-s * 0.15)} Z`
  return placed(
    p,
    tilt,
    1,
    <>
      <path d={d} fill="#c9897c" />
      <path
        d={`M 0 ${n(s * 0.1)} L 0 ${n(s * 0.85)}`}
        fill="none"
        strokeWidth={1.05}
        opacity={0.55}
      />
    </>,
  )
}

function Mouth({ cat, rot }: { cat: Cat; rot: Rotation }) {
  const p = project(cat.anchors.mouth, rot)
  const tilt = tiltAt(cat.anchors.mouth, rot)
  const w = 5.5 * cat.traits.muzzleWidth
  const style = cat.traits.mouth
  const d =
    style === 'flat'
      ? `M ${n(-w)} 0 Q 0 ${n(1.2 + J(cat, 21))} ${n(w)} 0`
      : style === 'tiny'
        ? `M ${n(-3.2)} 0 Q 0 ${n(3.4)} ${n(3.2)} 0`
        : `M ${n(-w)} ${n(-1)} Q ${n(-w * 0.45)} ${n(4.5 + J(cat, 21))} 0 0 Q ${n(w * 0.45)} ${n(4.5 + J(cat, 22))} ${n(w)} ${n(-1)}`
  return placed(p, tilt, 1, <path d={d} fill="none" strokeWidth={1.45} />)
}

function Whiskers({ cat, rot }: { cat: Cat; rot: Rotation }) {
  const rows = [-0.12, 0.02, 0.16]
  const sides: Array<-1 | 1> = [-1, 1]
  return (
    <g fill="none" strokeWidth={1.15}>
      {sides.flatMap((side) => {
        const rootAnchor = side < 0 ? cat.anchors.leftWhisker : cat.anchors.rightWhisker
        const root = project(rootAnchor, rot)
        return rows.map((dy, i) => {
          const tip = project(
            {
              x: rootAnchor.x + side * (0.42 + i * 0.05) * cat.traits.muzzleWidth,
              y: rootAnchor.y + dy + J(cat, 24 + i) * 0.03,
              z: rootAnchor.z - 0.08 - i * 0.03,
            },
            rot,
          )
          const sag = (root.y + tip.y) / 2 + 4 * dy + J(cat, 26 + i) * 2.5
          const midX = (root.x + tip.x) / 2 + side * J(cat, 28 + i) * 3
          return (
            <path
              key={`${side}-${i}`}
              d={quad(root, { x: midX, y: sag }, tip)}
              opacity={lerp(0.35, 0.85, root.facing)}
            />
          )
        })
      })}
    </g>
  )
}

function Fur({ cat, rot }: { cat: Cat; rot: Rotation }) {
  if (cat.traits.fur === 'smooth') return null
  const cheekL = project(
    { x: -cat.head.rx * 0.82, y: 0.12, z: 0.4 },
    rot,
  )
  const cheekR = project({ x: cat.head.rx * 0.82, y: 0.12, z: 0.4 }, rot)
  const chin = project(cat.anchors.chin, rot)
  const extra = cat.traits.fur === 'fluffy'
  return (
    <g>
      {tuftTicks(cheekL, extra ? 4 : 3, cat, 0)}
      {tuftTicks(cheekR, extra ? 4 : 3, cat, 4)}
      {tuftTicks(chin, extra ? 5 : 2, cat, 8)}
      {extra &&
        tuftTicks(project({ x: 0, y: -cat.head.ry * 0.92, z: 0.28 }, rot), 3, cat, 12)}
    </g>
  )
}

export function CatFace({
  cat,
  yaw = 0,
  pitch = 0,
  roll = 0,
  onYawDrag,
}: CatFaceProps) {
  const drag = useRef<{ x: number; yaw: number } | null>(null)
  const rot: Rotation = { yaw, pitch, roll }
  const leftEarZ = project(cat.anchors.leftEar, rot).z
  const rightEarZ = project(cat.anchors.rightEar, rot).z
  const farLeft = leftEarZ <= rightEarZ
  const leftEyeZ = project(cat.anchors.leftEye, rot).z
  const farLeftEye = leftEyeZ <= project(cat.anchors.rightEye, rot).z
  const contour = headContour(cat, rot)
  const tuxedo = cat.traits.marking === 'tuxedo'

  const farEar = farLeft ? (
    <Ear cat={cat} base={cat.anchors.leftEar} tip={cat.anchors.leftEarTip} rot={rot} side="left" />
  ) : (
    <Ear cat={cat} base={cat.anchors.rightEar} tip={cat.anchors.rightEarTip} rot={rot} side="right" />
  )
  const nearEar = farLeft ? (
    <Ear cat={cat} base={cat.anchors.rightEar} tip={cat.anchors.rightEarTip} rot={rot} side="right" />
  ) : (
    <Ear cat={cat} base={cat.anchors.leftEar} tip={cat.anchors.leftEarTip} rot={rot} side="left" />
  )
  const farEye = farLeftEye ? (
    <Eye cat={cat} anchor={cat.anchors.leftEye} pupil={cat.anchors.leftPupil} rot={rot} side="left" />
  ) : (
    <Eye cat={cat} anchor={cat.anchors.rightEye} pupil={cat.anchors.rightPupil} rot={rot} side="right" />
  )
  const nearEye = farLeftEye ? (
    <Eye cat={cat} anchor={cat.anchors.rightEye} pupil={cat.anchors.rightPupil} rot={rot} side="right" />
  ) : (
    <Eye cat={cat} anchor={cat.anchors.leftEye} pupil={cat.anchors.leftPupil} rot={rot} side="left" />
  )

  return (
    <svg
      className={`icf-svg${onYawDrag ? ' is-drag' : ''}`}
      viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
      role="img"
      aria-label="Illustrated cat face"
      onPointerDown={
        onYawDrag
          ? (event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              drag.current = { x: event.clientX, yaw }
            }
          : undefined
      }
      onPointerMove={
        onYawDrag
          ? (event) => {
              if (!drag.current) return
              onYawDrag(
                clamp(drag.current.yaw + (event.clientX - drag.current.x) * 0.28, -55, 55),
              )
            }
          : undefined
      }
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
    >
      <g
        fill="none"
        stroke={cat.ink}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {farEar}
        <path d={contour} className={`icf-fill${tuxedo ? ' is-tuxedo' : ''}`} />
        <path d={contour} fill="none" />
        <Fur cat={cat} rot={rot} />
        <Markings cat={cat} rot={rot} />
        {farEye}
        <Muzzle cat={cat} rot={rot} />
        <Nose cat={cat} rot={rot} />
        <Mouth cat={cat} rot={rot} />
        <Whiskers cat={cat} rot={rot} />
        {nearEye}
        {nearEar}
      </g>
    </svg>
  )
}
