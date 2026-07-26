'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { supabase } from '../../../lib/supabaseClient';
import ComingSoon from '../../../components/ComingSoon';

export default function MemorialPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [moot, setMoot] = useState(null);
  const [memorialText, setMemorialText] = useState('');
  const [draftStage, setDraftStage] = useState('first');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    supabase
      .from('moots')
      .select('*')
      .eq('type', 'general')
      .limit(1)
      .maybeSingle()
      .then(({ data, error: mootError }) => {
        if (mootError) setError(mootError.message);
        else setMoot(data);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !moot) return;
    setSubmitting(true);
    setError('');
    setFeedback('');

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          mootId: moot.id,
          draftStage,
          memorialText,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong assessing your memorial.');

      setFeedback(data.feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!moot) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-gray-400">
        Loading moot problem…
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/home" className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back to home
        </Link>

        <h1 className="mb-1 text-2xl font-bold text-white">{moot.title}</h1>
        <p className="mb-6 text-xs uppercase tracking-widest text-docket-gold">General Moot</p>

        <div className="mb-6 rounded-lg border border-gray-700 bg-docket-navy2 p-4">
          <h2 className="mb-1 font-semibold text-gray-200">Facts</h2>
          <p className="mb-4 text-sm text-gray-400">{moot.facts}</p>
          <h2 className="mb-1 font-semibold text-gray-200">Issues</h2>
          <p className="text-sm text-gray-400">{moot.issues}</p>
        </div>

        {!feedback && (
          <form onSubmit={handleSubmit}>
            <label className="mb-1 block text-sm text-gray-300">Any additional facts you're relying on (optional)</label>
            <textarea
              rows={2}
              placeholder="Leave blank if you're only working from the facts above."
              className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-sm text-gray-300">Your memorial</label>
            <textarea
              required
              rows={12}
              value={memorialText}
              onChange={(e) => setMemorialText(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-sm"
              placeholder="Write or paste your memorial here…"
            />

            <label className="mb-1 block text-sm text-gray-300">Draft stage</label>
            <select
              value={draftStage}
              onChange={(e) => setDraftStage(e.target.value)}
              className="mb-6 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
            >
              <option value="first">First draft</option>
              <option value="final">Final draft</option>
            </select>

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
            >
              {submitting ? 'Assessing…' : 'Submit for Assessment'}
            </button>
          </form>
        )}

        {feedback && (
          <div>
            <div className="mb-6 rounded-lg border border-docket-gold/40 bg-docket-navy2 p-6">
              <h2 className="mb-4 text-lg font-semibold text-docket-gold">Assessor Feedback</h2>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200">{feedback}</pre>
            </div>

            <div className="mb-6">
              <ComingSoon label="View Rankings" className="w-full" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFeedback('');
                  setMemorialText('');
                }}
                className="flex-1 rounded-lg border border-docket-gold/50 px-5 py-3 font-semibold text-docket-gold hover:bg-docket-navy2"
              >
                Submit another draft
              </button>
              <Link
                href="/submissions"
                className="flex-1 rounded-lg bg-docket-gold px-5 py-3 text-center font-semibold text-docket-navy hover:bg-docket-gold2"
              >
                View submission history
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
