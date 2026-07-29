// Word banks for The Hot Seat. LOCAL is intentionally generic (broadly
// applicable domestic/civil/criminal law concepts) rather than tied to any
// one country's actual statutes - see project notes on why.
export const LOCAL_CONCEPTS = [
  'Duty of care',
  'Breach of contract',
  'Consideration',
  'Vicarious liability',
  'Res ipsa loquitur',
  'Burden of proof',
  'Presumption of innocence',
  'Double jeopardy',
  'Negligence',
  'Unjust enrichment',
  'Specific performance',
  'Doctrine of precedent',
  'Mens rea',
  'Actus reus',
  'Strict liability',
  'Freedom of contract',
  'Estoppel',
  'Natural justice',
];

export const INTERNATIONAL_CONCEPTS = [
  'State sovereignty',
  'Diplomatic immunity',
  'Treaty ratification',
  'Jus cogens',
  'Universal jurisdiction',
  'Extradition',
  'Non-refoulement',
  'Self-determination',
  'Customary international law',
  'Pacta sunt servanda',
  'War crimes',
  'Crimes against humanity',
  'International arbitration',
  'Maritime boundaries',
  'Human rights derogation',
  'Right of asylum',
  'Sanctions regime',
  'Genocide convention',
];

export function getRandomConcept(category, exclude) {
  const list = category === 'local' ? LOCAL_CONCEPTS : INTERNATIONAL_CONCEPTS;
  const options = exclude ? list.filter((w) => w !== exclude) : list;
  return options[Math.floor(Math.random() * options.length)];
}
