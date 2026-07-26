'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

export default function SubmissionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subs, setSubs] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('submissions')
      .select('id, draft_stage, memorial_text, feedback_text, created_at, moots(title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setSubs(data || []));
  }, [user]);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/home" className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back to home
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-white">My Submissions</h1>

        {subs === null && <p className="text-gray-400">Loading…</p>}
        {subs && subs.length === 0 && (
          <p className="text-gray-400">No submissions yet — go submit a memorial.</p>
        )}

        <div className="flex flex-col gap-4">
          {subs?.map((s) => (
            <div key={s.id} className="rounded-lg border border-gray-700 bg-docket-navy2 p-4">
              <button
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="font-semibold text-gray-100">{s.moots?.title || 'Moot'}</p>
                  <p className="text-xs text-gray-400">
                    {s.draft_stage === 'final' ? 'Final draft' : 'First draft'} ·{' '}
                    {new Date(s.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-docket-gold">{openId === s.id ? '−' : '+'}</span>
              </button>

              {openId === s.id && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <h3 className="mb-1 text-sm font-semibold text-gray-300">Memorial</h3>
                  <p className="mb-4 whitespace-pre-wrap text-sm text-gray-400">{s.memorial_text}</p>
                  <h3 className="mb-1 text-sm font-semibold text-gray-300">Feedback</h3>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300">{s.feedback_text}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
