import { CAT_HOME, CAT_POUND, MARKS, type SceneState } from './scene.ts'

type NeighbourhoodProps = {
  scene: SceneState
}

function catTranslate(scene: SceneState) {
  if (scene.catPlace === 'pound') return CAT_POUND
  return CAT_HOME
}

export function Neighbourhood({ scene }: NeighbourhoodProps) {
  const cat = catTranslate(scene)
  const catGone = scene.field !== 'off'
  const inCage = scene.trapClosed && scene.catPlace === 'trap'

  return (
    <svg
      className="follow-svg"
      viewBox="0 0 1000 620"
      role="img"
      aria-label="An illustrated neighbourhood with one cat, then a field of many cats"
    >
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#c9bba8" strokeWidth="1" />
        </pattern>
      </defs>

      <rect className="paper" width="1000" height="620" />

      <g className={`street-world ${scene.field !== 'off' ? 'is-faded' : ''}`}>
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
          <rect x="92" y="48" width="14" height="28" className="chimney" />
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
        <g className="bin" transform="translate(322 404)">
          <rect x="0" y="8" width="16" height="22" rx="2" />
          <rect x="-2" y="3" width="20" height="7" rx="2" />
        </g>

        <ellipse
          className={`territory ${scene.emptyTerritory ? 'is-empty' : ''}`}
          cx="250"
          cy="430"
          rx="118"
          ry="72"
        />
        <text className="territory-label" x="250" y="512">
          territory
        </text>

        <g className={`pound ${scene.highlightPound ? 'is-hot' : ''}`}>
          <rect x="628" y="72" width="340" height="268" rx="10" />
          <rect className="pound-hatch" x="628" y="72" width="340" height="268" rx="10" fill="url(#hatch)" />
          <text className="pound-label" x="798" y="118">
            Pounds, shelters
          </text>
          <text className="pound-label" x="798" y="148">
            &amp; rescues
          </text>
        </g>

        <g className={`actor replacement ${scene.replacement ? 'is-on' : ''}`}>
          <CatBody variant="other" sterilised={false} />
        </g>

        <g
          className={`actor hero ${scene.catPlace} ${catGone ? 'is-gone' : ''} ${inCage ? 'is-caged' : ''}`}
          style={{ transform: `translate(${cat.x}px, ${cat.y}px)` }}
        >
          <g className={scene.catPlace === 'home' && !scene.catSterilised ? 'wander' : ''}>
            <CatBody variant="hero" sterilised={scene.catSterilised} />
          </g>
        </g>

        <g
          className={`trap ${scene.trapVisible ? 'is-on' : ''} ${scene.trapClosed ? 'is-closed' : ''}`}
          style={{ transform: `translate(${CAT_HOME.x}px, ${CAT_HOME.y}px)` }}
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
          <text className="no-kittens-label" x="0" y="36">
            no kittens
          </text>
        </g>
      </g>

      <g className={`field ${scene.field !== 'off' ? 'is-on' : ''}`}>
        {MARKS.map((mark) => {
          const keep =
            scene.field === 'many' ||
            (scene.field === 'trap' && mark.i < 39) ||
            (scene.field === 'sterilise' && mark.i < 65)
          return (
            <g
              key={mark.i}
              className={`mark ${keep ? 'is-keep' : 'is-drop'}`}
              style={{
                transform: `translate(${mark.x}px, ${mark.y}px) rotate(${mark.rot}deg)`,
                transitionDelay: `${mark.delay}s`,
              }}
            >
              <CatMark />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

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
        <path className="ear ear-tipped" d="M -10 -6 L -18 -22 L -2 -14 Z" />
      ) : (
        <path className="ear" d="M -12 -8 L -16 -26 L -2 -14 Z" />
      )}
      <path className="ear" d="M 4 -10 L 14 -26 L 16 -8 Z" />
      <ellipse className="torso" cx="0" cy="4" rx="22" ry="14" />
      <circle className="head" cx="2" cy="-8" r="12" />
      <circle className="eye" cx="-2" cy="-10" r="1.6" />
      <circle className="eye" cx="7" cy="-10" r="1.6" />
      {sterilised ? <circle className="ear-tip-mark" cx="-14" cy="-18" r="3.2" /> : null}
    </g>
  )
}

function CatMark() {
  return (
    <g className="cat-mark">
      <path d="M -5 -6 L -7 -14 L 0 -8 Z" />
      <path d="M 2 -7 L 7 -14 L 6 -6 Z" />
      <ellipse cx="0" cy="1" rx="8" ry="5.5" />
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
