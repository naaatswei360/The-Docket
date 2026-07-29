'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { getTodaysTip } from '../../lib/dailyTip';
import { supabase } from '../../lib/supabaseClient';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState('choose'); // choose -> memorial-type
  const [showWelcome, setShowWelcome] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('code_name')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  useEffect(() => {
    if (!user || !profile || typeof window === 'undefined') return;
    const everSeenKey = `docket_ever_seen_${user.id}`;
    const shownThisSessionKey = `docket_shown_session_${user.id}`;

    const everSeen = window.localStorage.getItem(everSeenKey);
    const shownThisSession = window.sessionStorage.getItem(shownThisSessionKey);

    if (!shownThisSession) {
      setIsReturning(!!everSeen);
      setShowWelcome(true);
      window.sessionStorage.setItem(shownThisSessionKey, '1');
      if (!everSeen) window.localStorage.setItem(everSeenKey, '1');
    }
  }, [user, profile]);

  const tip = getTodaysTip();

  return (
    <main
      className="relative min-h-screen"
      style={{
        backgroundImage: "url('/home-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/45" />

      {/* Welcome popup */}
      {showWelcome && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-docket-gold/40 bg-docket-navy p-8 text-center shadow-2xl">
            <p className="mb-2 text-xs uppercase tracking-widest text-docket-gold">
              {isReturning ? 'Welcome back' : 'Welcome'}
            </p>
            <h2 className="mb-6 text-2xl font-bold text-white">{profile.code_name}</h2>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Left sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-44 flex-col gap-1 border-r border-white/10 bg-docket-navy/80 px-5 py-6 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-docket-navy hover:bg-white"
          aria-label="Back"
        >
          ←
        </button>

        <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-docket-gold">
          Home
        </span>
        <span className="mb-3 text-xs uppercase tracking-widest text-gray-500 opacity-60">
          About <span className="text-[10px]">(soon)</span>
        </span>
        <span className="mb-3 text-xs uppercase tracking-widest text-gray-500 opacity-60">
          Blog <span className="text-[10px]">(soon)</span>
        </span>
        <Link
          href="/help"
          className="mb-3 text-xs uppercase tracking-widest text-gray-300 hover:text-docket-gold"
        >
          Contact
        </Link>
        <Link
          href="/plans"
          className="mb-3 text-xs uppercase tracking-widest text-gray-300 hover:text-docket-gold"
        >
          Premium
        </Link>
      </aside>

      {/* Main content */}
      <div className="relative z-10 ml-44 min-h-screen px-8 py-6">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-docket-gold">THE DOCKET</h1>
            {profile && <p className="text-sm text-gray-300">{profile.code_name}</p>}
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest">
            <span className="cursor-not-allowed text-gray-500 opacity-60">
              Rankings <span className="text-[10px]">(soon)</span>
            </span>
            <Link href="/help" className="text-gray-200 hover:text-docket-gold">
              Customer Support
            </Link>
            <Link href="/retainer" className="text-gray-200 hover:text-docket-gold">
              Settings
            </Link>
            <button
              onClick={async () => {
                if (user && typeof window !== 'undefined') {
                  window.sessionStorage.removeItem(`docket_shown_session_${user.id}`);
                }
                await supabase.auth.signOut();
                if (typeof window !== 'undefined') {
                  window.location.href = '/login';
                }
              }}
              className="text-gray-200 hover:text-docket-gold"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Daily tip - full-width banner */}
        <div className="-mx-8 mb-10 border-y border-white/10 bg-gradient-to-b from-docket-navy/90 to-docket-navy/70 px-8 py-12 text-center backdrop-blur-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-docket-gold/80">
            Daily Docket Tip
          </p>
          <p className="mx-auto max-w-2xl text-xl italic text-gray-100">"{tip}"</p>
        </div>

        {/* Memorial / Oral / Hot Seat choice */}
        {view === 'choose' && (
          <div className="mx-auto mb-8 grid max-w-4xl gap-4 sm:grid-cols-3">
            <button
              onClick={() => setView('memorial-type')}
              className="rounded-xl border border-white/10 bg-docket-navy/70 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold"
            >
              <div className="mb-3 text-2xl">📄</div>
              <h2 className="mb-1 font-semibold text-white">Memorial (Written)</h2>
              <p className="text-sm text-gray-400">
                Draft a written memorial and get structured AI feedback on it.
              </p>
            </button>

            <Link
              href="/moot/oral"
              className="rounded-xl border border-white/10 bg-docket-navy/70 p-6 text-left backdrop-blur-sm transition hover:border-gray-400"
            >
              <div className="mb-3 text-2xl">🎙️</div>
              <h2 className="mb-1 font-semibold text-white">Oral</h2>
              <p className="text-sm text-gray-400">
                Live rounds with an assigned judge. Coming soon.
              </p>
            </Link>

            <Link
              href="/hotseat"
              className="rounded-xl border border-white/10 bg-docket-navy/70 p-6 text-left backdrop-blur-sm transition hover:border-docket-gold"
            >
              <div className="mb-3 text-2xl">🔥</div>
              <h2 className="mb-1 font-semibold text-white">The Hot Seat</h2>
              <p className="text-sm text-gray-400">
                60-second on-the-spot argument drills to sharpen quick thinking.
              </p>
            </Link>
          </div>
        )}

        {view === 'memorial-type' && (
          <div className="mx-auto mb-8 max-w-3xl">
            <button
              onClick={() => setView('choose')}
              className="mb-4 text-sm text-gray-300 underline hover:text-white"
            >
              ← Back
            </button>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/moot/memorial"
                className="rounded-xl border border-white/10 bg-docket-navy/70 p-5 text-left backdrop-blur-sm transition hover:border-docket-gold"
              >
                <h3 className="mb-1 font-semibold text-docket-gold">Curated</h3>
                <p className="text-sm text-gray-400">One general moot problem, ready to go.</p>
              </Link>

              <div className="rounded-xl border border-white/10 bg-docket-navy/50 p-5 opacity-70 backdrop-blur-sm">
                <h3 className="mb-1 font-semibold text-gray-300">Specialized</h3>
                <p className="text-sm text-gray-500">Subject-specific problem sets. Coming soon.</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-docket-navy/50 p-5 opacity-70 backdrop-blur-sm">
                <h3 className="mb-1 font-semibold text-gray-300">Freestyle</h3>
                <p className="text-sm text-gray-500">Bring your own facts. Coming soon.</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/submissions"
            className="inline-block rounded-full bg-docket-gold px-6 py-2 font-semibold text-docket-navy hover:bg-docket-gold2"
          >
            View my past submissions
          </Link>
        </div>

        <div className="mt-16 text-center text-xs text-gray-400">
          <p>Powered by AI</p>
          <p>© 2026 The Docket</p>
        </div>
      </div>
    </main>
  );
}