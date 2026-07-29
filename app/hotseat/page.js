'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';
import { getRandomConcept } from '../../lib/hotSeatWords';

const PLAN_SECONDS = 120;
const SPEAK_SECONDS = 60;

export default function HotSeatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [country, setCountry] = useState('');
  const [category, setCategory] = useState(null);
  const [stage, setStage] = useState('choose');
  const [word, setWord] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState('Ready');
  const [secondsLeft, setSecondsLeft] = useState(PLAN_SECONDS);
  const [rating, setRating] = useState(null);

  const spinIntervalRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('country')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setCountry(data?.country || ''));
  }, [user]);

  useEffect(() => {
    if (stage !== 'planning' && stage !== 'speaking') return;

    if (secondsLeft <= 0) {
      if (stage === 'planning') {
        setStage('speaking');
        setSecondsLeft(SPEAK_SECONDS);
      } else {
        setStage('done');
      }
      return;
    }

    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, secondsLeft]);

  function chooseCategory(cat) {
    setCategory(cat);
    setStage('wheel');
  }

  function spin() {
    setSpinning(true);
    let ticks = 0;
    const maxTicks = 18;
    spinIntervalRef.current = setInterval(() => {
      setWord(getRandomConcept(category));
      ticks += 1;
      if (ticks >= maxTicks) {
        clearInterval(spinIntervalRef.current);
        setSpinning(false);
        setStage('confirm');
      }
    }, 90);
  }

  function rerun() {
    setStage('wheel');
    setTimeout(spin, 150);
  }

  function accept() {
    setStage('countdown');
    setCountdownLabel('Ready');
    setTimeout(() => setCountdownLabel('Set'), 700);
    setTimeout(() => setCountdownLabel('Go!'), 1400);
    setTimeout(() => {
      setStage('planning');
      setSecondsLeft(PLAN_SECONDS);
    }, 2100);
  }

  function reset() {
    setStage('choose');
    setCategory(null);
    setWord('');
    setRating(null);
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-docket-navy px-6 py-12 text-center">
      <Link
        href="/home"
        className="absolute left-6 top-6 text-sm text-gray-400 underline hover:text-gray-200"
      >
        ← Back to home
      </Link>

      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-docket-gold">The Hot Seat</p>

      {stage === 'choose' && (
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-2xl font-bold text-white">Local or International?</h1>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => chooseCategory('local')}
              className="rounded-lg border border-docket-gold/50 bg-docket-navy2 px-6 py-4 font-semibold text-docket-gold hover:bg-docket-navy2/70"
            >
              Local Law {country ? `(${country})` : ''}
            </button>
            <button
              onClick={() => chooseCategory('international')}
              className="rounded-lg border border-docket-gold/50 bg-docket-navy2 px-6 py-4 font-semibold text-docket-gold hover:bg-docket-navy2/70"
            >
              International Law
            </button>
          </div>
          {!country && (
            <p className="mt-4 text-xs text-gray-500">
              Tip: add your country in{' '}
              <Link href="/retainer" className="underline">
                Settings
              </Link>{' '}
              to personalize Local rounds.
            </p>
          )}
        </div>
      )}

      {stage === 'wheel' && (
        <div className="w-full max-w-sm">
          <div
            className={`mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full border-4 border-docket-gold text-4xl ${
              spinning ? 'animate-spin' : ''
            }`}
          >
            ⚖️
          </div>
          {!spinning && (
            <button
              onClick={spin}
              className="rounded-full bg-docket-gold px-8 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
            >
              Tap to spin
            </button>
          )}
          {spinning && <p className="text-xl font-bold text-white">{word}</p>}
        </div>
      )}

      {stage === 'confirm' && (
        <div className="w-full max-w-sm">
          <p className="mb-2 text-sm text-gray-400">Your concept:</p>
          <h1 className="mb-10 text-3xl font-bold text-white">{word}</h1>
          <div className="flex gap-3">
            <button
              onClick={rerun}
              className="flex-1 rounded-lg border border-gray-500 px-5 py-3 font-semibold text-gray-300 hover:bg-docket-navy2"
            >
              Re-run
            </button>
            <button
              onClick={accept}
              className="flex-1 rounded-lg bg-docket-gold px-5 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {stage === 'countdown' && (
        <p className="animate-pulse text-6xl font-extrabold text-docket-gold">{countdownLabel}</p>
      )}

      {(stage === 'planning' || stage === 'speaking') && (
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold text-white">{word}</h1>
          <p className="mb-2 text-xs uppercase tracking-widest text-docket-gold">
            {stage === 'planning' ? 'Plan your argument' : 'Argue it out'}
          </p>
          <p className="text-6xl font-extrabold text-white">{formatTime(secondsLeft)}</p>
        </div>
      )}

      {stage === 'done' && (
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-3xl font-bold text-white">Time's up!</h1>
          <p className="mb-8 text-gray-400">How did that feel?</p>

          {!rating ? (
            <div className="flex justify-center gap-4 text-3xl">
              <button onClick={() => setRating('rough')} title="Rough" className="hover:scale-110 transition">😅</button>
              <button onClick={() => setRating('okay')} title="Okay" className="hover:scale-110 transition">😐</button>
              <button onClick={() => setRating('strong')} title="Strong" className="hover:scale-110 transition">💪</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="mb-2 text-sm text-gray-400">Logged — nice work.</p>
              <button
                onClick={rerun}
                className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
              >
                Spin again
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-gray-500 px-6 py-3 font-semibold text-gray-300 hover:bg-docket-navy2"
              >
                Choose a different category
              </button>
              <Link href="/home" className="mt-2 text-sm text-gray-400 underline hover:text-gray-200">
                Back to home
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}