export type ExperimentMeta = {
  slug: string
  number: string
  title: string
  description: string
}

export const experiments: ExperimentMeta[] = [
  {
    slug: '01a-split-futures',
    number: '01a',
    title: 'Split futures',
    description: 'One neighbourhood, two futures. Scroll.',
  },
  {
    slug: 'experiments/01b-follow-a-cat',
    number: '01b',
    title: 'Follow a cat',
    description: 'One cat, two interventions, then the 10-year model.',
  },
  {
    slug: 'experiments/01c-learn-then-compare',
    number: '01c',
    title: 'Learn then compare',
    description: 'Teach one cat, then zoom out to two 10-year futures.',
  },
  {
    slug: 'experiments/01d-manage-the-neighbourhood',
    number: '01d',
    title: 'Manage the neighbourhood',
    description: 'Pick up a tool. Drop it on a cat.',
  },
  {
    slug: 'experiments/01e-where-did-the-cats-go',
    number: '01e',
    title: 'Where did the cats go',
    description: 'Watch cats move between a neighbourhood and care.',
  },
  {
    slug: 'experiments/01f-two-counts',
    number: '01f',
    title: 'Two counts',
    description:
      'Why fewer cats on the streets doesn’t always mean fewer cats in pounds and shelters.',
  },
  {
    slug: 'experiments/01g-trapping-vs-sterilising',
    number: '01g',
    title: 'Catching cats vs desexing them',
    description:
      'Catching more cats can empty the street and still fill the pound. Desexing them does something different.',
  },
]
