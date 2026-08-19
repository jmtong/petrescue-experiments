/** Indexed so current Australian trapping practice = 100 at year 0.
 * PetRescue cat population model (Boone et al. 2019 structure,
 * calibrated to Chua/Rand/Morton 2023 and Banyule/Rosewood).
 * Only these points are in the briefing — do not invent intermediates.
 */
export const INDEX = {
  current: {
    label: 'Current practice',
    population10: 100,
    care10: 100,
    care20: 100,
    immigration10: 11.6,
  },
  trap: {
    label: 'Trap and remove, doubled',
    population10: 39,
    care10: 99,
    care20: 93,
    immigration10: 18.7,
  },
  sterilise: {
    label: 'Sterilise and return, 5 per 1,000 residents/yr',
    population10: 65,
    care10: 25,
    care20: 23,
    immigration10: 15.7,
  },
} as const

export const STEPS = [
  {
    id: 'setup',
    kicker: 'Two towns, same starting point',
    caption:
      'Two councils start with the same streets and the same number of cats living outside. They try different things.',
  },
  {
    id: 'trap-door',
    kicker: 'Town A · Catch and take away',
    caption:
      'When a cat is caught and taken away, that cat goes to the pound. Catch more cats, and more cats arrive at the pound — not fewer.',
  },
  {
    id: 'trap-pop',
    kicker: 'After 10 years, the street',
    caption:
      'Catch twice as many as we do today, and after 10 years there are fewer cats living outside: 39, if today is 100. It looks like the plan is working.',
  },
  {
    id: 'trap-intake',
    kicker: 'The surprising bit',
    caption:
      'But almost the same number of cats still arrive at pounds and shelters: 99 after 10 years, 93 after 20. The street got quieter. The pound did not. That is how the catching works, not a matter of opinion.',
  },
  {
    id: 'ster-return',
    kicker: 'Town B · Desex and send home',
    caption:
      'This cat is desexed and sent back to its street. It does not go to the pound. The kittens it would have had do not end up there either.',
  },
  {
    id: 'ster-both',
    kicker: 'Same two questions',
    caption:
      'The street empties more slowly: 65 after 10 years. But far fewer cats arrive at the pound: 25 after 10 years, 23 after 20. Both plans can mean fewer cats outside. Only desex-and-send-home means fewer cats arriving at pounds and shelters.',
  },
  {
    id: 'vacancy',
    kicker: 'Why taking cats away keeps failing',
    caption:
      'Take a cat away and you leave an empty spot. New cats that can still have kittens move in faster than they do if a desexed cat is still living there, holding its place. That is why catching-and-taking-away keeps going wrong over time — not only at the pound.',
  },
] as const

export type StepId = (typeof STEPS)[number]['id']

export function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n))
}

export function stepIndex(progress: number) {
  const max = STEPS.length - 1
  return Math.min(max, Math.max(0, Math.round(progress * max)))
}
