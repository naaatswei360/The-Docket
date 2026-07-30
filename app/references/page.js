'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

export default function ReferencesLandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  return (
    <main className="min-h-screen bg-docket-navy px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/home"
          className="mb-8 inline-block text-sm text-gray-400 underline hover:text-gray-200"
        >
          ← Back to Home
        </Link>

        <p className="mb-2 text-center text-xs uppercase tracking-[0.3em] text-docket-gold">
          References
        </p>
        <h1 className="mb-3 text-center text-3xl font-bold text-white">
          How do you want to learn OSCOLA?
        </h1>
        <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
          Work through a guided, step-by-step walkthrough, get help from the AI assistant, or
          test what you know in the citation games.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Box 1: Step-by-step guide */}
          <Link
            href="/references/guide"
            className="flex flex-col rounded-xl border border-docket-gold/40 bg-docket-navy2 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold hover:bg-docket-navy2/80"
          >
            <div className="mb-3 text-2xl">🖥️</div>
            <h2 className="mb-1 font-semibold text-white">Step-by-step reference guide</h2>
            <p className="mb-4 flex-1 text-sm text-gray-400">
              A simulated PC walks you through OSCOLA from scratch, pop-up by pop-up, then has
              you build your own citation. Marks and errors shown at the end.
            </p>
            <span className="text-xs font-semibold uppercase tracking-widest text-docket-gold">
              Start the guide →
            </span>
          </Link>

          {/* Box 2: AI powered — inactive */}
          <div
            className="flex cursor-not-allowed flex-col rounded-xl border border-gray-700 bg-docket-navy2/60 p-6 text-left opacity-60"
            title="Coming soon"
          >
            <div className="mb-3 text-2xl">🤖</div>
            <h2 className="mb-1 font-semibold text-white">AI powered</h2>
            <p className="mb-4 flex-1 text-sm text-gray-400">
              Give it your source details and it either finds the OSCOLA citation for you or
              collates the details you fill in into a finished citation.
            </p>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Coming soon
            </span>
          </div>

          {/* Box 3: Games */}
          <Link
            href="/references/games"
            className="flex flex-col rounded-xl border border-docket-gold/40 bg-docket-navy2 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold hover:bg-docket-navy2/80"
          >
            <div className="mb-3 text-2xl">🎮</div>
            <h2 className="mb-1 font-semibold text-white">Games</h2>
            <p className="mb-4 flex-1 text-sm text-gray-400">
              Correct bad legal citations to survive a hostile court judge, or write citations
              from scratch. Ten random questions each round, local and international.
            </p>
            <span className="text-xs font-semibold uppercase tracking-widest text-docket-gold">
              Play →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
