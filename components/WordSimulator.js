'use client';

import { useEffect, useRef, useState } from 'react';

const RIBBON_TABS = ['Home', 'Insert', 'Layout', 'References'];

const BLOCK_CLASS = {
  normal: 'text-[14.5px] leading-relaxed text-[#1a1a1a]',
  h1: 'text-[19px] font-bold text-[#1f3864]',
  h2: 'pl-4 text-[16px] font-semibold text-[#2e5395]',
};

const BLOCK_MARGIN = {
  normal: 'mt-2',
  h1: 'mt-4',
  h2: 'mt-3',
};

const TOA_CATEGORIES = ['Cases', 'Statutes', 'Other Authorities'];

function computeTocEntries(blocks) {
  let page = 0;
  const entries = [];
  blocks.forEach((b) => {
    if (b.style === 'h1') {
      page += 1;
      entries.push({ label: b.runs[0]?.text || '', page, linkTo: b.id });
    } else if (b.style === 'h2') {
      entries.push({ label: b.runs[0]?.text || '', page: Math.max(page, 1), indent: true, linkTo: b.id });
    }
  });
  return entries;
}

function computeToaEntries(seedEntries, newEntry) {
  const all = newEntry ? [...seedEntries, newEntry] : seedEntries;
  const grouped = {};
  all.forEach((e) => {
    if (!e.text?.trim()) return;
    grouped[e.category] = grouped[e.category] || [];
    grouped[e.category].push(e);
  });
  const entries = [];
  TOA_CATEGORIES.forEach((cat) => {
    if (!grouped[cat]) return;
    entries.push({ label: cat, heading: true });
    grouped[cat]
      .slice()
      .sort((a, b) => a.text.localeCompare(b.text))
      .forEach((e) => entries.push({ label: e.text, page: e.page }));
  });
  return entries;
}

/**
 * A simulated Microsoft Word window.
 *
 * Two modes:
 *
 * 1. PLAYBACK (default) — plays a scripted `steps` array for a lesson:
 *    typing body text, dropping in footnote markers, toggling paragraph
 *    marks, building a live ToC/ToA. Pass a new `resetKey` to restart.
 *
 * 2. EDITOR (`editable`) — a genuinely hands-on mini word processor for the
 *    final test at the end of a track. The learner types into it directly
 *    and the result is graded, instead of describing what they'd do in a
 *    textarea. Three kinds:
 *      - editorKind="citation": a seeded sentence with a footnote marker;
 *        the learner types the OSCOLA citation into the footnote pane.
 *      - editorKind="toc": a blank document; the learner adds Heading 1 /
 *        Heading 2 paragraphs and inserts + updates a live Table of
 *        Contents built from those headings.
 *      - editorKind="toa": a seeded footnote citation already in the Table
 *        of Authorities, plus a new footnote the learner must type, mark
 *        with Mark Citation, categorise, and fold into an updated table.
 *
 *    `seed` supplies kind-specific starting content (see call sites).
 *    `onDocChange(state)` fires on every edit so the parent can grade the
 *    current snapshot when the learner submits.
 */
export default function WordSimulator({
  steps = [],
  resetKey,
  idleMessage,
  onInteract,
  editable = false,
  editorKind,
  seed = {},
  onDocChange,
  instructions,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [footnotes, setFootnotes] = useState([]);
  const [showMarks, setShowMarks] = useState(false);
  const [tocBlock, setTocBlock] = useState(null);
  const [ribbon, setRibbon] = useState('Home');
  const [note, setNote] = useState('');
  const [flashKey, setFlashKey] = useState(0);
  const [flashAnchor, setFlashAnchor] = useState(null);

  // --- editor-mode state ---------------------------------------------
  const [edBlocks, setEdBlocks] = useState([]);
  const [edNewText, setEdNewText] = useState('');
  const [edNewStyle, setEdNewStyle] = useState('h1');
  const [edTocInserted, setEdTocInserted] = useState(false);
  const [edTocStale, setEdTocStale] = useState(false);
  const [edTocEntries, setEdTocEntries] = useState([]);
  const [edFootnoteText, setEdFootnoteText] = useState('');
  const [edMarked, setEdMarked] = useState(false);
  const [edCategory, setEdCategory] = useState(null);
  const [edToaInserted, setEdToaInserted] = useState(false);
  const [edToaStale, setEdToaStale] = useState(false);
  const [edToaEntries, setEdToaEntries] = useState([]);
  const blockIdRef = useRef(0);

  const timerRef = useRef(null);
  const flashTimerRef = useRef(null);
  const containerRef = useRef(null);

  function reset() {
    clearTimeout(timerRef.current);
    clearTimeout(flashTimerRef.current);
    setStepIndex(0);
    setBlocks([]);
    setFootnotes([]);
    setShowMarks(false);
    setTocBlock(null);
    setRibbon('Home');
    setNote('');
    setFlashAnchor(null);
  }

  function resetEditor() {
    setEdBlocks([]);
    setEdNewText('');
    setEdNewStyle('h1');
    setEdTocInserted(false);
    setEdTocStale(false);
    setEdTocEntries([]);
    setEdFootnoteText('');
    setEdMarked(false);
    setEdCategory(null);
    setEdToaInserted(false);
    setEdToaStale(false);
    setEdToaEntries([]);
    setRibbon('Home');
    setFlashAnchor(null);
  }

  // Restart playback (or clear the editor) whenever handed a new lesson/track.
  useEffect(() => {
    if (editable) resetEditor();
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, editable]);

  function flashAndJump(id) {
    setFlashAnchor(id);
    clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlashAnchor(null), 1600);
  }

  useEffect(() => {
    if (!flashAnchor || !containerRef.current) return;
    const el = containerRef.current.querySelector(`[data-anchor="${CSS.escape(flashAnchor)}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [flashAnchor]);

  function handleEntryClick(id) {
    flashAndJump(id);
    onInteract?.(id);
  }

  // --- editor-mode actions ---------------------------------------------

  function addBlock() {
    if (!edNewText.trim()) return;
    const id = `blk-${blockIdRef.current++}`;
    setEdBlocks((b) => [...b, { id, style: edNewStyle, runs: [{ text: edNewText.trim() }] }]);
    setEdNewText('');
    setRibbon('Home');
    if (edTocInserted) setEdTocStale(true);
  }

  function removeBlock(id) {
    setEdBlocks((b) => b.filter((x) => x.id !== id));
    if (edTocInserted) setEdTocStale(true);
  }

  function insertToc() {
    setEdTocEntries(computeTocEntries(edBlocks));
    setEdTocInserted(true);
    setEdTocStale(false);
    setRibbon('References');
  }

  function updateToc() {
    setEdTocEntries(computeTocEntries(edBlocks));
    setEdTocStale(false);
    setRibbon('References');
  }

  function changeFootnoteText(value) {
    setEdFootnoteText(value);
    if (editorKind === 'toa' && edToaInserted) setEdToaStale(true);
  }

  function markCitation(category) {
    setEdMarked(true);
    setEdCategory(category);
    setRibbon('References');
    if (edToaInserted) setEdToaStale(true);
  }

  function currentToaNewEntry() {
    if (!edMarked || !edFootnoteText.trim()) return null;
    return { category: edCategory, text: edFootnoteText.trim(), page: (seed.seedEntries?.length || 0) + 1 };
  }

  function insertToa() {
    setEdToaEntries(computeToaEntries(seed.seedEntries || [], currentToaNewEntry()));
    setEdToaInserted(true);
    setEdToaStale(false);
    setRibbon('References');
  }

  function updateToa() {
    setEdToaEntries(computeToaEntries(seed.seedEntries || [], currentToaNewEntry()));
    setEdToaStale(false);
    setRibbon('References');
  }

  // Report the current editable document snapshot up to the parent so it
  // can grade whatever the learner has actually built when they submit.
  useEffect(() => {
    if (!editable || !onDocChange) return;
    if (editorKind === 'citation') {
      onDocChange({ footnoteText: edFootnoteText });
    } else if (editorKind === 'toc') {
      onDocChange({
        blocks: edBlocks.map((b) => ({ style: b.style, text: b.runs[0]?.text || '' })),
        tocInserted: edTocInserted,
        tocStale: edTocStale,
        tocEntries: edTocEntries,
      });
    } else if (editorKind === 'toa') {
      onDocChange({
        footnoteText: edFootnoteText,
        marked: edMarked,
        category: edCategory,
        toaInserted: edToaInserted,
        toaStale: edToaStale,
        toaEntries: edToaEntries,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, editorKind, edFootnoteText, edMarked, edCategory, edToaInserted, edToaStale, edToaEntries, edBlocks, edTocInserted, edTocStale, edTocEntries]);

  // --- playback-mode step application (unchanged) -----------------------

  function applyStep(step) {
    if (step.ribbon) setRibbon(step.ribbon);

    if (step.pane === 'body') {
      if (step.clear) {
        setBlocks([]);
      } else if (step.newBlock) {
        setBlocks((b) => [
          ...b,
          {
            id: step.anchorId || `b${b.length}`,
            style: step.style || 'normal',
            runs: [{ text: step.text, marker: step.marker, marked: step.marked }],
          },
        ]);
      } else {
        setBlocks((b) => {
          if (b.length === 0) {
            return [
              {
                id: step.anchorId || 'b0',
                style: step.style || 'normal',
                runs: [{ text: step.text, marker: step.marker, marked: step.marked }],
              },
            ];
          }
          const last = b[b.length - 1];
          const updated = {
            ...last,
            runs: [...last.runs, { text: step.text, marker: step.marker, marked: step.marked }],
          };
          return [...b.slice(0, -1), updated];
        });
      }
    } else if (step.pane === 'footnote') {
      if (step.clear) {
        setFootnotes([]);
      } else {
        setFootnotes((fs) => {
          const existing = fs.find((f) => f.num === step.num);
          if (existing) {
            return fs.map((f) => (f.num === step.num ? { ...f, text: f.text + step.text } : f));
          }
          return [...fs, { num: step.num, text: step.text }];
        });
      }
    } else if (step.pane === 'marks') {
      setShowMarks(step.show !== false);
    } else if (step.pane === 'toc') {
      if (step.action === 'clear') {
        setTocBlock(null);
      } else if (step.action === 'insert') {
        setTocBlock({ title: step.title || 'TABLE OF CONTENTS', entries: [] });
      } else if (step.entry) {
        setTocBlock((tb) =>
          tb
            ? { ...tb, entries: [...tb.entries, step.entry] }
            : { title: 'TABLE OF CONTENTS', entries: [step.entry] }
        );
      } else if (step.updateEntry) {
        setTocBlock((tb) =>
          tb
            ? {
                ...tb,
                entries: tb.entries.map((e) =>
                  e.label === step.updateEntry.label ? { ...e, page: step.updateEntry.page } : e
                ),
              }
            : tb
        );
      }
    } else if (step.pane === 'jump') {
      flashAndJump(step.linkTo);
    }

    setNote(step.note || '');
    setFlashKey((k) => k + 1);
  }

  useEffect(() => {
    if (editable) return;
    if (!steps.length || stepIndex >= steps.length) return;
    const step = steps[stepIndex];
    const delay = stepIndex === 0 ? 500 : 1250;

    timerRef.current = setTimeout(() => {
      applyStep(step);
      setStepIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, steps, resetKey, editable]);

  function replay() {
    reset();
  }

  function skipToEnd() {
    clearTimeout(timerRef.current);
    let b = [];
    let fs = [];
    let marks = showMarks;
    let toc = null;
    let lastNote = '';
    let lastRibbon = ribbon;

    steps.forEach((step) => {
      if (step.ribbon) lastRibbon = step.ribbon;

      if (step.pane === 'body') {
        if (step.clear) b = [];
        else if (step.newBlock) {
          b = [
            ...b,
            {
              id: step.anchorId || `b${b.length}`,
              style: step.style || 'normal',
              runs: [{ text: step.text, marker: step.marker, marked: step.marked }],
            },
          ];
        } else if (b.length === 0) {
          b = [
            {
              id: step.anchorId || 'b0',
              style: step.style || 'normal',
              runs: [{ text: step.text, marker: step.marker, marked: step.marked }],
            },
          ];
        } else {
          const last = b[b.length - 1];
          const updated = {
            ...last,
            runs: [...last.runs, { text: step.text, marker: step.marker, marked: step.marked }],
          };
          b = [...b.slice(0, -1), updated];
        }
      } else if (step.pane === 'footnote') {
        if (step.clear) {
          fs = [];
        } else {
          const existing = fs.find((f) => f.num === step.num);
          fs = existing
            ? fs.map((f) => (f.num === step.num ? { ...f, text: f.text + step.text } : f))
            : [...fs, { num: step.num, text: step.text }];
        }
      } else if (step.pane === 'marks') {
        marks = step.show !== false;
      } else if (step.pane === 'toc') {
        if (step.action === 'clear') toc = null;
        else if (step.action === 'insert') toc = { title: step.title || 'TABLE OF CONTENTS', entries: [] };
        else if (step.entry) toc = toc ? { ...toc, entries: [...toc.entries, step.entry] } : toc;
        else if (step.updateEntry && toc) {
          toc = {
            ...toc,
            entries: toc.entries.map((e) =>
              e.label === step.updateEntry.label ? { ...e, page: step.updateEntry.page } : e
            ),
          };
        }
      }
      lastNote = step.note || lastNote;
    });

    setBlocks(b);
    setFootnotes(fs);
    setShowMarks(marks);
    setTocBlock(toc);
    setNote(lastNote);
    setRibbon(lastRibbon);
    setStepIndex(steps.length);
    setFlashKey((k) => k + 1);
  }

  const isDone = steps.length > 0 && stepIndex >= steps.length;
  const hasStarted = blocks.length > 0 || footnotes.length > 0 || !!tocBlock;

  // Shared renderer for a ToC/ToA-style table (used by both playback and
  // editor modes so the finished table always looks the same).
  function renderTablePanel(title, entries) {
    return (
      <div className="mb-6 rounded border border-gray-300 bg-gray-50 p-4">
        <p className="mb-3 text-center text-[13px] font-bold uppercase tracking-wide text-[#1f3864]">
          {title}
        </p>
        {entries.length === 0 && (
          <p className="text-center text-[12px] italic text-gray-400">No entries yet.</p>
        )}
        {entries.map((e, i) =>
          e.heading ? (
            <p key={i} className="mt-3 text-[12.5px] font-bold text-[#1f3864]">
              {e.label}
            </p>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => e.linkTo && handleEntryClick(e.linkTo)}
              disabled={!e.linkTo}
              className={`flex w-full items-end gap-1 py-1 text-left text-[12.5px] text-[#1a1a1a] ${
                e.linkTo ? 'cursor-pointer hover:text-[#2b579a]' : 'cursor-default'
              } ${e.indent ? 'pl-4' : ''}`}
            >
              <span>{e.label}</span>
              <span className="mb-[3px] flex-1 border-b border-dotted border-gray-400" />
              <span>{e.page}</span>
            </button>
          )
        )}
      </div>
    );
  }

  function renderBlocksPanel(blockList, { removable = false } = {}) {
    return blockList.map((block, bi) => {
      const isLast = bi === blockList.length - 1;
      const isFlashing = flashAnchor === block.id;
      return (
        <div
          key={block.id}
          data-anchor={block.id}
          className={`group relative ${BLOCK_CLASS[block.style]} ${
            bi === 0 ? '' : BLOCK_MARGIN[block.style]
          } rounded transition-colors ${isFlashing ? 'bg-emerald-100 ring-2 ring-emerald-400' : ''}`}
        >
          {block.style === 'h2' && showMarks && <span className="mr-1 text-gray-300">→</span>}
          {block.runs.map((run, ri) => (
            <span key={ri}>
              {run.marked ? <span className="rounded bg-gray-200 px-0.5">{run.text}</span> : run.text}
              {run.marker != null && <sup className="ml-0.5 font-semibold text-[#2b579a]">{run.marker}</sup>}
            </span>
          ))}
          {isLast && !editable && !isDone && steps.length > 0 && <span className="animate-pulse">|</span>}
          {showMarks && <span className="ml-0.5 text-gray-300">¶</span>}
          {removable && (
            <button
              type="button"
              onClick={() => removeBlock(block.id)}
              className="ml-2 hidden rounded border border-red-300 px-1 text-[10px] text-red-500 hover:bg-red-50 group-hover:inline"
              title="Remove paragraph"
            >
              ✕
            </button>
          )}
        </div>
      );
    });
  }

  // ======================================================================
  // EDITOR MODE
  // ======================================================================
  if (editable) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b] shadow-2xl">
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#2b2b2b] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#2b579a] text-[10px] font-bold text-white">
              W
            </span>
            <span className="text-xs text-gray-300">Document1 — Word</span>
          </div>
          <button
            onClick={resetEditor}
            className="rounded border border-white/20 px-2 py-0.5 text-[10px] text-gray-300 hover:bg-white/10"
          >
            ↻ Clear
          </button>
        </div>

        {/* ribbon */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#f3f2f1] px-4 py-1.5 text-[11px] text-[#333]">
          <div className="flex gap-4">
            {RIBBON_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRibbon(tab)}
                className={`pb-1 transition-colors ${
                  ribbon === tab ? 'border-b-2 border-[#2b579a] font-semibold text-[#2b579a]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {editorKind === 'toc' && ribbon === 'References' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={insertToc}
                disabled={edBlocks.filter((b) => b.style !== 'normal').length === 0}
                className="rounded bg-[#2b579a] px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-40"
              >
                Insert Table of Contents
              </button>
              {edTocInserted && (
                <button
                  type="button"
                  onClick={updateToc}
                  className={`rounded px-2 py-1 text-[10px] font-semibold ${
                    edTocStale ? 'bg-amber-500 text-white' : 'border border-gray-400 text-gray-600'
                  }`}
                >
                  Update Field
                </button>
              )}
            </div>
          )}

          {editorKind === 'toa' && ribbon === 'References' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={insertToa}
                disabled={!edMarked}
                className="rounded bg-[#2b579a] px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-40"
              >
                Insert Table of Authorities
              </button>
              {edToaInserted && (
                <button
                  type="button"
                  onClick={updateToa}
                  className={`rounded px-2 py-1 text-[10px] font-semibold ${
                    edToaStale ? 'bg-amber-500 text-white' : 'border border-gray-400 text-gray-600'
                  }`}
                >
                  Update Table
                </button>
              )}
            </div>
          )}
        </div>

        {/* page */}
        <div className="flex min-h-[540px] items-start justify-center bg-[#3a3a3a] p-8">
          <div className="flex min-h-[480px] w-full max-w-[760px] flex-col justify-between rounded-sm bg-white p-10 text-[#1a1a1a] shadow-lg">
            <div ref={containerRef} className="max-h-[420px] overflow-y-auto pr-1">
              {/* ---- citation kind ---- */}
              {editorKind === 'citation' && (
                <>
                  {renderBlocksPanel([
                    { id: 'seedBody', style: 'normal', runs: [{ text: seed.bodyText, marker: seed.footnoteNum }] },
                  ])}
                </>
              )}

              {/* ---- toc kind ---- */}
              {editorKind === 'toc' && (
                <>
                  {edTocInserted && renderTablePanel(seed.tocTitle || 'TABLE OF CONTENTS', edTocEntries)}
                  {edBlocks.length === 0 ? (
                    <p className="text-[14px] italic text-gray-300">
                      Use the toolbar below to add your first paragraph.
                    </p>
                  ) : (
                    renderBlocksPanel(edBlocks, { removable: true })
                  )}
                </>
              )}

              {/* ---- toa kind ---- */}
              {editorKind === 'toa' && (
                <>
                  {edToaInserted && renderTablePanel(seed.toaTitle || 'TABLE OF AUTHORITIES', edToaEntries)}
                  {renderBlocksPanel([
                    { id: 'seedBody', style: 'normal', runs: [{ text: seed.bodyText, marker: seed.footnoteNum }] },
                  ])}
                </>
              )}
            </div>

            {/* footnote / toolbar area */}
            <div>
              {(editorKind === 'citation' || editorKind === 'toa') && (
                <div className="mt-8 border-t border-gray-300 pt-3">
                  <div className="flex items-start gap-1">
                    <sup className="mt-1 font-semibold text-gray-700">{seed.footnoteNum}</sup>
                    <input
                      value={edFootnoteText}
                      onChange={(e) => changeFootnoteText(e.target.value)}
                      onFocus={() => setRibbon('References')}
                      placeholder={seed.footnotePlaceholder || 'Type the citation…'}
                      className="w-full border-b border-dotted border-gray-400 bg-transparent px-1 py-1 text-[12.5px] text-[#1a1a1a] outline-none focus:border-[#2b579a]"
                    />
                  </div>

                  {editorKind === 'toa' && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400">Mark Citation:</span>
                      {TOA_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => markCitation(cat)}
                          disabled={!edFootnoteText.trim()}
                          className={`rounded border px-2 py-1 text-[10px] font-semibold disabled:cursor-not-allowed disabled:opacity-30 ${
                            edMarked && edCategory === cat
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-300 text-gray-600 hover:border-[#2b579a]'
                          }`}
                        >
                          {edMarked && edCategory === cat ? '✓ ' : ''}
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {editorKind === 'toc' && (
                <div className="mt-8 flex flex-col gap-2 border-t border-gray-300 pt-3 sm:flex-row">
                  <select
                    value={edNewStyle}
                    onChange={(e) => setEdNewStyle(e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 text-[12px] text-gray-700"
                  >
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="normal">Normal</option>
                  </select>
                  <input
                    value={edNewText}
                    onChange={(e) => setEdNewText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBlock();
                      }
                    }}
                    onFocus={() => setRibbon('Home')}
                    placeholder="Type paragraph text…"
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-[12.5px] text-[#1a1a1a] outline-none focus:border-[#2b579a]"
                  />
                  <button
                    type="button"
                    onClick={addBlock}
                    disabled={!edNewText.trim()}
                    className="rounded bg-[#2b579a] px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              )}

              <p className="mt-4 text-center text-[11px] text-gray-400">1</p>
            </div>
          </div>
        </div>

        {/* callout */}
        <div className="min-h-[56px] border-t border-white/10 bg-[#111826] px-4 py-2">
          <p className="text-xs leading-relaxed text-docket-gold">💡 {instructions}</p>
          {editorKind === 'toc' && edTocStale && (
            <p className="mt-1 text-[10px] text-amber-400">
              The document changed since the table was inserted — click Update Field.
            </p>
          )}
          {editorKind === 'toa' && edToaStale && (
            <p className="mt-1 text-[10px] text-amber-400">
              The citation changed since the table was inserted — click Update Table.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ======================================================================
  // PLAYBACK MODE (unchanged)
  // ======================================================================
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b] shadow-2xl">
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#2b2b2b] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#2b579a] text-[10px] font-bold text-white">
            W
          </span>
          <span className="text-xs text-gray-300">Document1 — Word</span>
        </div>
        <div className="flex items-center gap-2">
          {!isDone && steps.length > 0 && (
            <button
              onClick={skipToEnd}
              className="rounded border border-white/20 px-2 py-0.5 text-[10px] text-gray-300 hover:bg-white/10"
            >
              Skip ahead
            </button>
          )}
          <button
            onClick={replay}
            disabled={steps.length === 0}
            className="rounded border border-white/20 px-2 py-0.5 text-[10px] text-gray-300 hover:bg-white/10 disabled:opacity-40"
          >
            ↻ Replay
          </button>
        </div>
      </div>

      {/* ribbon */}
      <div className="flex gap-4 border-b border-white/10 bg-[#f3f2f1] px-4 py-1.5 text-[11px] text-[#333]">
        {RIBBON_TABS.map((tab) => (
          <span
            key={tab}
            className={`pb-1 transition-colors ${
              ribbon === tab ? 'border-b-2 border-[#2b579a] font-semibold text-[#2b579a]' : 'text-gray-500'
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* page */}
      <div className="flex min-h-[540px] items-start justify-center bg-[#3a3a3a] p-8">
        <div className="flex min-h-[480px] w-full max-w-[760px] flex-col justify-between rounded-sm bg-white p-10 text-[#1a1a1a] shadow-lg">
          {hasStarted ? (
            <div ref={containerRef} className="max-h-[420px] overflow-y-auto pr-1">
              {tocBlock && renderTablePanel(tocBlock.title, tocBlock.entries)}
              {renderBlocksPanel(blocks)}
            </div>
          ) : (
            <p className="text-[15px] italic text-gray-300">
              {idleMessage || 'The document will appear here as the lesson plays.'}
            </p>
          )}

          <div>
            {footnotes.length > 0 && (
              <div className="mt-8 border-t border-gray-300 pt-3">
                {footnotes.map((f) => (
                  <p key={f.num} className="text-[12.5px] leading-snug text-gray-700">
                    <sup className="mr-1 font-semibold">{f.num}</sup>
                    {f.text}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-4 text-center text-[11px] text-gray-400">1</p>
          </div>
        </div>
      </div>

      {/* callout */}
      <div className="min-h-[56px] border-t border-white/10 bg-[#111826] px-4 py-2">
        {note ? (
          <p key={flashKey} className="text-xs leading-relaxed text-docket-gold">
            💡 {note}
          </p>
        ) : (
          <p className="text-xs text-gray-500">Watching the lesson…</p>
        )}
        {steps.length > 0 && (
          <p className="mt-1 text-[10px] text-gray-600">
            Step {Math.min(stepIndex, steps.length)} / {steps.length}
          </p>
        )}
      </div>
    </div>
  );
}
