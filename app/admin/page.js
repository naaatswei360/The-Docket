'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Priscilla.photos@gmail.com';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState(null);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from('submissions')
      .select('id, draft_stage, created_at, feedback_text, memorial_text, profiles(code_name, student_number), moots(title)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || []));
  }, [isAdmin]);

  if (!loading && user && !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-gray-400">This page is only visible to the admin account.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Admin — All Submissions</h1>

        {rows === null && <p className="text-gray-400">Loading…</p>}

        <div className="flex flex-col gap-4">
          {rows?.map((r) => (
            <div key={r.id} className="rounded-lg border border-gray-700 bg-docket-navy2 p-4">
              <p className="mb-1 text-sm text-gray-300">
                <span className="font-semibold text-docket-gold">
                  {r.profiles?.code_name} (#{r.profiles?.student_number})
                </span>{' '}
                · {r.moots?.title} · {r.draft_stage} · {new Date(r.created_at).toLocaleString()}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-400">View memorial & feedback</summary>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-400">{r.memorial_text}</p>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-gray-300">{r.feedback_text}</pre>
              </details>
            </div>
          ))}
          {rows && rows.length === 0 && <p className="text-gray-400">No submissions yet.</p>}
        </div>
      </div>
    </main>
  );
}
