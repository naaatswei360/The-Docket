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

/**
 * A simulated Microsoft Word window that plays a script of `steps` for a
 * lesson: typing body text (plain paragraphs or Heading 1/2 blocks),
 * dropping in footnote markers, toggling paragraph marks (¶), and building
 * a live Table of Contents / Table of Authorities whose entries can be
 * clicked to smooth-scroll to the matching heading. A short callout under
 * the page explains what just happened at each step.
 *
 * Pass a new `resetKey` (e.g. the lesson id) to restart playback for a new
 * lesson. Pass `onInteract(id)` to be notified when the learner clicks a
 * live ToC/ToA entry themselves (used to gate "test it yourself" lessons).
 *
 * step shape:
 *   {
 *     pane: 'body' | 'footnote' | 'marks' | 'toc' | 'jump',
 *
 *     // pane: 'body'
 *     text, marker, marked, newBlock, style ('normal'|'h1'|'h2'), anchorId,
 *
 *     // pane: 'footnote'
 *     num, text, clear,
 *
 *     // pane: 'marks'
 *     show,
 *
 *     // pane: 'toc'  (also used for a Table of Authorities)
 *     action: 'insert' | 'clear', title,
 *     entry: { label, page, indent, heading, linkTo },
 *     updateEntry: { label, page },
 *
 *     // pane: 'jump'  (simulate a click on a ToC/ToA entry)
 *     linkTo,
 *
 *     ribbon: 'Home' | 'Insert' | 'Layout' | 'References',
 *     note: string,
 *   }
 */
export default function WordSimulator({ steps = [], resetKey, idleMessage, onInteract }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [footnotes, setFootnotes] = useState([]);
  const [showMarks, setShowMarks] = useState(false);
  const [tocBlock, setTocBlock] = useState(null);
  const [ribbon, setRibbon] = useState('Home');
  const [note, setNote] = useState('');
  const [flashKey, setFlashKey] = useState(0);
  const [flashAnchor, setFlashAnchor] = useState(null);

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

  // Restart the whole playback whenever we're handed a new lesson.
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

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
    if (!steps.length || stepIndex >= steps.length) return;
    const step = steps[stepIndex];
    const delay = stepIndex === 0 ? 500 : 1250;

    timerRef.current = setTimeout(() => {
      applyStep(step);
      setStepIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, steps, resetKey]);

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
              {tocBlock && (
                <div className="mb-6 rounded border border-gray-300 bg-gray-50 p-4">
                  <p className="mb-3 text-center text-[13px] font-bold uppercase tracking-wide text-[#1f3864]">
                    {tocBlock.title}
                  </p>
                  {tocBlock.entries.map((e, i) =>
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
              )}

              {blocks.map((block, bi) => {
                const isLast = bi === blocks.length - 1;
                const isFlashing = flashAnchor === block.id;
                return (
                  <div
                    key={block.id}
                    data-anchor={block.id}
                    className={`${BLOCK_CLASS[block.style]} ${bi === 0 ? '' : BLOCK_MARGIN[block.style]} rounded transition-colors ${
                      isFlashing ? 'bg-emerald-100 ring-2 ring-emerald-400' : ''
                    }`}
                  >
                    {block.style === 'h2' && showMarks && <span className="mr-1 text-gray-300">→</span>}
                    {block.runs.map((run, ri) => (
                      <span key={ri}>
                        {run.marked ? (
                          <span className="rounded bg-gray-200 px-0.5">{run.text}</span>
                        ) : (
                          run.text
                        )}
                        {run.marker != null && (
                          <sup className="ml-0.5 font-semibold text-[#2b579a]">{run.marker}</sup>
                        )}
                      </span>
                    ))}
                    {isLast && !isDone && steps.length > 0 && <span className="animate-pulse">|</span>}
                    {showMarks && <span className="ml-0.5 text-gray-300">¶</span>}
                  </div>
                );
              })}
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