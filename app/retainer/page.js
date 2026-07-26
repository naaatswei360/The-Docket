'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

export default function RetainerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    gender: '',
    experience_level: '',
    goal: '',
    notes: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError('');

    const { error: updateError } = await supabase
      .from('profiles')
      .update(form)
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }

    router.push('/home');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <h1 className="mb-1 text-2xl font-bold text-white">The Retainer</h1>
        <p className="mb-6 text-sm text-gray-400">
          A one-time profile so we know who's arguing.
        </p>

        <label className="mb-1 block text-sm text-gray-300">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        />

        <label className="mb-1 block text-sm text-gray-300">Gender</label>
        <select
          value={form.gender}
          onChange={(e) => update('gender', e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        >
          <option value="">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <label className="mb-1 block text-sm text-gray-300">Experience level</label>
        <select
          value={form.experience_level}
          onChange={(e) => update('experience_level', e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        >
          <option value="">Select…</option>
          <option value="first-time">First-time mooter</option>
          <option value="some-experience">Some moot experience</option>
          <option value="competitive">Competitive / experienced</option>
        </select>

        <label className="mb-1 block text-sm text-gray-300">Goal / focus</label>
        <input
          value={form.goal}
          onChange={(e) => update('goal', e.target.value)}
          placeholder="e.g. Improve written advocacy for a competition in October"
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        />

        <label className="mb-1 block text-sm text-gray-300">Any other info</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save & Continue'}
        </button>
      </form>
    </main>
  );
}
