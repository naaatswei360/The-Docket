'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { ensureProfile } from '../../lib/profile';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [assigned, setAssigned] = useState(null);

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    if (!data.session) {
      setError(
        'Account created. Check your email to verify it, then log in — your code name and number will be assigned on first login.'
      );
      setBusy(false);
      return;
    }

    try {
      const { profile } = await ensureProfile(data.user);
      setAssigned(profile);
    } catch (err) {
      setError(err.message);
    }

    setBusy(false);
  }

  if (assigned) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-md rounded-xl border border-docket-gold/40 bg-docket-navy2 p-8">
          <p className="mb-2 text-xs uppercase tracking-widest text-docket-gold">Welcome to The Docket</p>
          <h1 className="mb-1 text-2xl font-bold text-white">{assigned.code_name}</h1>
          <p className="mb-6 text-gray-400">Newcomer #{assigned.student_number}</p>
          <button
            onClick={() => router.push('/plans')}
            className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <form onSubmit={handleSignup} autoComplete="on" className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-white">Sign Up</h1>

        <label htmlFor="signup-email" className="mb-1 block text-sm text-gray-300">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
        />

        <label htmlFor="signup-password" className="mb-1 block text-sm text-gray-300">
          Password
        </label>
        <div className="relative mb-4">
          <input
            id="signup-password"
            name="new-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-white px-3 py-2 pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-docket-navy/70 hover:text-docket-navy"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
        >
          {busy ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-docket-gold underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}