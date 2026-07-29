// Content for the simulated-PC step-by-step OSCOLA guide at /references/guide.
//
// Each lesson is shown as a pop-up "teacher" window, followed by a one-question
// check-in worth 1 mark. Alongside it, a simulated Word document (see
// components/WordSimulator.js) plays back the lesson's `sim.steps` — typing
// out the exact sentence/footnote being taught, live, so the learner watches
// it happen rather than just reading about it.
//
// There are 9 lessons (9 marks), plus a final build-your-own exercise
// (6 marks) — 15 marks total. Totals are computed dynamically in the page
// component, so this file is the single source of truth for counts.

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
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'This point needs a source.',
          marker: 1,
          ribbon: 'Home',
          note: 'Type your sentence, then insert a footnote marker at the point that needs a source.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: '',
          ribbon: 'References',
          note: 'Word drops your cursor straight into the footnote pane at the bottom of the page.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: 'OSCOLA (Oxford Standard for Citation of Legal Authorities) 4th edn (Oxford 2012).',
          note: 'The citation is typed here, in the footnote — never inside the sentence itself.',
        },
      ],
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
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'The court held the agreement was void.',
          marker: 1,
          ribbon: 'Home',
          note: 'Insert a footnote marker right after the sentence that needs authority.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: 'Republic v Owusu-Dua',
          ribbon: 'References',
          note: "Party names first — separated by an italic 'v', with no full stop.",
        },
        {
          pane: 'footnote',
          num: 1,
          text: ' [2021] GHASC 5.',
          note: 'Then the neutral citation: year in square brackets, court code, judgment number.',
        },
      ],
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
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'Two different report types need different brackets.',
          marker: 1,
          ribbon: 'Home',
          note: 'Example 1 — a neutral citation.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: 'Case A [2020] GHASC 3.',
          ribbon: 'References',
          note: 'Square brackets — the year is essential to find the volume.',
        },
        {
          pane: 'body',
          text: ' Compare that with an independently numbered series.',
          marker: 2,
          note: 'Example 2 — an independently-numbered report series.',
        },
        {
          pane: 'footnote',
          num: 2,
          text: 'Case B (1975) 2 All ER 1.',
          note: 'Round brackets — the year is just extra info; "2" already tells you the volume.',
        },
      ],
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
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'Employers must comply with the Act.',
          marker: 1,
          ribbon: 'Home',
          note: 'Short title, then the year — no comma between them.',
        },
        { pane: 'footnote', num: 1, text: 'Companies Act 2019', ribbon: 'References' },
        {
          pane: 'body',
          text: ' Section 15 sets out the duty.',
          note: "For a specific section, abbreviate 'section' to 's', no full stop.",
        },
        {
          pane: 'footnote',
          num: 1,
          text: ', s 15.',
          note: "Add the section straight after the year: 'Companies Act 2019, s 15'.",
        },
      ],
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
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'One influential account is found in the leading textbook.',
          marker: 1,
          ribbon: 'Home',
          note: 'Book titles are italicised — never in quotation marks.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: "Jack Beatson and others, Anson's Law of Contract (30th edn, OUP 2016).",
          ribbon: 'References',
          note: 'Author, italic title, then (edition, publisher year) — no comma between publisher and year.',
        },
        {
          pane: 'body',
          text: ' A recent journal article takes a different view.',
          marker: 2,
          note: 'Article titles go the other way: single quotes, not italics.',
        },
        {
          pane: 'footnote',
          num: 2,
          text: "Joanna Bell, 'In Defence of Due Deference' (2016) 79 MLR 710.",
          note: "'Title' (year) volume Journal first page.",
        },
      ],
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
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'Government guidance confirms this approach.',
          marker: 1,
          ribbon: 'Home',
          note: 'Online-only sources need a URL and an accessed date.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: "Ministry of Justice, 'Court Guidance'",
          ribbon: 'References',
          note: 'Author/organisation, then the title in single quotes.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: ' (2022) <https://example.gov> accessed 29 July 2026.',
          note: 'Web address in angled brackets, plus the date you accessed it — both compulsory.',
        },
      ],
    },
  },
  {
    id: 'pinpoint',
    title: 'Pinpoint References: Pages & Paragraphs',
    body: [
      'A pinpoint tells the reader exactly where in a source to look — not just which case or book, but which page or paragraph.',
      'For older law reports with page numbers, add a comma then the page, e.g. Smith v Jones [2020] 2 All ER 45, 50.',
      'For judgments with numbered paragraphs (common with neutral citations), the pinpoint is a paragraph number in square brackets straight after the citation — no comma, e.g. [2021] GHASC 5 [12].',
    ],
    checkIn: {
      question: 'How do you pinpoint paragraph 12 of a neutral-citation judgment?',
      options: ['A comma, then 12', '[12] straight after the citation, no comma', 'p 12 in round brackets'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'The tribunal accepted this point.',
          marker: 1,
          ribbon: 'Home',
          note: 'Example 1 — pinpointing a page in an old-style report.',
        },
        { pane: 'footnote', num: 1, text: 'Smith v Jones [2020] 2 All ER 45', ribbon: 'References' },
        {
          pane: 'footnote',
          num: 1,
          text: ', 50.',
          note: "Comma, then the exact page: '45, 50' means the case starts at 45, the point is on 50.",
        },
        {
          pane: 'body',
          text: ' A neutral citation works differently.',
          marker: 2,
          note: 'Example 2 — pinpointing a paragraph in a neutral citation.',
        },
        { pane: 'footnote', num: 2, text: 'Republic v Owusu-Dua [2021] GHASC 5' },
        {
          pane: 'footnote',
          num: 2,
          text: ' [12].',
          note: 'No comma — the paragraph number goes straight in, in its own square brackets.',
        },
      ],
    },
  },
  {
    id: 'crossref',
    title: 'Cross-Referencing: ibid and (n  )',
    body: [
      "Once a source has been cited in full, don't retype it — cross-refer back to it instead.",
      "If you're citing the exact same source as the footnote directly above, use 'ibid' (plus a new pinpoint if it's a different page or paragraph).",
      "If you're citing a source that appeared earlier but not in the immediately preceding footnote, use its short form followed by the footnote number where it first appeared in full, e.g. Owusu-Dua (n 1) [20].",
    ],
    checkIn: {
      question: "You're citing the same case as two footnotes back — not the one right above it. What do you use?",
      options: ['ibid', 'Short form + (n X)', 'The full citation again'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'footnote',
          num: 1,
          text: 'Republic v Owusu-Dua [2021] GHASC 5 [12].',
          ribbon: 'References',
          note: 'Footnote 1 — the first, full citation.',
        },
        {
          pane: 'body',
          text: 'The same point recurs later in the judgment.',
          marker: 2,
          ribbon: 'Home',
          note: 'Footnote 2 cites the very same case, right after footnote 1.',
        },
        {
          pane: 'footnote',
          num: 2,
          text: 'ibid [15].',
          note: "'ibid' means 'same as the footnote directly above' — just update the pinpoint.",
        },
        {
          pane: 'body',
          text: ' Another source is discussed in between, then Owusu-Dua returns.',
          marker: 3,
          note: "Footnote 3 cites Owusu-Dua again, but it's no longer the footnote right above.",
        },
        {
          pane: 'footnote',
          num: 3,
          text: 'Owusu-Dua (n 1) [20].',
          note: "Short form + '(n 1)' cross-refers back to footnote 1, where the full citation lives.",
        },
      ],
    },
  },
  {
    id: 'shortnames',
    title: 'Adding Short Names',
    body: [
      'A short name (or short form) is a shorthand you define the first time you cite a source in full, so you can cross-refer to it briefly afterwards.',
      'For cases, add it in brackets straight after the citation, e.g. Republic v Owusu-Dua [2021] GHASC 5 (Owusu-Dua).',
      "For legislation, do the same with the Act's own short title, e.g. Data Protection Act 2023 ('the 2023 Act').",
      "After that, just use the short form with a cross-reference, e.g. Owusu-Dua (n 1) [20], or 'the 2023 Act, s 5'.",
    ],
    checkIn: {
      question: "When should you define a source's short form?",
      options: ['Every time you cite it', 'The first time you cite it in full', 'Only in the bibliography'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'body',
          text: 'The claimant relied on established authority.',
          marker: 1,
          ribbon: 'Home',
          note: 'Define the short form the moment you cite the source in full.',
        },
        { pane: 'footnote', num: 1, text: 'Republic v Owusu-Dua [2021] GHASC 5', ribbon: 'References' },
        {
          pane: 'footnote',
          num: 1,
          text: ' (Owusu-Dua).',
          note: "The bracketed short name — this is what you'll use from now on.",
        },
        {
          pane: 'body',
          text: ' Later, the same authority is cited again.',
          marker: 2,
          note: 'From here on, use the short form instead of retyping the full citation.',
        },
        {
          pane: 'footnote',
          num: 2,
          text: 'Owusu-Dua (n 1) [20].',
          note: 'Short form + cross-reference — clean and unambiguous.',
        },
      ],
    },
  },
];

// Final "build your own" exercise. The player is given raw facts (never the
// formatted citation) and must type the full OSCOLA citation themselves —
// now including a pinpoint paragraph and a short form, so it draws on every
// lesson above.
export const guideFinalExercise = {
  sourceType: 'Case — Supreme Court (neutral citation, with pinpoint and short form)',
  infoLines: [
    'Case: Republic v Owusu-Dua',
    'Court: Supreme Court of Ghana (neutral citation code GHASC)',
    'Year: 2021',
    'Judgment number: 5',
    'The point you are citing is at paragraph 12',
    "Define the short form 'Owusu-Dua' for later use",
  ],
  correctCitation: 'Republic v Owusu-Dua [2021] GHASC 5 [12] (Owusu-Dua)',
};

// Checklist-based grading for the final exercise — one mark per component,
// so the player sees exactly what they got right or wrong rather than a
// single pass/fail. `checks.length` is the exercise's mark total.
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
    {
      label: 'Paragraph pinpoint ([12])',
      pass: /\[12\]/.test(text),
    },
    {
      label: "Short form defined in brackets ((Owusu-Dua))",
      pass: /\(owusu-dua\)/i.test(text),
    },
  ];
  const score = checks.filter((c) => c.pass).length;
  return { checks, score, total: checks.length };
}