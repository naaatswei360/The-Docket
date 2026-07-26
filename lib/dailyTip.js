export const TIPS = [
  'Open with your roadmap. A judge who knows where you\'re going will follow you there.',
  'Never let a fact do the work a case should be doing.',
  'Concede small points early — it buys credibility for the ones that matter.',
  'If you can\'t state the other side\'s best argument in one sentence, you haven\'t understood it yet.',
  'Cite the authority that binds the court, not the one that merely agrees with you.',
  'A trembling voice is fine. A trembling structure is not.',
  'Answer the question you were asked, then return to your argument — in that order.',
  'The strongest advocacy sounds like certainty, not volume.',
  'Facts persuade; adjectives merely decorate.',
  'Know your weakest point before the judge finds it for you.',
  'A memorial that repeats the facts has not yet made an argument.',
  'Silence after a hard question is better than a rushed, wrong answer.',
  'Every submission should answer: so what, and why does it win the case?',
  'Read the issue list like a client\'s life depends on it. Somewhere, it might.',
  'Precision beats passion. Aim for both, but never sacrifice the first for the second.',
];

// Deterministic pick per calendar day, so it changes daily but is stable within a day.
export function getTodaysTip() {
  const now = new Date();
  const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return TIPS[dayIndex % TIPS.length];
}
