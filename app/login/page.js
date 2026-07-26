'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    router.push('/plans');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-white">Log In</h1>

        <label className="mb-1 block text-sm text-gray-300">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        />

        <label className="mb-1 block text-sm text-gray-300">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
        >
          {busy ? 'Logging in…' : 'Log In'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          New here?{' '}
          <Link href="/signup" className="text-docket-gold underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
