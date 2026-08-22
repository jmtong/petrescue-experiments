export type CatLook = {
  bodyRx: number
  bodyRy: number
  headR: number
  earH: number
  earSpread: number
  earWide: number
  tail: string
  sit: boolean
  mark: 'none' | 'stripe' | 'patch' | 'bib'
  lean: number
}

/** Twelve small 2D looks. Seeded by `look` index — never regenerated on scroll. */
export const LOOKS: CatLook[] = [
  { bodyRx: 11.5, bodyRy: 7.4, headR: 6.6, earH: 8.2, earSpread: 5.2, earWide: 4.2, tail: 'M 10 2 C 18 -6 20 10 14 11', sit: true, mark: 'bib', lean: -4 },
  { bodyRx: 12.4, bodyRy: 6.6, headR: 6.1, earH: 9.4, earSpread: 5.8, earWide: 3.4, tail: 'M 11 1 C 22 4 16 14 10 10', sit: false, mark: 'stripe', lean: 6 },
  { bodyRx: 10.2, bodyRy: 7.8, headR: 7.1, earH: 6.4, earSpread: 6.4, earWide: 5.2, tail: 'M 9 3 C 16 12 8 14 6 8', sit: true, mark: 'none', lean: -8 },
  { bodyRx: 11.8, bodyRy: 6.2, headR: 5.8, earH: 8.8, earSpread: 4.6, earWide: 3.6, tail: 'M 11 0 C 20 -8 22 6 13 8', sit: false, mark: 'patch', lean: 10 },
  { bodyRx: 13, bodyRy: 7, headR: 6.4, earH: 7.2, earSpread: 5.6, earWide: 4.6, tail: 'M 12 2 C 19 8 12 14 8 9', sit: false, mark: 'none', lean: -2 },
  { bodyRx: 10.6, bodyRy: 6.8, headR: 6.8, earH: 9.8, earSpread: 6.2, earWide: 3.2, tail: 'M 10 1 C 18 -2 21 9 13 10', sit: true, mark: 'stripe', lean: 4 },
  { bodyRx: 12.2, bodyRy: 7.6, headR: 5.9, earH: 7.6, earSpread: 4.8, earWide: 4.8, tail: 'M 11 3 C 17 11 9 13 7 7', sit: false, mark: 'bib', lean: -12 },
  { bodyRx: 11, bodyRy: 6.4, headR: 6.2, earH: 8.6, earSpread: 5.4, earWide: 3.8, tail: 'M 10 0 C 21 2 18 12 11 9', sit: true, mark: 'patch', lean: 8 },
  { bodyRx: 10.8, bodyRy: 7.2, headR: 6.9, earH: 6.8, earSpread: 5, earWide: 4.4, tail: 'M 9 2 C 15 -6 19 7 12 8', sit: false, mark: 'none', lean: 0 },
  { bodyRx: 12.8, bodyRy: 6.8, headR: 6, earH: 9.2, earSpread: 6, earWide: 3.5, tail: 'M 12 1 C 20 10 13 14 9 8', sit: false, mark: 'stripe', lean: -6 },
  { bodyRx: 11.4, bodyRy: 8, headR: 7.2, earH: 7.8, earSpread: 6.6, earWide: 5, tail: 'M 10 4 C 14 12 6 12 5 7', sit: true, mark: 'none', lean: 12 },
  { bodyRx: 10.4, bodyRy: 6.2, headR: 5.7, earH: 8, earSpread: 4.4, earWide: 3.2, tail: 'M 10 0 C 19 -4 22 8 14 9', sit: false, mark: 'patch', lean: 3 },
]

const PAPER = '#f6f1e8'
const ACCENT = '#b44a2a'

export function CatMark({
  look,
  desexed,
  kitten,
  progenitor,
}: {
  look: number
  desexed?: boolean
  kitten?: boolean
  progenitor?: boolean
}) {
  const L = LOOKS[look % LOOKS.length]
  const s = (kitten ? 0.7 : 1) * (progenitor ? 1.12 : 1)
  const headY = L.sit ? -6.2 : -7.4
  const bodyY = L.sit ? 3.4 : 2.2
  const ink = progenitor ? '#1a1714' : '#231c16'

  const fill = desexed ? PAPER : ink
  const strokeW = desexed ? 1.9 : 1.15
  const eyeFill = desexed ? ink : PAPER

  // Desexed cats carry the field ear-tip: the left ear is cropped flat and capped.
  const tipY = headY - L.earH * 0.62
  const leftEar = desexed
    ? `M ${-L.earSpread} ${headY} L ${-L.earSpread - L.earWide * 0.1} ${tipY} L ${-L.earSpread + L.earWide * 0.42} ${tipY} L ${-L.earSpread + L.earWide * 0.7} ${headY - 1.4} Z`
    : `M ${-L.earSpread} ${headY} L ${-L.earSpread - L.earWide * 0.15} ${headY - L.earH} L ${-L.earSpread + L.earWide * 0.7} ${headY - 1.4} Z`

  return (
    <g
      className={`wd-cat${desexed ? ' is-desexed' : ''}${progenitor ? ' is-mae' : ''}`}
      transform={`rotate(${L.lean}) scale(${s})`}
      fill={fill}
      stroke={ink}
      strokeWidth={strokeW}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path className="wd-tail" d={L.tail} fill="none" />
      <ellipse className="wd-body" cx={0} cy={bodyY} rx={L.bodyRx} ry={L.bodyRy} />
      {!desexed && L.mark === 'bib' ? (
        <ellipse cx={1.4} cy={bodyY + 1.2} rx={L.bodyRx * 0.42} ry={L.bodyRy * 0.55} fill={PAPER} stroke="none" />
      ) : null}
      {!desexed && L.mark === 'stripe' ? (
        <path
          d={`M ${-L.bodyRx * 0.2} ${bodyY - 3} Q 0 ${bodyY + 4} ${L.bodyRx * 0.15} ${bodyY - 2}`}
          fill="none"
          stroke={PAPER}
          strokeWidth={1.4}
          opacity={0.7}
        />
      ) : null}
      {!desexed && L.mark === 'patch' ? (
        <ellipse cx={-L.bodyRx * 0.35} cy={bodyY - 1} rx={3.2} ry={2.6} fill={PAPER} stroke="none" opacity={0.85} />
      ) : null}
      <path className="wd-ear" d={leftEar} />
      <path
        className="wd-ear"
        d={`M ${L.earSpread - 1} ${headY - 0.4} L ${L.earSpread + L.earWide * 0.35} ${headY - L.earH * 0.92} L ${L.earSpread + L.earWide * 0.9} ${headY + 0.6} Z`}
      />
      <circle className="wd-head" cx={0.6} cy={headY} r={L.headR} />
      <circle cx={-1.4} cy={headY - 0.6} r={0.95} fill={eyeFill} stroke="none" />
      <circle cx={3.2} cy={headY - 0.6} r={0.95} fill={eyeFill} stroke="none" />
      {desexed ? (
        <path
          className="wd-ear-tip"
          d={`M ${-L.earSpread - L.earWide * 0.1} ${tipY} L ${-L.earSpread + L.earWide * 0.42} ${tipY}`}
          stroke={ACCENT}
          strokeWidth={2.6}
          fill="none"
        />
      ) : null}
    </g>
  )
}
