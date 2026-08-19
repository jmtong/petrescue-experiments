export type Beat = {
  id: string
  chapter: string
  caption: string
}

export const beats: Beat[] = [
  {
    id: 'meet',
    chapter: 'One cat',
    caption: 'This cat lives here. Not a pet on a sofa. A free-living cat, with a patch of street it already knows.',
  },
  {
    id: 'territory',
    chapter: 'One cat',
    caption: 'The dotted ring is territory. Familiar fences. Known bins. A place to be.',
  },
  {
    id: 'ch1',
    chapter: 'Chapter 1',
    caption: 'Trap + remove.',
  },
  {
    id: 'trap-set',
    chapter: 'Trap + remove',
    caption: 'A trap goes down.',
  },
  {
    id: 'caught',
    chapter: 'Trap + remove',
    caption: 'Caught.',
  },
  {
    id: 'to-pound',
    chapter: 'Trap + remove',
    caption: 'The cat is taken into pounds, shelters & rescues.',
  },
  {
    id: 'empty',
    chapter: 'Trap + remove',
    caption: 'The street, for a moment, has a hole in it.',
  },
  {
    id: 'replacement',
    chapter: 'Trap + remove',
    caption: 'Not for long. Another intact cat moves in.',
  },
  {
    id: 'reset',
    chapter: 'Chapter 2',
    caption: 'Reset. Same cat. Same street. A different intervention.',
  },
  {
    id: 'ch2',
    chapter: 'Chapter 2',
    caption: 'Sterilise + return.',
  },
  {
    id: 'caught-again',
    chapter: 'Sterilise + return',
    caption: 'Caught again.',
  },
  {
    id: 'desexed',
    chapter: 'Sterilise + return',
    caption: 'Desexed. A small ear-tip — the usual field mark — so we can still see which cat this is.',
  },
  {
    id: 'returned',
    chapter: 'Sterilise + return',
    caption: 'Returned to the place it was living.',
  },
  {
    id: 'no-kittens',
    chapter: 'Sterilise + return',
    caption: 'Still home. No kittens. The territory stays occupied.',
  },
  {
    id: 'ch3',
    chapter: 'Chapter 3',
    caption: 'Now imagine this across a whole population.',
  },
  {
    id: 'field',
    chapter: 'A population',
    caption: 'One cat is a story. Many cats are a model. Ten years out, indexed to current practice at 100.',
  },
  {
    id: 'trap-stats',
    chapter: 'A population',
    caption: 'Double trapping: population index 39, intake index 99.',
  },
  {
    id: 'sterilise-stats',
    chapter: 'A population',
    caption: 'Sterilisation 5/1,000/year: population index 65, intake index 25.',
  },
  {
    id: 'question',
    chapter: 'A question',
    caption:
      'Does understanding what happens to one cat make the population-level data easier to understand?',
  },
]
