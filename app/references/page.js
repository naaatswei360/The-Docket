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
        <Link href="/home" className="mb-8 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back to home
        </Link>

        <p className="mb-2 text-center text-xs uppercase tracking-[0.3em] text-docket-gold">
          References
        </p>
        <h1 className="mb-3 text-center text-3xl font-bold text-white sm:text-4xl">
          Learn, build and test OSCOLA citations
        </h1>
        <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
          Choose a guided path, use a structured builder, or challenge yourself with citation games.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <Link
            href="/references/guide"
            className="rounded-xl border border-white/10 bg-docket-navy2 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold"
          >
            <div className="mb-3 text-2xl">🖥️</div>
            <h2 className="mb-1 font-semibold text-white">Step-by-step guide</h2>
            <p className="text-sm text-gray-400">
              Simulated PC-style pop-ups that teach OSCOLA from basics to full citations, with
              marks and error feedback.
            </p>
          </Link>

          <div
            title="Coming soon"
            className="cursor-not-allowed rounded-xl border border-white/10 bg-docket-navy2/50 p-6 text-left opacity-60"
          >
            <div className="mb-3 text-2xl">✨</div>
            <h2 className="mb-1 font-semibold text-gray-300">
              AI-powered builder <span className="text-xs">(Coming soon)</span>
            </h2>
            <p className="text-sm text-gray-500">
              Provide case, statute, book or article details and get a structured OSCOLA-style
              draft citation.
            </p>
          </div>

          <Link
            href="/references/games"
            className="rounded-xl border border-docket-gold/40 bg-docket-navy2 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold"
          >
            <div className="mb-3 text-2xl">🎮</div>
            <h2 className="mb-1 font-semibold text-white">Games</h2>
            <p className="text-sm text-gray-400">
              Correct citations, spot errors, and survive a hostile court judge in a quiz with
              health points.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
