import { Link } from 'react-router-dom'
import { experiments } from './data/experiments.ts'

export function Home() {
  return (
    <main className="site">
      <p className="site-kicker">PetRescue</p>
      <h1>Experiments</h1>

      <section className="site-context" aria-label="Context">
        <div className="site-context-block">
          <p className="site-kicker">The situation</p>
          <p>
            Australia has a free-living / community cat population. Councils and
            communities need ways to manage it.
          </p>
        </div>
        <div className="site-context-block">
          <p className="site-kicker">Why this is hard to show</p>
          <p>
            Councils, advocates, journalists and others need to understand what
            different interventions actually achieve — but the evidence is
            complex, long-term, and difficult to communicate. PetRescue has
            research that can support better approaches; static reports are not
            enough to make the relationships understandable or easy to share.
          </p>
        </div>
        <div className="site-context-block">
          <p className="site-kicker">What these pieces explore</p>
          <p>
            Fewer free-living cats does not necessarily mean fewer cats entering
            pounds, shelters and rescues. Trapped cats enter care as part of the
            intervention. Sterilised cats are returned, stop reproducing, and
            keep occupying that territory. The experiments try to make that
            mechanism visible.
          </p>
        </div>
        <p className="site-intro">
          Exploratory prototypes, not the finished PetRescue product. Each one
          lives at its own URL and can be read on its own.
        </p>
      </section>
      <ol className="experiment-index">
        {experiments.map((experiment) => (
          <li key={experiment.slug}>
            <Link to={`/${experiment.slug}`}>
              <span className="number">{experiment.number}</span>
              <span>
                <h2>{experiment.title}</h2>
                <p>{experiment.description}</p>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
