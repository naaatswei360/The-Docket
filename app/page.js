'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

export default function EntryPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace('/plans');
    }
  }, [loading, session, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-docket-gold">
          Moot Training Platform
        </p>
        <h1 className="mb-3 text-4xl font-bold text-white">The Docket</h1>
        <p className="mb-10 text-gray-400">
          Sign up and you'll be assigned a code name and a newcomer number the moment
          you join. Log back in any time to pick up where you left off.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-docket-gold/50 px-6 py-3 font-semibold text-docket-gold transition hover:bg-docket-navy2"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
