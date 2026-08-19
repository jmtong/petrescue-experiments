import {
  HOME,
  YEAR10,
  sterActors,
  trapActors,
  type Actor,
  type Scene,
} from './scene.ts'

function CatBody({
  variant,
  sterilised,
}: {
  variant: 'hero' | 'other'
  sterilised: boolean
}) {
  return (
    <g className={`cat-body ${variant} ${sterilised ? 'is-sterilised' : ''}`}>
      <path className="tail" d="M 18 6 C 34 2 36 22 28 24" />
      {sterilised ? (
        <path className="ear" d="M -10 -6 L -18 -22 L -2 -14 Z" />
      ) : (
        <path className="ear" d="M -12 -8 L -16 -26 L -2 -14 Z" />
      )}
      <path className="ear" d="M 4 -10 L 14 -26 L 16 -8 Z" />
      <ellipse className="torso" cx="0" cy="4" rx="22" ry="14" />
      <circle className="head" cx="2" cy="-8" r="12" />
      <circle className="eye" cx="-2" cy="-10" r="1.6" />
      <circle className="eye" cx="7" cy="-10" r="1.6" />
      {sterilised ? <circle className="ear-tip" cx="-14" cy="-18" r="3.2" /> : null}
    </g>
  )
}

function CatMark({ x, y, opacity, sterilised, kitten }: Actor) {
  const s = kitten ? 0.72 : 1
  return (
    <g
      className={sterilised ? 'mark sterilised' : 'mark'}
      transform={`translate(${x} ${y}) scale(${s})`}
      opacity={opacity}
    >
      <polygon points="-3.4,-3.6 -4.1,-9.2 0.6,-4.4" />
      <polygon points="3.4,-3.6 4.1,-9.2 -0.6,-4.4" />
      <circle r="5.4" cy="0.2" />
    </g>
  )
}

function TinyKitten({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`} className="ghost-kitten">
      <path d="M -4 -5 L -5 -11 L 0 -6 Z" />
      <path d="M 1 -6 L 5 -11 L 4 -5 Z" />
      <ellipse cx="0" cy="0" rx="7" ry="4.5" />
    </g>
  )
}

function Houses() {
  return (
    <g className="street-draw">
      <path
        className="ground"
        d="M0 292 C 120 276 210 304 340 288 C 480 270 590 308 720 292 C 840 278 930 300 1000 286 V 620 H 0 Z"
      />
      <path
        className="road"
        d="M -20 454 C 140 430 260 478 430 452 C 590 428 740 470 1020 444"
      />
      <g className="house" transform="translate(36 198)">
        <path d="M8 86 L 18 86 L 28 42 L 86 86 L 96 86 V 148 H 8 Z" />
        <path className="roof" d="M 4 90 L 57 28 L 110 90" />
        <rect className="door" x="44" y="108" width="22" height="40" rx="2" />
        <rect className="pane" x="20" y="108" width="16" height="16" />
      </g>
      <g className="house" transform="translate(168 214)">
        <path d="M10 78 H 108 V 132 H 10 Z" />
        <path className="roof" d="M 2 80 L 59 22 L 116 80" />
        <rect className="door" x="28" y="96" width="18" height="36" rx="2" />
        <rect className="pane" x="62" y="98" width="14" height="14" />
        <rect className="pane" x="82" y="98" width="14" height="14" />
      </g>
      <g className="house" transform="translate(392 188)">
        <path d="M14 92 H 118 V 156 H 14 Z" />
        <path className="roof" d="M 6 96 L 66 18 L 126 96" />
        <rect className="chimney" x="92" y="48" width="14" height="28" />
        <rect className="door" x="34" y="112" width="22" height="44" rx="2" />
        <rect className="pane" x="72" y="116" width="18" height="18" />
      </g>
      <g className="tree" transform="translate(330 250)">
        <rect className="trunk" x="-6" y="48" width="12" height="64" rx="2" />
        <ellipse cx="0" cy="28" rx="38" ry="44" />
        <ellipse cx="-18" cy="40" rx="22" ry="20" />
      </g>
      <g className="tree" transform="translate(70 300)">
        <rect className="trunk" x="-5" y="36" width="10" height="48" rx="2" />
        <ellipse cx="0" cy="20" rx="28" ry="34" />
      </g>
      <g className="bin" transform="translate(300 400)">
        <rect x="0" y="8" width="18" height="26" rx="2" />
        <rect x="-2" y="2" width="22" height="8" rx="2" />
      </g>
    </g>
  )
}

function CompactTown({ dest }: { dest: 'pound' | 'clinic' }) {
  const boxW = dest === 'pound' ? 340 : 252
  return (
    <g>
      <path
        className="ground"
        d="M24 48 C 48 22, 110 14, 168 26 C 230 10, 300 20, 372 34 L 388 208 C 320 226, 240 218, 168 222 C 96 218, 48 208, 20 188 Z"
      />
      <path
        className="road-thin"
        d="M36 128 C 120 108, 180 156, 250 130 C 300 112, 340 146, 372 136"
      />
      <g>
        <polygon className="roof-fill" points="58,78 96,44 134,78" />
        <rect className="wall" x="64" y="78" width="64" height="36" />
      </g>
      <g>
        <polygon className="roof-fill" points="168,56 214,20 260,56" />
        <rect className="wall" x="176" y="56" width="76" height="40" />
      </g>
      <g>
        <polygon className="roof-fill" points="286,86 324,56 362,86" />
        <rect className="wall" x="292" y="86" width="64" height="32" />
      </g>
      <circle className="canopy" cx="46" cy="52" r="16" />
      <circle className="canopy" cx="362" cy="58" r="14" />

      <rect className="pound-box" x="40" y="246" width={boxW} height="84" rx="5" />
      <text className="place-label" x="52" y="264">
        Pounds, shelters &amp; rescues
      </text>
      <text className="place-sub" x="52" y="278">
        cats entering care
      </text>

      {dest === 'clinic' ? (
        <g>
          <rect className="wall" x="308" y="260" width="64" height="44" />
          <polygon className="roof-fill" points="302,260 340,236 378,260" />
          <path className="plus" d="M340 274 v18 M331 283 h18" />
          <text className="place-sub clinic-caption" x="340" y="322">
            Desexing
          </text>
        </g>
      ) : null}
    </g>
  )
}

function StreetScene({ scene }: { scene: Scene }) {
  return (
    <svg
      className="ltc-svg"
      viewBox="0 0 1000 620"
      role="img"
      aria-label="A neighbourhood with one free-living cat"
    >
      <rect className="paper" width="1000" height="620" />
      <Houses />

      <ellipse
        className={`territory ${scene.territoryEmpty ? 'is-empty' : ''}`}
        cx="250"
        cy="430"
        rx="118"
        ry="72"
      />
      <text className="territory-label" x="250" y="518">
        territory
      </text>

      <g className={`pound ${scene.poundHot ? 'is-hot' : ''}`}>
        <text className="pound-label" x="798" y="58">
          Pounds, shelters &amp; rescues
        </text>
        <text className="pound-sub" x="798" y="78">
          cats entering care
        </text>
        <rect x="628" y="92" width="340" height="248" rx="10" />
      </g>

      <g className={`clinic ${scene.clinicOn ? 'is-on' : ''}`}>
        <rect className="wall" x="742" y="430" width="96" height="58" />
        <polygon className="roof-fill" points="734,430 790,392 846,430" />
        <path className="plus" d="M790 448 v22 M779 459 h22" />
        <text className="clinic-label" x="790" y="512">
          Desexing
        </text>
      </g>

      <g
        className="actor replacement"
        opacity={scene.replacement.opacity}
        style={{
          transform: `translate(${scene.replacement.x}px, ${scene.replacement.y}px)`,
        }}
      >
        <CatBody variant="other" sterilised={false} />
      </g>

      {scene.neighbours.map((cat, i) =>
        cat.mark ? (
          <CatMark key={`n-${i}`} {...cat} />
        ) : (
          <g
            key={`n-${i}`}
            className="actor neighbour"
            opacity={cat.opacity}
            style={{ transform: `translate(${cat.x}px, ${cat.y}px) scale(0.72)` }}
          >
            <CatBody variant="other" sterilised={false} />
          </g>
        ),
      )}

      <g
        className="actor hero"
        opacity={scene.hero.opacity}
        style={{ transform: `translate(${scene.hero.x}px, ${scene.hero.y}px)` }}
      >
        <g className={scene.hero.wander ? 'wander' : undefined}>
          <CatBody variant="hero" sterilised={scene.hero.sterilised} />
        </g>
      </g>

      <g
        className={`trap ${scene.trapOn ? 'is-on' : ''} ${scene.trapClosed ? 'is-closed' : ''}`}
        style={{
          transform: `translate(${scene.hero.inCage ? scene.hero.x : HOME.x}px, ${
            scene.hero.inCage ? scene.hero.y : HOME.y
          }px)`,
        }}
      >
        <g className="cage-drop">
          <rect className="cage" x="-34" y="-40" width="68" height="58" rx="4" />
          <line x1="-34" y1="-12" x2="34" y2="-12" />
          <line x1="-34" y1="8" x2="34" y2="8" />
          <line x1="-10" y1="-40" x2="-10" y2="18" />
          <line x1="10" y1="-40" x2="10" y2="18" />
        </g>
      </g>

      <g className={`no-kittens ${scene.noKittens ? 'is-on' : ''}`} transform="translate(248 338)">
        <TinyKitten x={-28} />
        <TinyKitten x={0} />
        <TinyKitten x={28} />
        <line className="strike" x1="-46" y1="4" x2="46" y2="-10" />
      </g>
    </svg>
  )
}

function SplitScene({ scene }: { scene: Scene }) {
  const trap = trapActors(scene.trapStory)
  const ster = sterActors(scene.sterStory)
  return (
    <div className="ltc-split">
      <div className="ltc-panel">
        <p className="ltc-panel-kicker">Trap + remove</p>
        <div className="ltc-fit">
          <svg
            viewBox="0 8 420 332"
            preserveAspectRatio="xMidYMin meet"
            aria-label="Trap and remove over ten years"
          >
            <CompactTown dest="pound" />
            {trap.map((cat, i) => (
              <CatMark key={`t-${i}`} {...cat} />
            ))}
          </svg>
        </div>
        <p className={`ltc-readout ${scene.numbersOn ? 'is-on' : ''}`}>
          {YEAR10.trap.population} still on the street
          <span> · </span>
          {YEAR10.trap.enteringCare} entering care
        </p>
      </div>
      <div className="ltc-split-rule" />
      <div className="ltc-panel">
        <p className="ltc-panel-kicker">Sterilise + return</p>
        <div className="ltc-fit">
          <svg
            viewBox="0 8 420 332"
            preserveAspectRatio="xMidYMin meet"
            aria-label="Sterilise and return over ten years"
          >
            <CompactTown dest="clinic" />
            {ster.map((cat, i) => (
              <CatMark key={`s-${i}`} {...cat} />
            ))}
          </svg>
        </div>
        <p className={`ltc-readout ${scene.numbersOn ? 'is-on' : ''}`}>
          {YEAR10.sterilise.population} still on the street
          <span> · </span>
          {YEAR10.sterilise.enteringCare} entering care
        </p>
      </div>
    </div>
  )
}

export function Neighbourhood({ scene }: { scene: Scene }) {
  if (scene.mode === 'split') return <SplitScene scene={scene} />
  return <StreetScene scene={scene} />
}
