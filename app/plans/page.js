'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';
import { ensureProfile } from '../../lib/profile';

function CheckItem({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-300">
      <svg
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-docket-gold"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </li>
  );
}

export default function PlansPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  async function startFree() {
    if (!user) return;
    setBusy(true);
    setError('');
    try {
      const { profile } = await ensureProfile(user);
      if (!profile.name) {
        router.push('/retainer');
      } else {
        router.push('/home');
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      {/* top bar */}
      <div className="mx-auto mb-14 flex max-w-5xl items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-docket-gold">The Docket</span>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/');
          }}
          className="text-sm text-gray-400 underline hover:text-gray-200"
        >
          Log out
        </button>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-3 text-4xl font-bold text-white">Choose your plan</h1>
        <p className="mb-14 text-gray-400">
          Train with structured feedback on every memorial, then step up when you're ready
          for unlimited oral rounds and rankings.
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* FREE */}
          <div className="rounded-2xl border border-docket-gold/50 bg-gradient-to-b from-docket-navy2 to-docket-navy p-8 text-left shadow-[0_0_40px_-12px_rgba(201,162,75,0.35)]">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-docket-gold">
              Free
            </h2>
            <p className="mb-6 text-3xl font-bold text-white">$0</p>

            <ul className="mb-8 flex flex-col gap-3">
              <CheckItem>5 oral rounds</CheckItem>
              <CheckItem>Unlimited written memorials</CheckItem>
              <CheckItem>AI feedback on every submission</CheckItem>
            </ul>

            <button
              onClick={startFree}
              disabled={busy}
              className="w-full rounded-lg bg-docket-gold px-5 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2 disabled:opacity-60"
            >
              {busy ? 'Setting up…' : 'Start Free'}
            </button>
          </div>

          {/* PAID */}
          <div className="rounded-2xl border border-gray-700 bg-gradient-to-b from-docket-navy2/70 to-docket-navy/70 p-8 text-left opacity-90">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
              Paid
            </h2>
            <p className="mb-6 text-3xl font-bold text-gray-200">—</p>

            <ul className="mb-8 flex flex-col gap-3">
              <CheckItem>Unlimited oral rounds</CheckItem>
              <CheckItem>Rankings</CheckItem>
              <CheckItem>Priority feedback</CheckItem>
            </ul>

            <Link
              href="/payment"
              className="block w-full cursor-not-allowed rounded-lg border border-gray-600 bg-gray-800/60 px-5 py-3 text-center font-semibold text-gray-400"
            >
              Upgrade <span className="text-xs">(Coming soon)</span>
            </Link>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}