// Content for the simulated-PC step-by-step OSCOLA guide at /references/guide.
// Each lesson is shown as a pop-up window, followed by a one-question
// check-in worth 1 mark. There are 6 lessons (6 marks), plus a final
// build-your-own exercise worth 4 marks — 10 marks total.

export const guideLessons = [
  {
    id: 'intro',
    title: 'Welcome to OSCOLA',
    body: [
      "OSCOLA (the Oxford Standard for Citation of Legal Authorities) is a footnote-based citation style — sources are cited in footnotes, not in the text itself.",
      'Two things matter above all: consistency, and making life easy for whoever is reading your work.',
    ],
    checkIn: {
      question: 'Where do OSCOLA citations appear?',
      options: ['In-text, like (Author, Year)', 'In footnotes', 'In endnotes at the back'],
      correctIndex: 1,
    },
  },
  {
    id: 'cases',
    title: 'Citing Cases',
    body: [
      'A case citation names the parties, separated by an italic "v" — with no full stop after it.',
      'If the case has a neutral citation, its year goes in square brackets, e.g. [2020] GHASC 12 — and the court is not repeated in brackets, because the neutral citation already identifies it.',
    ],
    checkIn: {
      question: "What punctuation follows the \"v\" between two party names?",
      options: ['A full stop', 'A comma', 'Nothing'],
      correctIndex: 2,
    },
  },
  {
    id: 'brackets',
    title: 'Square vs Round Brackets',
    body: [
      'Square brackets [ ] are used when the year is needed to identify the volume — as with neutral citations, or law reports issued in more than one volume per year.',
      'Round brackets ( ) are used when the report series is independently numbered, so the year is just extra information, not something needed to locate the volume.',
    ],
    checkIn: {
      question: "A case's neutral citation year goes in:",
      options: ['Round brackets', 'Square brackets', 'No brackets at all'],
      correctIndex: 1,
    },
  },
  {
    id: 'legislation',
    title: 'Citing Legislation',
    body: [
      "Cite an Act by its short title and year, with no comma before the year — e.g. Companies Act 2019.",
      "\"Section\" is abbreviated to \"s\" with no full stop, e.g. Human Rights Act 1998, s 2.",
    ],
    checkIn: {
      question: "Is there a comma between an Act's title and its year?",
      options: ['Yes', 'No'],
      correctIndex: 1,
    },
  },
  {
    id: 'secondary',
    title: 'Books & Articles',
    body: [
      'Book titles are italicised — never placed in quotation marks. Give publisher and year in brackets, with no comma between them, e.g. (OUP 2009).',
      "Article titles go the other way round — in single quotation marks, roman (not italic) type, e.g. 'In Defence of Due Deference'.",
    ],
    checkIn: {
      question: 'How is a book title formatted?',
      options: ['Italics', "In single quotation marks", 'In bold'],
      correctIndex: 0,
    },
  },
  {
    id: 'electronic',
    title: 'Websites & Footnote Basics',
    body: [
      'Sources that exist only online need their web address inside angled brackets < >, plus the date you accessed them.',
      'Both the URL and the accessed date are required — leaving either one out is one of the most common OSCOLA mistakes.',
    ],
    checkIn: {
      question: 'Besides the web address, what else must an electronic-only source include?',
      options: ['A page number', 'An accessed date', 'An ISBN'],
      correctIndex: 1,
    },
  },
];

// Final "build your own" exercise. The player is given raw facts (never the
// formatted citation) and must type the full OSCOLA citation themselves.
export const guideFinalExercise = {
  sourceType: 'Case — Supreme Court (neutral citation)',
  infoLines: [
    'Case: Republic v Owusu-Dua',
    'Court: Supreme Court of Ghana (neutral citation code GHASC)',
    'Year: 2021',
    'Judgment number: 5',
  ],
  correctCitation: 'Republic v Owusu-Dua [2021] GHASC 5',
};

// Checklist-based grading for the final exercise — 4 marks, one per
// component, so the player sees exactly what they got right or wrong
// rather than a single pass/fail.
export function gradeFinalExercise(answer) {
  const text = answer.trim();
  const checks = [
    {
      label: 'Party names, in the correct order (Republic v Owusu-Dua)',
      pass: /^republic\s+v\s+owusu-dua/i.test(text),
    },
    {
      label: 'Year in square brackets ([2021])',
      pass: /\[2021\]/.test(text),
    },
    {
      label: 'Court abbreviation (GHASC)',
      pass: /\bGHASC\b/i.test(text),
    },
    {
      label: 'Judgment number (5), with no full stops anywhere in the citation',
      pass: /\b5\b/.test(text) && !text.includes('.'),
    },
  ];
  const score = checks.filter((c) => c.pass).length;
  return { checks, score, total: checks.length };
}
