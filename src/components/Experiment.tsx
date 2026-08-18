import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

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
        <h1>
          <span className="number">{number}</span>
          {title}
        </h1>
      </header>
      <div className="experiment-body">{children}</div>
    </article>
  )
}
