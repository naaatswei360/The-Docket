'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/AuthProvider';
import { supabase } from '../../../../lib/supabaseClient';
import { pickRandomQuestions, normalizeCitation } from '../../../../lib/oscolaQuestions';

const TOTAL_QUESTIONS = 10;

export default function WriteCitationGame() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [log, setLog] = useState([]); // { question, yourAnswer, correct, correctCitation, ruleExplanation }
  const [stage, setStage] = useState('playing'); // playing -> result -> done
  const [lastResult, setLastResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS));
  }, []);

  const current = questions[index];
  const score = log.filter((entry) => entry.correct).length;

  function submitAnswer(e) {
    e.preventDefault();
    if (!current || !answer.trim()) return;

    const correct = normalizeCitation(answer) === normalizeCitation(current.correctCitation);
    const entry = {
      question: current,
      yourAnswer: answer.trim(),
      correct,
    };
    setLog((prev) => [...prev, entry]);
    setLastResult(entry);
    setStage('result');
  }

  function nextQuestion() {
    setAnswer('');
    setLastResult(null);
    if (index + 1 >= questions.length) {
      setStage('done');
    } else {
      setIndex((i) => i + 1);
      setStage('playing');
    }
  }

  async function saveScore(finalScore) {
    if (!user) return;
    setSaveStatus('saving');
    const { error } = await supabase.from('reference_progress').insert({
      user_id: user.id,
      activity: 'write_citation',
      score: finalScore,
      total: TOTAL_QUESTIONS,
    });
    setSaveStatus(error ? 'error' : 'saved');
  }

  useEffect(() => {
    if (stage === 'done') saveScore(score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function playAgain() {
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS));
    setIndex(0);
    setAnswer('');
    setLog([]);
    setLastResult(null);
    setSaveStatus('idle');
    setStage('playing');
  }

  if (!questions.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-docket-navy text-gray-400">
        Loading questions…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-docket-navy px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/references/games"
          className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200"
        >
          ← Back to games
        </Link>

        {stage !== 'done' && (
          <>
            <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-widest text-gray-400">
              <span>
                Question {index + 1} / {questions.length}
              </span>
              <span className="text-docket-gold">Score: {score}</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-docket-navy2 p-6">
              <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">
                {current.sourceType} · {current.jurisdiction === 'local' ? 'Local' : 'International'}
              </p>
              <h1 className="mb-4 text-xl font-bold text-white">Write the OSCOLA citation</h1>

              <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {current.infoLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              {stage === 'playing' && (
                <form onSubmit={submitAnswer}>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={3}
                    placeholder="Type the full citation…"
                    className="mb-4 w-full rounded-lg border border-gray-500 bg-white px-3 py-3 text-docket-navy"
                  />
                  <button
                    type="submit"
                    disabled={!answer.trim()}
                    className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2 disabled:opacity-60"
                  >
                    Submit
                  </button>
                </form>
              )}

              {stage === 'result' && lastResult && (
                <div>
                  <p
                    className={`mb-3 font-semibold ${
                      lastResult.correct ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {lastResult.correct ? 'Correct!' : 'Not quite.'}
                  </p>
                  <p className="mb-1 text-sm text-gray-400">Your answer:</p>
                  <p className="mb-3 rounded-lg bg-docket-navy px-3 py-2 text-sm text-gray-200">
                    {lastResult.yourAnswer}
                  </p>
                  {!lastResult.correct && (
                    <>
                      <p className="mb-1 text-sm text-gray-400">Correct citation:</p>
                      <p className="mb-3 rounded-lg bg-docket-navy px-3 py-2 text-sm text-docket-gold">
                        {current.correctCitation}
                      </p>
                    </>
                  )}
                  <p className="mb-6 text-sm text-gray-400">{current.ruleExplanation}</p>
                  <button
                    onClick={nextQuestion}
                    className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2"
                  >
                    {index + 1 >= questions.length ? 'See results' : 'Next question'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {stage === 'done' && (
          <div className="rounded-2xl border border-docket-gold/40 bg-docket-navy2 p-8 text-center">
            <p className="mb-2 text-xs uppercase tracking-widest text-docket-gold">Final score</p>
            <h1 className="mb-6 text-4xl font-extrabold text-white">
              {score} / {TOTAL_QUESTIONS}
            </h1>

            <div className="mb-8 space-y-3 text-left">
              {log.map((entry, i) => (
                <div
                  key={entry.question.id}
                  className={`rounded-lg border p-3 text-sm ${
                    entry.correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-widest text-gray-400">
                    Q{i + 1} · {entry.question.sourceType}
                  </p>
                  <p className={entry.correct ? 'text-green-400' : 'text-red-400'}>
                    {entry.correct ? 'Correct' : `Correct answer: ${entry.question.correctCitation}`}
                  </p>
                </div>
              ))}
            </div>

            <p className="mb-6 text-xs text-gray-500">
              {saveStatus === 'saving' && 'Saving your score…'}
              {saveStatus === 'saved' && 'Score saved.'}
              {saveStatus === 'error' && "Couldn't save your score, but nice work either way."}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={playAgain}
                className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
              >
                Play again
              </button>
              <Link
                href="/references/games"
                className="rounded-lg border border-gray-500 px-6 py-3 font-semibold text-gray-300 hover:bg-docket-navy2"
              >
                Back to games
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
