// Content for the simulated-PC step-by-step Table of Contents / Table of
// Authorities guide at /references/toa-toc.
//
// Mirrors the structure of lib/oscolaGuide.js: each lesson is a pop-up
// "teacher" window followed by either a one-question check-in or a
// hands-on interaction, worth 1 mark each. Alongside it, a simulated Word
// document (see components/WordSimulator.js) plays back the lesson's
// `sim.steps` so the learner watches the ToC/ToA being built live rather
// than just reading about it.
//
// Each track has 5 lessons (5 marks) plus a final build-your-own exercise
// (4 marks) — 9 marks total per track. Totals are computed dynamically in
// the page component, so this file is the single source of truth for
// counts.

// ---------------------------------------------------------------------
// Table of Contents track
// ---------------------------------------------------------------------

export const tocLessons = [
  {
    id: 'toc-headings',
    title: 'Start With Heading Styles',
    body: [
      "A Table of Contents can't read your mind — it only picks up text formatted with Word's built-in Heading styles, not text that's just made bold or bigger.",
      "Apply 'Heading 1' to your main section titles. Word then knows exactly which lines belong in the contents page.",
    ],
    checkIn: {
      question: 'What does an automatic Table of Contents actually scan for?',
      options: ['Bold text', 'Built-in Heading styles', 'Underlined text'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'body',
          newBlock: true,
          style: 'h1',
          anchorId: 'intro',
          text: 'I. Introduction',
          ribbon: 'Home',
          note: "Applying the 'Heading 1' style, not just bold — this is what makes the text ToC-ready.",
        },
        {
          pane: 'body',
          newBlock: true,
          style: 'normal',
          text: 'This memorial addresses the jurisdiction of the tribunal.',
          note: 'Ordinary body text underneath stays in the Normal style, so it will never appear in the ToC.',
        },
      ],
    },
  },
  {
    id: 'toc-levels',
    title: 'Heading Levels Control Indentation',
    body: [
      "Use 'Heading 1' for your main Parts or Sections, and 'Heading 2' for subsections within them.",
      'The Table of Contents mirrors this automatically — Heading 2 entries appear indented beneath their Heading 1 parent.',
    ],
    checkIn: {
      question: 'A subsection nested under a main section should be styled as:',
      options: ['Heading 1, in bold', 'Heading 2', 'Normal, indented manually'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'body',
          newBlock: true,
          style: 'h1',
          anchorId: 'intro2',
          text: 'I. Introduction',
          ribbon: 'Home',
          note: 'The main section stays Heading 1.',
        },
        {
          pane: 'body',
          newBlock: true,
          style: 'h2',
          anchorId: 'background2',
          text: 'A. Background',
          note: "A subsection gets 'Heading 2' — Word will indent it under 'Introduction' in the ToC.",
        },
      ],
    },
  },
  {
    id: 'toc-insert',
    title: 'Inserting the Table of Contents',
    body: [
      "Go to References > Table of Contents and pick a style. Word scans the whole document for Heading 1/2 text and builds the list for you — you never type page numbers by hand.",
      'Each entry becomes a live link: the reader can click straight through to that heading.',
    ],
    checkIn: {
      question: 'Which ribbon tab holds the Table of Contents command?',
      options: ['Home', 'Insert', 'References'],
      correctIndex: 2,
    },
    sim: {
      steps: [
        {
          pane: 'toc',
          action: 'insert',
          title: 'TABLE OF CONTENTS',
          ribbon: 'References',
          note: "References > Table of Contents — Word builds the list from your headings automatically.",
        },
        {
          pane: 'toc',
          entry: { label: 'I. Introduction', page: 1, linkTo: 'intro' },
          note: 'Each Heading 1 becomes a top-level, page-numbered entry.',
        },
        {
          pane: 'toc',
          entry: { label: 'A. Background', page: 1, indent: true, linkTo: 'background2' },
          note: 'Heading 2 entries are indented beneath the section they sit under.',
        },
      ],
    },
  },
  {
    id: 'toc-update',
    title: 'Updating the Table',
    body: [
      'The ToC is a snapshot, not a live feed — if you add pages, delete a section, or renumber, the table itself does not change on its own.',
      "Right-click it and choose 'Update Field' (or press F9) before you submit, every time you edit the document.",
    ],
    checkIn: {
      question: "After editing the document, how do you refresh the Table of Contents?",
      options: ['It updates by itself', "Right-click it and choose 'Update Field'", 'Delete and retype it'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'toc',
          action: 'insert',
          title: 'TABLE OF CONTENTS',
          ribbon: 'References',
          note: 'The table as it stood before a late edit.',
        },
        {
          pane: 'toc',
          entry: { label: 'I. Introduction', page: 1, linkTo: 'intro' },
        },
        {
          pane: 'toc',
          entry: { label: 'II. Jurisdiction', page: 2, linkTo: 'intro' },
          note: 'A new section was added earlier in the document, pushing this one back a page.',
        },
        {
          pane: 'toc',
          updateEntry: { label: 'II. Jurisdiction', page: 3 },
          note: "Right-click → 'Update Field' catches the shift — the entry now correctly reads page 3.",
        },
      ],
    },
  },
  {
    id: 'toc-click',
    title: 'Try It: Clickable Navigation',
    body: [
      'Because each entry is linked to its heading, a Table of Contents doubles as a navigation menu.',
      'Click any entry in the simulator to jump straight to that heading in the document.',
    ],
    interactive: {
      doneLabel: 'Jumped to a heading via the Table of Contents',
    },
    sim: {
      steps: [
        {
          pane: 'body',
          newBlock: true,
          style: 'h1',
          anchorId: 'introClick',
          text: 'I. Introduction',
          ribbon: 'Home',
        },
        {
          pane: 'body',
          newBlock: true,
          style: 'h2',
          anchorId: 'backgroundClick',
          text: 'A. Background',
        },
        {
          pane: 'toc',
          action: 'insert',
          title: 'TABLE OF CONTENTS',
          ribbon: 'References',
          note: 'The table is built and linked to the headings above.',
        },
        {
          pane: 'toc',
          entry: { label: 'I. Introduction', page: 1, linkTo: 'introClick' },
        },
        {
          pane: 'toc',
          entry: { label: 'A. Background', page: 1, indent: true, linkTo: 'backgroundClick' },
          note: 'Click either entry on the left to jump straight to that heading — try it now.',
        },
      ],
    },
  },
];

export const tocFinalExercise = {
  prompt:
    "Build it yourself in the document on the right. Add a main heading, 'II. Statement of Facts' (Heading 1), and underneath it a subsection, 'B. Procedural History' (Heading 2). Then insert an automatic Table of Contents from the References tab — and if you edit anything afterwards, keep the table up to date.",
  modelAnswer:
    "Style 'II. Statement of Facts' as Heading 1 and 'B. Procedural History' as Heading 2, insert the table via References > Table of Contents, then right-click it and choose Update Field after any later edit.",
  target: {
    h1: 'II. Statement of Facts',
    h2: 'B. Procedural History',
  },
  sim: {
    tocTitle: 'TABLE OF CONTENTS',
  },
};

function looksLike(text, target) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ') === target.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Grades the document the learner actually built in the editable Word
// simulator (see components/WordSimulator.js editorKind="toc"), rather than
// a prose description of what they'd do.
export function gradeTocBuild(docState) {
  const { target } = tocFinalExercise;
  const blocks = docState?.blocks || [];
  const h1Index = blocks.findIndex((b) => b.style === 'h1' && looksLike(b.text, target.h1));
  const h2Index = blocks.findIndex((b) => b.style === 'h2' && looksLike(b.text, target.h2));

  const checks = [
    {
      label: `Added '${target.h1}' as Heading 1`,
      pass: h1Index !== -1,
    },
    {
      label: `Added '${target.h2}' as Heading 2, underneath it`,
      pass: h2Index !== -1 && (h1Index === -1 || h2Index > h1Index),
    },
    {
      label: 'Inserted the Table of Contents',
      pass: !!docState?.tocInserted,
    },
    {
      label: 'Table of Contents is up to date (Update Field clicked after any edit)',
      pass: !!docState?.tocInserted && !docState?.tocStale,
    },
  ];
  const score = checks.filter((c) => c.pass).length;
  return { checks, score, total: checks.length };
}

// ---------------------------------------------------------------------
// Table of Authorities track
// ---------------------------------------------------------------------

export const toaLessons = [
  {
    id: 'toa-what',
    title: 'What a Table of Authorities Does',
    body: [
      'A Table of Authorities lists every case, statute, and other source cited in your footnotes — grouped by category, not by the order they first appear.',
      'Unlike a Table of Contents, it is built from your citations, not your headings.',
    ],
    checkIn: {
      question: 'A Table of Authorities is built from:',
      options: ['Your headings', 'Your footnote citations', 'Your bibliography only'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'body',
          newBlock: true,
          style: 'normal',
          text: 'The tribunal confirmed its jurisdiction over the dispute.',
          marker: 1,
          ribbon: 'Home',
          note: 'Two authorities are cited in the footnotes below.',
        },
        { pane: 'footnote', num: 1, text: 'Republic v Owusu-Dua [2021] GHASC 5.' },
        {
          pane: 'body',
          text: ' This power derives from statute.',
          marker: 2,
        },
        { pane: 'footnote', num: 2, text: 'Companies Act 2019, s 15.', note: 'Both will feed into the Table of Authorities.' },
      ],
    },
  },
  {
    id: 'toa-mark',
    title: 'Marking a Citation',
    body: [
      "Select the citation text in a footnote, then go to References > Table of Authorities > Mark Citation.",
      "Word asks you to confirm the category — Cases, Statutes, or Other Authorities — so it knows which group the entry belongs in.",
    ],
    checkIn: {
      question: 'Before a citation can appear in the Table of Authorities, you must:',
      options: ['Copy it into a separate list', 'Mark it and assign a category', 'Bold it in the footnote'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'footnote',
          num: 1,
          text: 'Republic v Owusu-Dua [2021] GHASC 5.',
          ribbon: 'References',
          note: 'Select the citation text, then Mark Citation.',
        },
        {
          pane: 'footnote',
          num: 1,
          text: '',
          note: "A dialog opens asking for the category — here, 'Cases'.",
        },
      ],
    },
  },
  {
    id: 'toa-categories',
    title: 'Category Headings Organize the Table',
    body: [
      "The finished table groups entries under bold category headings — 'Cases' first, then 'Statutes', then 'Other Authorities' — and lists entries alphabetically within each.",
      'This lets a judge find any authority instantly, without scanning the whole list.',
    ],
    checkIn: {
      question: 'Within a category like "Cases", entries are listed:',
      options: ['In the order first cited', 'Alphabetically', 'By footnote number'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'toc',
          action: 'insert',
          title: 'TABLE OF AUTHORITIES',
          ribbon: 'References',
        },
        {
          pane: 'toc',
          entry: { label: 'Cases', heading: true },
          note: "Category headings, like 'Cases', are bold and unlinked — they just divide the list.",
        },
        { pane: 'toc', entry: { label: 'Republic v Owusu-Dua [2021] GHASC 5', page: 1 } },
        {
          pane: 'toc',
          entry: { label: 'Statutes', heading: true },
        },
        { pane: 'toc', entry: { label: 'Companies Act 2019, s 15', page: 1 }, note: 'Statutes get their own category, listed underneath.' },
      ],
    },
  },
  {
    id: 'toa-update',
    title: 'Keeping It in Sync',
    body: [
      "Just like the Table of Contents, the Table of Authorities is a snapshot — add a new citation and the table won't show it until you refresh.",
      "Right-click it and choose 'Update Table of Authorities' after editing your footnotes.",
    ],
    checkIn: {
      question: 'After adding a new marked citation to your document, you should:',
      options: ["Leave it — it updates itself", 'Update the Table of Authorities', 'Rebuild the whole table from scratch'],
      correctIndex: 1,
    },
    sim: {
      steps: [
        {
          pane: 'toc',
          action: 'insert',
          title: 'TABLE OF AUTHORITIES',
          ribbon: 'References',
          note: 'The table as it stood before a new authority was added.',
        },
        { pane: 'toc', entry: { label: 'Cases', heading: true } },
        { pane: 'toc', entry: { label: 'Republic v Owusu-Dua [2021] GHASC 5', page: 1 } },
        {
          pane: 'toc',
          entry: { label: 'Smith v Jones [2020] 2 All ER 45', page: 4 },
          note: "A second case was marked but the table hasn't been refreshed to show its true page yet.",
        },
        {
          pane: 'toc',
          updateEntry: { label: 'Smith v Jones [2020] 2 All ER 45', page: 2 },
          note: "Update Table of Authorities corrects it — now reading page 2.",
        },
      ],
    },
  },
  {
    id: 'toa-click',
    title: 'Try It: Jump to Where It Was Used',
    body: [
      'Table of Authorities entries link back to the point in the document where that source is discussed.',
      'Click the case entry in the simulator to jump straight to the paragraph that cites it.',
    ],
    interactive: {
      doneLabel: 'Jumped to the cited passage via the Table of Authorities',
    },
    sim: {
      steps: [
        {
          pane: 'body',
          newBlock: true,
          style: 'normal',
          anchorId: 'jurisdictionPara',
          text: 'The tribunal confirmed its jurisdiction over the dispute.',
          marker: 1,
          ribbon: 'Home',
        },
        { pane: 'footnote', num: 1, text: 'Republic v Owusu-Dua [2021] GHASC 5.' },
        {
          pane: 'toc',
          action: 'insert',
          title: 'TABLE OF AUTHORITIES',
          ribbon: 'References',
        },
        { pane: 'toc', entry: { label: 'Cases', heading: true } },
        {
          pane: 'toc',
          entry: { label: 'Republic v Owusu-Dua [2021] GHASC 5', page: 1, linkTo: 'jurisdictionPara' },
          note: 'Click the entry on the left to jump to the paragraph that cites it — try it now.',
        },
      ],
    },
  },
];

export const toaFinalExercise = {
  prompt:
    "Build it yourself in the document on the right. A new authority needs citing — Data Protection Act 2023, s 5. Type it into the footnote, use Mark Citation to assign it the right category, then insert or update the Table of Authorities so it's correctly grouped alongside the case already in there.",
  modelAnswer:
    "Select the citation in the footnote, go to References > Table of Authorities > Mark Citation, assign it to the 'Statutes' category, then right-click the table and choose Update Table of Authorities.",
  targetText: 'Data Protection Act 2023, s 5',
  targetCategory: 'Statutes',
  sim: {
    bodyText: 'A further point in this section relies on new legislation.',
    footnoteNum: 2,
    footnotePlaceholder: 'Type the new citation here…',
    toaTitle: 'TABLE OF AUTHORITIES',
    seedEntries: [{ category: 'Cases', text: 'Republic v Owusu-Dua [2021] GHASC 5', page: 1 }],
  },
};

function normalizeCitationLoose(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '');
}

// Grades the document the learner actually built in the editable Word
// simulator (see components/WordSimulator.js editorKind="toa"), rather than
// a prose description of what they'd do.
export function gradeToaBuild(docState) {
  const { targetText, targetCategory } = toaFinalExercise;
  const typedCorrectly =
    !!docState?.footnoteText &&
    normalizeCitationLoose(docState.footnoteText).includes(normalizeCitationLoose(targetText));

  const checks = [
    {
      label: `Typed the new citation ('${targetText}') into the footnote`,
      pass: typedCorrectly,
    },
    {
      label: `Marked it and assigned the '${targetCategory}' category`,
      pass: !!docState?.marked && docState?.category === targetCategory,
    },
    {
      label: 'Inserted the Table of Authorities',
      pass: !!docState?.toaInserted,
    },
    {
      label: 'Table of Authorities is up to date (Update Table clicked after the edit)',
      pass: !!docState?.toaInserted && !docState?.toaStale,
    },
  ];
  const score = checks.filter((c) => c.pass).length;
  return { checks, score, total: checks.length };
}
