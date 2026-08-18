import { Link } from 'react-router-dom'
import { experiments } from './data/experiments.ts'

export function Home() {
  return (
    <main className="site">
      <p className="site-kicker">PetRescue</p>
      <h1>Experiments</h1>
      <p className="site-intro">
        Interactive editorial pieces exploring Australian companion-animal data.
        Each experiment lives at its own URL and can be read on its own.
      </p>
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
