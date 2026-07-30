'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import { supabase } from '../../../lib/supabaseClient';
import WordSimulator from '../../../components/WordSimulator';
import { guideLessons, guideFinalExercise, gradeFinalExercise } from '../../../lib/oscolaGuide';

export default function ReferencesGuidePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stage, setStage] = useState('boot'); // boot -> lesson -> exercise -> results
  const [lessonIndex, setLessonIndex] = useState(0);
  const [phase, setPhase] = useState('teach'); // teach -> checkin -> checkin-feedback
  const [checkInChoice, setCheckInChoice] = useState(null);
  const [lessonScore, setLessonScore] = useState(0);

  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseResult, setExerciseResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (stage === 'boot') {
      const t = setTimeout(() => setStage('lesson'), 1400);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const lesson = guideLessons[lessonIndex];
  const totalPossible = guideLessons.length + (exerciseResult?.total ?? 0);
  const totalMarks = lessonScore + (exerciseResult?.score ?? 0);

  function chooseCheckIn(i) {
    if (checkInChoice !== null) return;
    setCheckInChoice(i);
    if (i === lesson.checkIn.correctIndex) setLessonScore((s) => s + 1);
    setPhase('checkin-feedback');
  }

  function advanceLesson() {
    setCheckInChoice(null);
    if (lessonIndex + 1 >= guideLessons.length) {
      setStage('exercise');
    } else {
      setLessonIndex((i) => i + 1);
      setPhase('teach');
    }
  }

  function submitExercise(e) {
    e.preventDefault();
    if (!exerciseAnswer.trim()) return;
    const result = gradeFinalExercise(exerciseAnswer);
    setExerciseResult(result);
    setStage('results');
  }

  async function saveScore(finalScore, finalTotal) {
    if (!user) return;
    setSaveStatus('saving');
    const { error } = await supabase.from('reference_progress').insert({
      user_id: user.id,
      activity: 'guide',
      score: finalScore,
      total: finalTotal,
    });
    setSaveStatus(error ? 'error' : 'saved');
  }

  useEffect(() => {
    if (stage === 'results' && exerciseResult) saveScore(totalMarks, guideLessons.length + exerciseResult.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function restart() {
    setStage('boot');
    setLessonIndex(0);
    setPhase('teach');
    setCheckInChoice(null);
    setLessonScore(0);
    setExerciseAnswer('');
    setExerciseResult(null);
    setSaveStatus('idle');
  }

  // The WordSimulator replays whenever this key changes, so a fresh example
  // plays each time a new lesson starts.
  const simResetKey = stage === 'lesson' ? `lesson-${lesson?.id}` : stage;
  const simSteps = stage === 'lesson' && lesson?.sim ? lesson.sim.steps : [];

  return (
    <main className="min-h-screen bg-[#050810] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/references"
          className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200"
        >
          ← Back to References
        </Link>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
          {/* Left: simulated PC / teaching frame — slim, clear side panel */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl lg:sticky lg:top-10">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#111826] px-4 py-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-gray-400">OSCOLA-Guide.exe</span>
            </div>

            <div className="min-h-[420px] bg-[#0b1220] p-6">
              {stage === 'boot' && (
                <div className="flex h-[380px] flex-col items-center justify-center text-center">
                  <p className="mb-2 animate-pulse text-docket-gold">Loading OSCOLA Guide…</p>
                  <p className="text-xs text-gray-500">Booting lesson modules</p>
                </div>
              )}

              {stage === 'lesson' && lesson && (
                <div className="mx-auto max-w-md rounded-xl border border-docket-gold/40 bg-docket-navy p-6 shadow-xl">
                  <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">
                    Lesson {lessonIndex + 1} / {guideLessons.length}
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
                        Quick check-in
                      </button>
                    </>
                  )}

                  {(phase === 'checkin' || phase === 'checkin-feedback') && (
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
                          {lessonIndex + 1 >= guideLessons.length ? 'Continue to exercise' : 'Next lesson'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {stage === 'exercise' && (
                <div className="mx-auto max-w-md rounded-xl border border-docket-gold/40 bg-docket-navy p-6 shadow-xl">
                  <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">
                    Build your own — {guideFinalExercise.sourceType}
                  </p>
                  <h2 className="mb-4 text-xl font-bold text-white">Your turn</h2>
                  <p className="mb-3 text-sm text-gray-400">
                    Using everything you just learned — including the pinpoint and short form — write the
                    full OSCOLA citation for:
                  </p>
                  <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-gray-300">
                    {guideFinalExercise.infoLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <form onSubmit={submitExercise}>
                    <textarea
                      value={exerciseAnswer}
                      onChange={(e) => setExerciseAnswer(e.target.value)}
                      rows={3}
                      placeholder="Type the full citation…"
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
                <div className="mx-auto max-w-md rounded-xl border border-docket-gold/40 bg-docket-navy p-6 text-center shadow-xl">
                  <p className="mb-2 text-xs uppercase tracking-widest text-docket-gold">
                    Well done — here's how you did
                  </p>
                  <h2 className="mb-1 text-3xl font-extrabold text-white">
                    🎉 Marks: {totalMarks} / {totalPossible}
                  </h2>
                  <p className="mb-6 text-sm text-gray-400">
                    Lessons: {lessonScore} / {guideLessons.length} · Exercise: {exerciseResult.score} /{' '}
                    {exerciseResult.total}
                  </p>

                  <div className="mb-6 space-y-2 text-left">
                    <p className="mb-1 text-xs uppercase tracking-widest text-gray-400">
                      Exercise breakdown
                    </p>
                    {exerciseResult.checks.map((c) => (
                      <p
                        key={c.label}
                        className={`text-sm ${c.pass ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {c.pass ? '✓' : '✗'} {c.label}
                      </p>
                    ))}
                    {exerciseResult.score < exerciseResult.total && (
                      <p className="mt-3 text-sm text-gray-400">
                        Correct citation:{' '}
                        <span className="text-docket-gold">{guideFinalExercise.correctCitation}</span>
                      </p>
                    )}
                  </div>

                  <p className="mb-6 text-xs text-gray-500">
                    {saveStatus === 'saving' && 'Saving your progress…'}
                    {saveStatus === 'saved' && 'Progress saved.'}
                    {saveStatus === 'error' && "Couldn't save your progress, but nice work either way."}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={restart}
                      className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
                    >
                      Retake the guide
                    </button>
                    <Link
                      href="/references"
                      className="rounded-lg border border-gray-500 px-6 py-3 font-semibold text-gray-300 hover:bg-docket-navy2"
                    >
                      Back to References
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: live Word simulator — the main screen */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
              Watch it applied live
            </p>
            <WordSimulator
              steps={simSteps}
              resetKey={simResetKey}
              idleMessage={
                stage === 'exercise'
                  ? "Now it's your turn — write the citation on the left. This screen will show the model answer once you submit."
                  : stage === 'results'
                  ? undefined
                  : 'The document will appear here as each lesson plays.'
              }
            />
            {stage === 'results' && exerciseResult && (
              <div className="mt-3 rounded-xl border border-white/10 bg-[#0b1220] p-4">
                <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">Model answer</p>
                <p className="text-sm text-gray-200">{guideFinalExercise.correctCitation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}