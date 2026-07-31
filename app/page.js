'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

export default function EntryPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Supabase is supposed to send confirmation links straight to
    // /auth/confirmed, but if it ever falls back to the Site URL (the
    // homepage) instead — e.g. a link resent from the Supabase dashboard —
    // the confirmation payload (a `code` param, or tokens in the URL hash)
    // ends up here. Forward it on to /auth/confirmed so the person still
    // sees the "you're verified" screen instead of being silently skipped
    // straight to /plans.
    const hasConfirmationPayload =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('error_description');

    if (hasConfirmationPayload) {
      router.replace(`/auth/confirmed${window.location.search}${window.location.hash}`);
      return;
    }

    if (!loading && session) {
      router.replace('/plans');
    }
  }, [loading, session, router]);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20"
      style={{
        backgroundImage: "url('/entry-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay so text and buttons stay readable over the photo */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 w-full max-w-md text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-docket-gold drop-shadow">
          Moot Training Platform
        </p>
        <h1 className="mb-3 text-5xl font-extrabold text-white drop-shadow-lg">The Docket</h1>
        <p className="mb-10 text-gray-200 drop-shadow">
          Sign up and you'll be assigned a code name and a newcomer number the moment
          you join. Log back in any time to pick up where you left off.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy shadow-lg transition hover:bg-docket-gold2"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-docket-gold/60 bg-docket-navy/90 px-6 py-3 font-semibold text-docket-gold shadow-lg transition hover:bg-docket-navy2"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}