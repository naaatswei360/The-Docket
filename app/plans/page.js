'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';
import { ensureProfile } from '../../lib/profile';
import ComingSoon from '../../components/ComingSoon';

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
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">Choose a plan</h1>
        <p className="mb-10 text-gray-400">
          The prototype runs entirely on the free tier — paid plans are shown for context only.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-docket-gold/40 bg-docket-navy2 p-6">
            <h2 className="mb-2 text-xl font-semibold text-docket-gold">Free</h2>
            <p className="mb-6 text-sm text-gray-400">5 oral rounds, unlimited written memorials, AI feedback.</p>
            <button
              onClick={startFree}
              disabled={busy}
              className="w-full rounded-lg bg-docket-gold px-5 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
            >
              {busy ? 'Setting up…' : 'Start Free'}
            </button>
          </div>

          <div className="rounded-xl border border-gray-700 bg-docket-navy2/60 p-6 opacity-80">
            <h2 className="mb-2 text-xl font-semibold text-gray-300">Paid</h2>
            <p className="mb-6 text-sm text-gray-500">Unlimited oral rounds, rankings, priority feedback.</p>
            <Link href="/payment">
              <ComingSoon label="Upgrade" className="w-full" />
            </Link>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}
