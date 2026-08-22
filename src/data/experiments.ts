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
    slug: '01b-follow-a-cat',
    number: '01b',
    title: 'Follow a cat',
    description: 'One cat, two interventions, then the 10-year model.',
  },
  {
    slug: '01c-learn-then-compare',
    number: '01c',
    title: 'Learn then compare',
    description: 'Teach one cat, then zoom out to two 10-year futures.',
  },
  {
    slug: '01d-manage-the-neighbourhood',
    number: '01d',
    title: 'Manage the neighbourhood',
    description: 'Pick up a tool. Drop it on a cat.',
  },
  {
    slug: '01e-where-did-the-cats-go',
    number: '01e',
    title: 'Where did the cats go',
    description: 'Watch cats move between a neighbourhood and care.',
  },
  {
    slug: '01f-two-counts',
    number: '01f',
    title: 'Two counts',
    description:
      'Why fewer cats on the streets doesn’t always mean fewer cats in pounds and shelters.',
  },
  {
    slug: '01g-trapping-vs-sterilising',
    number: '01g',
    title: 'Catching cats vs desexing them',
    description:
      'Catching more cats can empty the street and still fill the pound. Desexing them does something different.',
  },
  {
    slug: '01h-branching-family-tree',
    number: '01h',
    title: 'Branching family tree',
    description:
      'One undesexed female, then generations. Remove cats, or stop a branch from growing.',
  },
  {
    slug: '01i-filling-the-neighbourhood',
    number: '01i',
    title: 'Filling the neighbourhood',
    description:
      'Cats occupy physical space over four years. Remove them, or desex the hotspots.',
  },
  {
    slug: '01j-cat-distribution-system',
    number: '01j',
    title: 'The Cat Distribution System',
    description:
      'Cats keep arriving. Reveal the source, then intervene at the output or at the source.',
  },
  {
    slug: '01k-illustrated-cat-faces',
    number: '01k',
    title: 'Illustrated cat faces',
    description:
      'A handful of ink-doodle parts, many cats. Visual only — not the population model.',
  },
  {
    slug: '01l-why-desexing',
    number: '01l',
    title: 'Why desexing',
    description:
      'Scroll a story from one cat to two neighbourhood futures. Illustrative — not the research model.',
  },
]

export function experimentHref(slug: string) {
  return `/experiments/${slug}`
}
