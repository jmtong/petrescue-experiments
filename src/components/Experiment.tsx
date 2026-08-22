import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { experimentHref, experiments } from '../data/experiments.ts'

type ExperimentProps = {
  number: string
  title: string
  children?: ReactNode
}

export function Experiment({ number, title, children }: ExperimentProps) {
  return (
    <article className="experiment">
      <header className="experiment-header">
        <Link to="/">PetRescue Experiments</Link>
        <nav className="experiment-nav" aria-label="All experiments">
          {experiments.map((experiment) => (
            <Link
              key={experiment.slug}
              to={experimentHref(experiment.slug)}
              aria-current={experiment.number === number ? 'page' : undefined}
              title={experiment.title}
            >
              {experiment.number}
            </Link>
          ))}
        </nav>
        <h1>
          <span className="number">{number}</span>
          {title}
        </h1>
      </header>
      <div className="experiment-body">{children}</div>
    </article>
  )
}
