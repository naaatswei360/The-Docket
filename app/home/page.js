'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import DailyTip from '../../components/DailyTip';
import ComingSoon from '../../components/ComingSoon';
import { supabase } from '../../lib/supabaseClient';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState('choose'); // choose -> memorial-type

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('code_name, student_number')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  return (
    <main className="min-h-screen px-6 pb-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between pt-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-docket-gold">The Docket</p>
            {profile && (
              <p className="text-sm text-gray-400">
                {profile.code_name} · Newcomer #{profile.student_number}
              </p>
            )}
          </div>
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

        <DailyTip />

        {view === 'choose' && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <button
              onClick={() => setView('memorial-type')}
              className="rounded-xl border border-docket-gold/40 bg-docket-navy2 p-8 text-left transition hover:border-docket-gold"
            >
              <h2 className="mb-2 text-xl font-semibold text-docket-gold">Memorial (Written)</h2>
              <p className="text-sm text-gray-400">
                Draft a written memorial and get structured AI feedback on it.
              </p>
            </button>

            <Link
              href="/moot/oral"
              className="rounded-xl border border-gray-700 bg-docket-navy2/60 p-8 text-left opacity-80 transition hover:border-gray-500"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-300">Oral</h2>
              <p className="text-sm text-gray-500">Live rounds with an assigned judge. Coming soon.</p>
            </Link>
          </div>
        )}

        {view === 'memorial-type' && (
          <div className="mt-6">
            <button
              onClick={() => setView('choose')}
              className="mb-4 text-sm text-gray-400 underline hover:text-gray-200"
            >
              ← Back
            </button>
            <div className="grid gap-6 sm:grid-cols-3">
              <Link
                href="/moot/memorial"
                className="rounded-xl border border-docket-gold/40 bg-docket-navy2 p-6 text-left transition hover:border-docket-gold"
              >
                <h3 className="mb-2 font-semibold text-docket-gold">Curated</h3>
                <p className="text-sm text-gray-400">One general moot problem, ready to go.</p>
              </Link>

              <div className="rounded-xl border border-gray-700 bg-docket-navy2/60 p-6 opacity-70">
                <h3 className="mb-2 font-semibold text-gray-300">Specialized</h3>
                <p className="mb-4 text-sm text-gray-500">Subject-specific problem sets.</p>
                <ComingSoon label="Specialized" />
              </div>

              <div className="rounded-xl border border-gray-700 bg-docket-navy2/60 p-6 opacity-70">
                <h3 className="mb-2 font-semibold text-gray-300">Freestyle</h3>
                <p className="mb-4 text-sm text-gray-500">Bring your own facts.</p>
                <ComingSoon label="Freestyle" />
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/submissions" className="text-sm text-docket-gold underline">
            View my past submissions
          </Link>
        </div>
      </div>
    </main>
  );
}
