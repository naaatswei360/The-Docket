'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/AuthProvider';
import { supabase } from '../../../../lib/supabaseClient';
import { pickRandomQuestions, shuffle } from '../../../../lib/oscolaQuestions';

const TOTAL_QUESTIONS = 10;
const START_HEALTH = 3;

export default function HostileJudgeGame() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [health, setHealth] = useState(START_HEALTH);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correct, message }
  const [stage, setStage] = useState('playing'); // playing -> done ('survived' | 'defeated')
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS));
  }, []);

  const current = questions[index];

  const options = useMemo(() => {
    if (!current) return [];
    return shuffle([
      { text: current.correctCitation, isCorrect: true },
      ...current.wrongOptions.map((text) => ({ text, isCorrect: false })),
    ]);
  }, [current]);

  function choose(option) {
    if (feedback) return; // already answered this question
    setPicked(option);

    if (option.isCorrect) {
      setScore((s) => s + 1);
      setFeedback({ correct: true, message: 'Correct. The judge (reluctantly) lets you continue.' });
    } else {
      const newHealth = health - 1;
      setHealth(newHealth);
      setFeedback({
        correct: false,
        message:
          newHealth <= 0
            ? 'Wrong — and that was your last health point. The judge has heard enough.'
            : "Wrong. The judge is unimpressed, but you survive... for now.",
      });
    }
  }

  function next() {
    const newHealth = health;
    setPicked(null);
    setFeedback(null);

    if (newHealth <= 0) {
      setStage('done-defeated');
      return;
    }
    if (index + 1 >= questions.length) {
      setStage('done-survived');
      return;
    }
    setIndex((i) => i + 1);
  }

  async function saveScore() {
    if (!user) return;
    setSaveStatus('saving');
    const { error } = await supabase.from('reference_progress').insert({
      user_id: user.id,
      activity: 'hostile_judge',
      score,
      total: TOTAL_QUESTIONS,
    });
    setSaveStatus(error ? 'error' : 'saved');
  }

  useEffect(() => {
    if (stage === 'done-defeated' || stage === 'done-survived') saveScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function playAgain() {
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS));
    setIndex(0);
    setHealth(START_HEALTH);
    setScore(0);
    setPicked(null);
    setFeedback(null);
    setSaveStatus('idle');
    setStage('playing');
  }

  const isDone = stage === 'done-defeated' || stage === 'done-survived';

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

        {!isDone && (
          <>
            <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-widest text-gray-400">
              <span>
                Question {index + 1} / {questions.length}
              </span>
              <span className="text-docket-gold">
                Health: {'❤️'.repeat(health)}
                {'🖤'.repeat(START_HEALTH - health)}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-docket-navy2 p-6">
              <p className="mb-1 text-xs uppercase tracking-widest text-docket-gold">
                {current.sourceType} · {current.jurisdiction === 'local' ? 'Local' : 'International'}
              </p>
              <h1 className="mb-4 text-xl font-bold text-white">
                Which citation is correctly OSCOLA-formatted?
              </h1>

              <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {current.infoLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <div className="mb-6 flex flex-col gap-3">
                {options.map((option) => {
                  const isPicked = picked?.text === option.text;
                  let style = 'border-white/10 bg-docket-navy hover:border-docket-gold';
                  if (feedback && isPicked) {
                    style = option.isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10';
                  } else if (feedback && option.isCorrect) {
                    style = 'border-green-500 bg-green-500/10';
                  }
                  return (
                    <button
                      key={option.text}
                      onClick={() => choose(option)}
                      disabled={!!feedback}
                      className={`rounded-lg border px-4 py-3 text-left text-sm text-gray-100 transition ${style}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className="rounded-lg bg-black/40 px-4 py-3 text-sm">
                  <p className={feedback.correct ? 'mb-2 text-green-400' : 'mb-2 text-red-400'}>
                    {feedback.message}
                  </p>
                  <p className="mb-4 text-gray-400">{current.ruleExplanation}</p>
                  <button
                    onClick={next}
                    className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {isDone && (
          <div className="rounded-2xl border border-docket-gold/40 bg-docket-navy2 p-8 text-center">
            <p className="mb-2 text-xs uppercase tracking-widest text-docket-gold">
              {stage === 'done-survived' ? 'You survived!' : 'The judge has ruled against you'}
            </p>
            <h1 className="mb-6 text-4xl font-extrabold text-white">
              {score} / {TOTAL_QUESTIONS}
            </h1>

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
                Face the judge again
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
