'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';

export default function ReferenceGamesLandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  return (
    <main className="min-h-screen bg-docket-navy px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/references"
          className="mb-8 inline-block text-sm text-gray-400 underline hover:text-gray-200"
        >
          ← Back to References
        </Link>

        <p className="mb-2 text-center text-xs uppercase tracking-[0.3em] text-docket-gold">
          Citation games
        </p>
        <h1 className="mb-3 text-center text-3xl font-bold text-white">Pick a game</h1>
        <p className="mx-auto mb-12 max-w-md text-center text-gray-400">
          Ten random questions each round, mixing local and international sources. Marks are out
          of 10.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/references/games/write-citation"
            className="rounded-xl border border-white/10 bg-docket-navy2 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold"
          >
            <div className="mb-3 text-2xl">✍️</div>
            <h2 className="mb-1 font-semibold text-white">Write the citation</h2>
            <p className="text-sm text-gray-400">
              You're given the raw facts about a source — write the correct OSCOLA citation
              yourself. Marks and comments after each question.
            </p>
          </Link>

          <Link
            href="/references/games/hostile-judge"
            className="rounded-xl border border-docket-gold/40 bg-docket-navy2 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold"
          >
            <div className="mb-3 text-2xl">⚖️</div>
            <h2 className="mb-1 font-semibold text-white">Hostile judge quiz</h2>
            <p className="text-sm text-gray-400">
              Multiple-choice. Pick the correctly formatted citation to survive — wrong answers
              cost you a health point.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
