'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';
import WordSimulator from '../../components/WordSimulator';
import {
  tocLessons,
  tocFinalExercise,
  gradeTocFinalExercise,
  toaLessons,
  toaFinalExercise,
  gradeToaFinalExercise,
} from '../../lib/tocToaGuide';

const TRACKS = {
  toc: {
    label: 'Table of Contents',
    short: 'ToC',
    icon: '📑',
    lessons: tocLessons,
    finalExercise: tocFinalExercise,
    grade: gradeTocFinalExercise,
    blurb: 'Heading styles, paragraph marks, and an auto-updating, clickable contents page.',
  },
  toa: {
    label: 'Table of Authorities',
    short: 'ToA',
    icon: '⚖️',
    lessons: toaLessons,
    finalExercise: toaFinalExercise,
    grade: gradeToaFinalExercise,
    blurb: 'Mark citations, group them by category, and build a table a judge can navigate.',
  },
};

export default function TocToaGuidePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [track, setTrack] = useState(null); // 'toc' | 'toa'
  const [stage, setStage] = useState('choice'); // choice -> boot -> lesson -> exercise -> results
  const [lessonIndex, setLessonIndex] = useState(0);
  const [phase, setPhase] = useState('teach'); // teach -> checkin -> checkin-feedback
  const [checkInChoice, setCheckInChoice] = useState(null);
  const [interactionDone, setInteractionDone] = useState(false);
  const [lessonScore, setLessonScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseResult, setExerciseResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (stage === 'boot') {
      const t = setTimeout(() => setStage('lesson'), 1200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const config = track ? TRACKS[track] : null;
  const lessons = config?.lessons ?? [];
  const lesson = lessons[lessonIndex];
  const totalPossible = lessons.length + (exerciseResult?.total ?? 0);
  const totalMarks = lessonScore + (exerciseResult?.score ?? 0);

  function pickTrack(key) {
    setTrack(key);
    setStage('boot');
  }

  function chooseCheckIn(i) {
    if (checkInChoice !== null) return;
    setCheckInChoice(i);
    if (i === lesson.checkIn.correctIndex) setLessonScore((s) => s + 1);
    setPhase('checkin-feedback');
  }

  function handleInteract() {
    if (interactionDone) return;
    setInteractionDone(true);
    setLessonScore((s) => s + 1);
  }

  function advanceLesson() {
    setCheckInChoice(null);
    setInteractionDone(false);
    setShowHint(false);
    if (lessonIndex + 1 >= lessons.length) {
      setStage('exercise');
    } else {
      setLessonIndex((i) => i + 1);
      setPhase('teach');
    }
  }

  function submitExercise(e) {
    e.preventDefault();
    if (!exerciseAnswer.trim()) return;
    const result = config.grade(exerciseAnswer);
    setExerciseResult(result);
    setStage('results');
  }

  async function saveScore(finalScore, finalTotal) {
    if (!user) return;
    setSaveStatus('saving');
    const { error } = await supabase.from('reference_progress').insert({
      user_id: user.id,
      activity: `toc-toa-${track}`,
      score: finalScore,
      total: finalTotal,
    });
    setSaveStatus(error ? 'error' : 'saved');
  }

  useEffect(() => {
    if (stage === 'results' && exerciseResult) saveScore(totalMarks, lessons.length + exerciseResult.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function restart() {
    setTrack(null);
    setStage('choice');
    setLessonIndex(0);
    setPhase('teach');
    setCheckInChoice(null);
    setInteractionDone(false);
    setLessonScore(0);
    setExerciseAnswer('');
    setExerciseResult(null);
    setSaveStatus('idle');
    setShowHint(false);
    setCopied(false);
  }

  function copySummary() {
    const text = [
      `${config.label} — completed`,
      `Score: ${totalMarks} / ${totalPossible}`,
      '',
      'Model answer:',
      config.finalExercise.modelAnswer,
    ].join('\n');
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const simResetKey = stage === 'lesson' && lesson ? `${track}-${lesson.id}` : `${track}-${stage}`;
  const simSteps = stage === 'lesson' && lesson?.sim ? lesson.sim.steps : [];
  const progressPct = lessons.length ? Math.round(((lessonIndex + (phase !== 'teach' ? 0.5 : 0)) / lessons.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#050810] px-6 py-10">
      <div className="mx-auto max-w-[1240px]">
        <Link href="/home" className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back to Home
        </Link>

        {/* Choice screen */}
        {stage === 'choice' && (
          <div className="mx-auto max-w-2xl py-10 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-docket-gold">Structure Your Memorial</p>
            <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Table of Contents & Authorities</h1>
            <p className="mx-auto mb-10 max-w-lg text-gray-400">
              A live, working Microsoft Word simulator teaches you each rule as you watch it happen. Pick a track to
              start.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {Object.entries(TRACKS).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => pickTrack(key)}
                  className="group rounded-2xl border border-white/10 bg-docket-navy2 p-7 text-left backdrop-blur-sm transition hover:border-docket-gold hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.5)]"
                >
                  <div className="mb-3 text-3xl">{t.icon}</div>
                  <h2 className="mb-1 text-lg font-semibold text-white group-hover:text-docket-gold">
                    {t.label} <span className="text-sm text-gray-500">({t.short})</span>
                  </h2>
                  <p className="text-sm text-gray-400">{t.blurb}</p>
                  <p className="mt-3 text-xs text-gray-500">{t.lessons.length} lessons + a build-your-own exercise</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Guided flow */}
        {stage !== 'choice' && config && (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
            {/* Left: teaching panel — slim, clear side panel */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl lg:sticky lg:top-10">
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#111826] px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-gray-400">
                  {config.short}-Guide.exe
                </span>
              </div>

              <div className="min-h-[420px] bg-[#0b1220] p-6">
                {stage === 'boot' && (
                  <div className="flex h-[380px] flex-col items-center justify-center text-center">
                    <p className="mb-2 animate-pulse text-docket-gold">Loading {config.label} Guide…</p>
                    <p className="text-xs text-gray-500">Booting lesson modules</p>
                  </div>
                )}

                {stage === 'lesson' && lesson && (
                  <div className="mx-auto max-w-md rounded-xl border border-docket-gold/40 bg-docket-navy p-6 shadow-xl">
                    <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">
                      Lesson {lessonIndex + 1} / {lessons.length}
                    </p>
                    <h2 className="mb-4 text-xl font-bold text-white">{lesson.title}</h2>

                    {phase === 'teach' && (
                      <>
                        <div className="mb-6 space-y-3 text-sm text-gray-300">
                          {lesson.body.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                        <p className="mb-4 text-xs text-gray-500 lg:hidden">
                          👉 Watch the Word simulator below to see this rule applied live.
                        </p>
                        <button
                          onClick={() => setPhase('checkin')}
                          className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
                        >
                          {lesson.interactive ? "Try it" : 'Quick check-in'}
                        </button>
                      </>
                    )}

                    {phase === 'checkin' && lesson.interactive && (
                      <>
                        <p className="mb-4 text-sm text-gray-200">
                          Click any linked entry in the Word simulator on the right to continue.
                        </p>
                        <div
                          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                            interactionDone
                              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                              : 'border-gray-600 text-gray-400'
                          }`}
                        >
                          {interactionDone ? `✓ ${lesson.interactive.doneLabel}` : 'Waiting for a click…'}
                        </div>
                        <button
                          onClick={advanceLesson}
                          disabled={!interactionDone}
                          className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {lessonIndex + 1 >= lessons.length ? 'Continue to exercise' : 'Next lesson'}
                        </button>
                      </>
                    )}

                    {(phase === 'checkin' || phase === 'checkin-feedback') && lesson.checkIn && (
                      <>
                        <p className="mb-4 text-sm text-gray-200">{lesson.checkIn.question}</p>
                        <div className="mb-4 flex flex-col gap-2">
                          {lesson.checkIn.options.map((opt, i) => {
                            let style = 'border-gray-600 hover:border-docket-gold';
                            if (phase === 'checkin-feedback') {
                              if (i === lesson.checkIn.correctIndex) style = 'border-green-500 bg-green-500/10';
                              else if (i === checkInChoice) style = 'border-red-500 bg-red-500/10';
                            }
                            return (
                              <button
                                key={opt}
                                onClick={() => chooseCheckIn(i)}
                                disabled={phase === 'checkin-feedback'}
                                className={`rounded-lg border px-4 py-2 text-left text-sm text-gray-100 transition ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {phase === 'checkin-feedback' && (
                          <button
                            onClick={advanceLesson}
                            className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
                          >
                            {lessonIndex + 1 >= lessons.length ? 'Continue to exercise' : 'Next lesson'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {stage === 'exercise' && (
                  <div className="mx-auto max-w-md rounded-xl border border-docket-gold/40 bg-docket-navy p-6 shadow-xl">
                    <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">Build your own</p>
                    <h2 className="mb-4 text-xl font-bold text-white">Your turn</h2>
                    <p className="mb-6 text-sm text-gray-300">{config.finalExercise.prompt}</p>
                    <form onSubmit={submitExercise}>
                      <textarea
                        value={exerciseAnswer}
                        onChange={(e) => setExerciseAnswer(e.target.value)}
                        rows={4}
                        placeholder="Type your answer…"
                        className="mb-4 w-full rounded-lg border border-gray-500 bg-white px-3 py-3 text-docket-navy"
                      />
                      <button
                        type="submit"
                        disabled={!exerciseAnswer.trim()}
                        className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2 disabled:opacity-60"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                )}

                {stage === 'results' && exerciseResult && (
                  <div className="mx-auto max-w-md rounded-xl border border-emerald-400/50 bg-docket-navy p-6 text-center shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)]">
                    <p className="mb-2 text-xs uppercase tracking-widest text-emerald-400">Well done</p>
                    <h2 className="mb-1 text-3xl font-extrabold text-white">
                      🎉 Marks: {totalMarks} / {totalPossible}
                    </h2>
                    <p className="mb-6 text-sm text-gray-400">
                      Lessons: {lessonScore} / {lessons.length} · Exercise: {exerciseResult.score} /{' '}
                      {exerciseResult.total}
                    </p>

                    <div className="mb-6 space-y-2 text-left">
                      <p className="mb-1 text-xs uppercase tracking-widest text-gray-400">Exercise breakdown</p>
                      {exerciseResult.checks.map((c) => (
                        <p key={c.label} className={`text-sm ${c.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                          {c.pass ? '✓' : '✗'} {c.label}
                        </p>
                      ))}
                      <p className="mt-3 text-sm text-gray-400">
                        Model answer: <span className="text-docket-gold">{config.finalExercise.modelAnswer}</span>
                      </p>
                    </div>

                    <p className="mb-4 text-xs text-gray-500">
                      {saveStatus === 'saving' && 'Saving your progress…'}
                      {saveStatus === 'saved' && 'Progress saved.'}
                      {saveStatus === 'error' && "Couldn't save your progress, but nice work either way."}
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={copySummary}
                        className="rounded-lg border border-emerald-400 px-6 py-3 font-semibold text-emerald-300 hover:bg-emerald-400/10"
                      >
                        {copied ? '✓ Copied' : 'Copy summary'}
                      </button>
                      <button
                        onClick={restart}
                        className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
                      >
                        Try the other track
                      </button>
                      <Link
                        href="/home"
                        className="rounded-lg border border-gray-500 px-6 py-3 font-semibold text-gray-300 hover:bg-docket-navy2"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: live Word simulator — the main screen */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">Watch it applied live</p>
              <WordSimulator
                steps={simSteps}
                resetKey={simResetKey}
                onInteract={handleInteract}
                idleMessage={
                  stage === 'exercise'
                    ? 'This screen will show the model answer once you submit.'
                    : 'The document will appear here as each lesson plays.'
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating glassmorphic guide companion */}
      {stage === 'lesson' && lesson && (
        <div className="fixed bottom-6 right-6 z-40 w-72 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-gray-300">
              Step {lessonIndex + 1} of {lessons.length}
            </span>
            <span className="text-[10px] text-emerald-300">{config.short}</span>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mb-1 text-sm font-semibold text-white">{lesson.title}</p>
          <p className="mb-3 text-xs leading-relaxed text-gray-300">{lesson.body[0]}</p>
          {lesson.hint && (
            <>
              <button
                onClick={() => setShowHint((h) => !h)}
                className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300 hover:text-emerald-200"
              >
                {showHint ? 'Hide hint ▲' : 'Hint ▼'}
              </button>
              {showHint && <p className="mt-2 text-xs italic leading-relaxed text-gray-300">{lesson.hint}</p>}
            </>
          )}
        </div>
      )}
    </main>
  );
}