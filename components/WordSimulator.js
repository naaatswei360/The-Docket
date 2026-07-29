'use client';

import { useEffect, useRef, useState } from 'react';

const RIBBON_TABS = ['Home', 'Insert', 'Layout', 'References'];

/**
 * A simulated Microsoft Word window that plays a script of `steps` for a
 * lesson — typing body text, dropping in footnote markers, filling out the
 * footnote pane, and surfacing a short callout under the page explaining
 * what just happened. Pass a new `resetKey` (e.g. the lesson id) to restart
 * the playback for a new lesson.
 *
 * step shape:
 *   {
 *     pane: 'body' | 'footnote',
 *     text: string,          // text to append
 *     marker?: number,       // (body only) superscript footnote number to insert
 *     num?: number,          // (footnote only) which footnote this text belongs to
 *     clear?: boolean,       // wipe this pane instead of appending
 *     ribbon?: 'Home' | 'Insert' | 'Layout' | 'References',
 *     note?: string,         // callout shown under the document for this step
 *   }
 */
export default function WordSimulator({ steps = [], resetKey, idleMessage }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [body, setBody] = useState([]);
  const [footnotes, setFootnotes] = useState([]);
  const [note, setNote] = useState('');
  const [ribbon, setRibbon] = useState('Home');
  const [flashKey, setFlashKey] = useState(0);
  const timerRef = useRef(null);

  function reset() {
    clearTimeout(timerRef.current);
    setStepIndex(0);
    setBody([]);
    setFootnotes([]);
    setNote('');
    setRibbon('Home');
  }

  // Restart the whole playback whenever we're handed a new lesson.
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  function applyStep(step) {
    if (step.ribbon) setRibbon(step.ribbon);

    if (step.pane === 'body') {
      if (step.clear) setBody([]);
      else setBody((b) => [...b, { text: step.text, marker: step.marker }]);
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
    let lastNote = '';
    let lastRibbon = ribbon;
    steps.forEach((step) => {
      if (step.ribbon) lastRibbon = step.ribbon;
      if (step.pane === 'body') {
        if (step.clear) b = [];
        else b = [...b, { text: step.text, marker: step.marker }];
      } else if (step.pane === 'footnote') {
        if (step.clear) {
          fs = [];
        } else {
          const existing = fs.find((f) => f.num === step.num);
          fs = existing
            ? fs.map((f) => (f.num === step.num ? { ...f, text: f.text + step.text } : f))
            : [...fs, { num: step.num, text: step.text }];
        }
      }
      lastNote = step.note || lastNote;
    });
    setBody(b);
    setFootnotes(fs);
    setNote(lastNote);
    setRibbon(lastRibbon);
    setStepIndex(steps.length);
    setFlashKey((k) => k + 1);
  }

  const isDone = steps.length > 0 && stepIndex >= steps.length;
  const hasStarted = body.length > 0 || footnotes.length > 0;

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
      <div className="flex min-h-[360px] items-start justify-center bg-[#3a3a3a] p-6">
        <div className="flex min-h-[320px] w-full max-w-[420px] flex-col justify-between rounded-sm bg-white p-6 text-[#1a1a1a] shadow-lg">
          <div>
            {hasStarted ? (
              <p className="text-[13px] leading-relaxed">
                {body.map((run, i) => (
                  <span key={i}>
                    {run.text}
                    {run.marker != null && (
                      <sup className="ml-0.5 font-semibold text-[#2b579a]">{run.marker}</sup>
                    )}
                  </span>
                ))}
                {!isDone && steps.length > 0 && <span className="animate-pulse">|</span>}
              </p>
            ) : (
              <p className="text-[13px] italic text-gray-300">
                {idleMessage || 'The document will appear here as the lesson plays.'}
              </p>
            )}
          </div>

          <div>
            {footnotes.length > 0 && (
              <div className="mt-6 border-t border-gray-300 pt-2">
                {footnotes.map((f) => (
                  <p key={f.num} className="text-[11px] leading-snug text-gray-700">
                    <sup className="mr-1 font-semibold">{f.num}</sup>
                    {f.text}
                    {!isDone && steps.length > 0 && stepIndex === steps.length && null}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-3 text-center text-[10px] text-gray-400">1</p>
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