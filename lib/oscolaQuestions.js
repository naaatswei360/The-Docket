// OSCOLA citation question bank, shared by both games under /references/games.
//
// Each question:
//   id              unique string
//   jurisdiction    'local' (Ghana) | 'international'
//   sourceType      human-readable label shown to the player
//   infoLines       the raw facts the player is given (does NOT reveal the
//                   formatted citation)
//   correctCitation the properly OSCOLA-formatted citation
//   wrongOptions    two plausible-but-wrong versions, used by the Hostile
//                   Judge multiple-choice game
//   ruleExplanation short explanation of the rule that makes the correct
//                   version correct (shown as feedback in both games)

export const oscolaQuestions = [
  // ---------------------------------------------------------------------
  // LOCAL (Ghana) — 10 questions
  // ---------------------------------------------------------------------
  {
    id: 'gh-1',
    jurisdiction: 'local',
    sourceType: 'Case — Supreme Court (neutral citation)',
    infoLines: [
      'Case: Republic v Mensah',
      'Court: Supreme Court of Ghana (neutral citation code GHASC)',
      'Year: 2020',
      'Judgment number: 12',
    ],
    correctCitation: 'Republic v Mensah [2020] GHASC 12',
    wrongOptions: [
      'Republic v Mensah [2020] GHASC 12 (SC)',
      'Mensah v Republic [2020] SC GHASC',
    ],
    ruleExplanation:
      "A neutral citation already identifies the court, so don't add a bracketed court abbreviation as well. Keep the case name in its original order, and use an unpunctuated 'v' with no full stops.",
  },
  {
    id: 'gh-2',
    jurisdiction: 'local',
    sourceType: 'Case — Court of Appeal (neutral citation)',
    infoLines: [
      'Case: Boateng v Owusu',
      'Court: Court of Appeal of Ghana (neutral citation code GHACA)',
      'Year: 2018',
      'Judgment number: 45',
    ],
    correctCitation: 'Boateng v Owusu [2018] GHACA 45',
    wrongOptions: [
      'Boateng v Owusu (2018) GHACA 45',
      'Owusu v Boateng [2018] GHACA 45',
    ],
    ruleExplanation:
      'Neutral citation years always go in square brackets. Party order follows the case name exactly as it was decided — never swap it.',
  },
  {
    id: 'gh-3',
    jurisdiction: 'local',
    sourceType: 'Case — High Court (law report, no neutral citation)',
    infoLines: [
      'Case: Asante v Adjei',
      'Report: Ghana Law Reports (GLR), volume 2',
      'Year: 2016',
      'Page: 210',
      'Court: High Court',
    ],
    correctCitation: 'Asante v Adjei [2016] 2 GLR 210 (HC)',
    wrongOptions: [
      'Asante v Adjei [2016] 2 GLR 210',
      'Asante v Adjei (2016) 2 GLR 210 (HC)',
    ],
    ruleExplanation:
      "Without a neutral citation, the court must be given in brackets after the report citation. Square brackets are used here because the year is needed to identify which volume of the report series you mean.",
  },
  {
    id: 'gh-4',
    jurisdiction: 'local',
    sourceType: 'Legislation — Act',
    infoLines: ['Act: Companies Act', 'Year: 2019', 'Act number: 992', 'Pinpoint: section 35'],
    correctCitation: 'Companies Act 2019 (Act 992), s 35',
    wrongOptions: [
      'Companies Act, 2019 (Act 992), s 35',
      'The Companies Act 2019 (Act 992) s.35',
    ],
    ruleExplanation:
      "There is no comma between an Act's short title and its year. 'Section' is abbreviated 's' with no full stop, preceded by a comma.",
  },
  {
    id: 'gh-5',
    jurisdiction: 'local',
    sourceType: 'Legislation — Constitution',
    infoLines: [
      'Source: Constitution of the Republic of Ghana',
      'Year: 1992',
      'Pinpoint: article 33, clause 5',
    ],
    correctCitation: 'Constitution of the Republic of Ghana 1992, art 33(5)',
    wrongOptions: [
      'The 1992 Constitution of Ghana, art. 33(5)',
      'Constitution of the Republic of Ghana, 1992, Article 33(5)',
    ],
    ruleExplanation:
      "Cite the full, correct title of the instrument followed by its year with no comma. 'Article' is abbreviated 'art' with no full stop.",
  },
  {
    id: 'gh-6',
    jurisdiction: 'local',
    sourceType: 'Book',
    infoLines: [
      'Author: Kwame Frimpong',
      'Title: The Law of Contract in Ghana',
      'Edition: 2nd',
      'Publisher: Sedco',
      'Year: 2003',
    ],
    correctCitation: 'Kwame Frimpong, The Law of Contract in Ghana (2nd edn, Sedco 2003)',
    wrongOptions: [
      "Frimpong, K, The Law of Contract in Ghana (2nd edn, Sedco 2003)",
      "Kwame Frimpong, 'The Law of Contract in Ghana' (2nd edn, Sedco 2003)",
    ],
    ruleExplanation:
      'Book titles are italicised, never placed in quotation marks. In a footnote, the author is given forename first, surname second — the surname-first form is only used in a bibliography.',
  },
  {
    id: 'gh-7',
    jurisdiction: 'local',
    sourceType: 'Journal article',
    infoLines: [
      'Author: Kofi Quashigah',
      "Title: 'Judicial Review in Ghana'",
      'Year: 2015',
      'Volume: 3',
      'Journal abbreviation: UGLJ',
      'First page: 45',
    ],
    correctCitation: "Kofi Quashigah, 'Judicial Review in Ghana' (2015) 3 UGLJ 45",
    wrongOptions: [
      'Kofi Quashigah, Judicial Review in Ghana (2015) 3 UGLJ 45',
      "Kofi Quashigah, 'Judicial Review in Ghana' [2015] 3 UGLJ 45",
    ],
    ruleExplanation:
      'Article titles go in single quotation marks (roman, not italic). Use round brackets for the year when a volume number is also given — square brackets are only for years that themselves identify the volume.',
  },
  {
    id: 'gh-8',
    jurisdiction: 'local',
    sourceType: 'Institutional report',
    infoLines: [
      'Body: Ghana Law Reform Commission',
      'Title: Report on Land Tenure Reform',
      'Abbreviation used: GLRC',
      'Year: 2017',
      'Pinpoint: paragraph 12',
    ],
    correctCitation: 'Ghana Law Reform Commission, Report on Land Tenure Reform (GLRC 2017) para 12',
    wrongOptions: [
      'Ghana Law Reform Commission, Report on Land Tenure Reform, (GLRC, 2017), para. 12',
      "Ghana Law Reform Commission, 'Report on Land Tenure Reform' (GLRC 2017) para 12",
    ],
    ruleExplanation:
      'Report titles from an institutional author are italicised like a book. No comma between the abbreviation and the year inside the brackets, and no full stop after "para".',
  },
  {
    id: 'gh-9',
    jurisdiction: 'local',
    sourceType: 'Website (electronic-only source)',
    infoLines: [
      'Author/site: Ghana Legal',
      "Title: 'Understanding the Companies Act 2019'",
      'Publication date: 3 March 2021',
      'URL: www.ghanalegal.com/companies-act-2019',
      'Date accessed: 10 January 2022',
    ],
    correctCitation:
      "Ghana Legal, 'Understanding the Companies Act 2019' (Ghana Legal, 3 March 2021) <www.ghanalegal.com/companies-act-2019> accessed 10 January 2022",
    wrongOptions: [
      "Ghana Legal, 'Understanding the Companies Act 2019' (Ghana Legal, 3 March 2021) www.ghanalegal.com/companies-act-2019",
      "Ghana Legal, 'Understanding the Companies Act 2019' (2021) accessed 10 January 2022",
    ],
    ruleExplanation:
      'Sources that exist only online must have the web address inside angled brackets, followed by the date you accessed it — both are required, not optional.',
  },
  {
    id: 'gh-10',
    jurisdiction: 'local',
    sourceType: 'Case — regional court (neutral citation)',
    infoLines: [
      'Case: Koraa v Republic of Ghana',
      'Court: ECOWAS Community Court of Justice',
      'Registry code: ECW/CCJ/JUD/07/19',
    ],
    correctCitation: 'Koraa v Republic of Ghana [2019] ECW/CCJ/JUD/07/19',
    wrongOptions: [
      'Koraa v Republic of Ghana (2019) ECW/CCJ/JUD/07/19',
      'Republic of Ghana v Koraa [2019] ECW/CCJ/JUD/07/19',
    ],
    ruleExplanation:
      'Regional court neutral citations follow the same convention as domestic ones: square brackets for the year, and the party order preserved exactly as decided.',
  },

  // ---------------------------------------------------------------------
  // INTERNATIONAL — 10 questions
  // ---------------------------------------------------------------------
  {
    id: 'intl-1',
    jurisdiction: 'international',
    sourceType: 'Case — UK, House of Lords (neutral citation + law report)',
    infoLines: [
      'Case: Corr v IBC Vehicles Ltd',
      'Neutral citation: [2008] UKHL 13',
      'Law report: [2008] 1 AC 884',
    ],
    correctCitation: 'Corr v IBC Vehicles Ltd [2008] UKHL 13, [2008] 1 AC 884',
    wrongOptions: [
      'Corr v. IBC Vehicles Ltd [2008] UKHL 13, [2008] 1 AC 884',
      'Corr v IBC Vehicles Ltd (2008) UKHL 13, [2008] 1 AC 884',
    ],
    ruleExplanation:
      "There is never a full stop after the italic 'v' between party names. Neutral citation years always sit in square brackets.",
  },
  {
    id: 'intl-2',
    jurisdiction: 'international',
    sourceType: 'Case — UK, no neutral citation',
    infoLines: [
      'Case: Page v Smith',
      'Law report: Appeal Cases, [1996] AC 155',
      'Court: House of Lords',
    ],
    correctCitation: 'Page v Smith [1996] AC 155 (HL)',
    wrongOptions: ['Page v Smith [1996] AC 155', 'Page v Smith (1996) AC 155 (HL)'],
    ruleExplanation:
      "Square brackets are used because the year is needed to find the volume. Without a neutral citation, the court is given in brackets at the end.",
  },
  {
    id: 'intl-3',
    jurisdiction: 'international',
    sourceType: 'Legislation — UK statute',
    infoLines: ['Act: Human Rights Act', 'Year: 1998', 'Pinpoint: section 2'],
    correctCitation: 'Human Rights Act 1998, s 2',
    wrongOptions: ['Human Rights Act, 1998, s 2', 'The Human Rights Act 1998 s.2'],
    ruleExplanation:
      "No comma before the year in an Act's title. 'Section' is abbreviated 's' with no full stop, and a comma precedes it.",
  },
  {
    id: 'intl-4',
    jurisdiction: 'international',
    sourceType: 'Book',
    infoLines: [
      'Author: Timothy Endicott',
      'Title: Administrative Law',
      'Publisher: OUP',
      'Year: 2009',
    ],
    correctCitation: 'Timothy Endicott, Administrative Law (OUP 2009)',
    wrongOptions: [
      'Timothy Endicott, Administrative Law, (OUP, 2009)',
      "Endicott, T, Administrative Law (OUP 2009)",
    ],
    ruleExplanation:
      'No comma between the publisher and the year inside the brackets. In a footnote citation, give the forename before the surname.',
  },
  {
    id: 'intl-5',
    jurisdiction: 'international',
    sourceType: 'Journal article',
    infoLines: [
      'Author: Alison L Young',
      "Title: 'In Defence of Due Deference'",
      'Year: 2009',
      'Volume: 72',
      'Journal abbreviation: MLR',
      'First page: 554',
    ],
    correctCitation: "Alison L Young, 'In Defence of Due Deference' (2009) 72 MLR 554",
    wrongOptions: [
      "Alison L Young, In Defence of Due Deference (2009) 72 MLR 554",
      "Alison L Young, 'In Defence of Due Deference' [2009] 72 MLR 554",
    ],
    ruleExplanation:
      'Article titles need single quotation marks. Round brackets are used for the year here because a volume number is separately given.',
  },
  {
    id: 'intl-6',
    jurisdiction: 'international',
    sourceType: 'EU legislation',
    infoLines: [
      'Title: Consolidated Version of the Treaty on European Union',
      'Year: 2008',
      'Official Journal reference: OJ C115/13',
    ],
    correctCitation: 'Consolidated Version of the Treaty on European Union [2008] OJ C115/13',
    wrongOptions: [
      'Consolidated Version of the Treaty on European Union (2008) OJ C115/13',
      'Treaty on European Union, Consolidated Version [2008] OJ C115/13',
    ],
    ruleExplanation:
      'Official Journal citations use square brackets for the year, and the title is given exactly as published — not reordered.',
  },
  {
    id: 'intl-7',
    jurisdiction: 'international',
    sourceType: 'Case — European Court of Human Rights',
    infoLines: [
      'Case: Omojudi v UK',
      'Report: European Human Rights Reports, volume 51',
      'Year: 2009',
      'First page: 10',
    ],
    correctCitation: 'Omojudi v UK (2009) 51 EHRR 10',
    wrongOptions: ['Omojudi v UK [2009] 51 EHRR 10', 'UK v Omojudi (2009) 51 EHRR 10'],
    ruleExplanation:
      'The EHRR series is independently numbered by volume, so the year goes in round brackets, not square.',
  },
  {
    id: 'intl-8',
    jurisdiction: 'international',
    sourceType: 'Website (electronic-only source)',
    infoLines: [
      'Author: Sarah Cole',
      "Title: 'Virtual Friend Fires Employee'",
      'Site name: Naked Law',
      'Publication date: 1 May 2009',
      'URL: www.nakedlaw.com/2009/05/index.html',
      'Date accessed: 19 November 2009',
    ],
    correctCitation:
      "Sarah Cole, 'Virtual Friend Fires Employee' (Naked Law, 1 May 2009) <www.nakedlaw.com/2009/05/index.html> accessed 19 November 2009",
    wrongOptions: [
      "Sarah Cole, 'Virtual Friend Fires Employee' (Naked Law, 1 May 2009) www.nakedlaw.com/2009/05/index.html",
      "Sarah Cole, 'Virtual Friend Fires Employee' (2009) accessed 19 November 2009",
    ],
    ruleExplanation:
      'The web address must sit inside angled brackets, and the accessed date is a required final element for any electronic-only source.',
  },
  {
    id: 'intl-9',
    jurisdiction: 'international',
    sourceType: 'Newspaper article',
    infoLines: [
      'Author: Jane Croft',
      "Title: 'Supreme Court Warns on Quality'",
      'Newspaper: Financial Times',
      'City: London',
      'Date: 1 July 2010',
      'Page: 3',
    ],
    correctCitation: "Jane Croft, 'Supreme Court Warns on Quality' Financial Times (London, 1 July 2010) 3",
    wrongOptions: [
      'Jane Croft, "Supreme Court Warns on Quality" Financial Times (London, 1 July 2010) 3',
      "Jane Croft, 'Supreme Court Warns on Quality' Financial Times, (London, 1 July 2010), 3",
    ],
    ruleExplanation:
      'The article title takes single quotation marks; the newspaper name is roman, not italic, with no comma before the bracketed city and date.',
  },
  {
    id: 'intl-10',
    jurisdiction: 'international',
    sourceType: 'Command paper',
    infoLines: [
      'Body: Home Office',
      'Title: Report of the Royal Commission on Capital Punishment',
      'Command paper number: Cmd 8932',
      'Year: 1953',
      'Pinpoint: paragraph 53',
    ],
    correctCitation:
      'Home Office, Report of the Royal Commission on Capital Punishment (Cmd 8932, 1953) para 53',
    wrongOptions: [
      'Home Office, Report of the Royal Commission on Capital Punishment, (Cmd. 8932, 1953), para. 53',
      "Home Office, 'Report of the Royal Commission on Capital Punishment' (Cmd 8932, 1953) para 53",
    ],
    ruleExplanation:
      'The report title is italicised like a book title (it is not a quoted article title), with no full stops in "Cmd" or "para".',
  },
];

// Fisher–Yates shuffle, used to randomise question order and MCQ options.
export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Pull up to `count` random questions, mixing local and international
// sources as evenly as possible.
export function pickRandomQuestions(count = 10) {
  const local = shuffle(oscolaQuestions.filter((q) => q.jurisdiction === 'local'));
  const international = shuffle(
    oscolaQuestions.filter((q) => q.jurisdiction === 'international')
  );
  const half = Math.ceil(count / 2);
  const picked = [...local.slice(0, half), ...international.slice(0, count - half)];
  return shuffle(picked).slice(0, count);
}

// Normalise free-text answers before comparing them (case/whitespace only —
// OSCOLA punctuation itself is significant, so we don't strip that).
export function normalizeCitation(text) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
