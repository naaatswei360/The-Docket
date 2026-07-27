'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16"
      style={{
        backgroundImage: "url('/courtroom-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex justify-end">
          <Link href="/help" className="text-sm text-gray-200 underline hover:text-white">
            Contact support
          </Link>
        </div>

        <h1 className="mb-8 text-center text-5xl font-extrabold tracking-wide text-docket-gold drop-shadow-lg">
          THE DOCKET
        </h1>

        <form
          onSubmit={handleLogin}
          autoComplete="on"
          className="rounded-2xl border border-white/10 bg-docket-navy/90 p-8 shadow-2xl backdrop-blur-sm"
        >
          <h2 className="mb-6 text-xl font-bold text-white">Log In</h2>

          <label htmlFor="login-email" className="mb-1 block text-sm text-gray-300">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-500 bg-white px-3 py-3 text-docket-navy"
          />

          <label htmlFor="login-password" className="mb-1 block text-sm text-gray-300">
            Password
          </label>
          <div className="relative mb-6">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-500 bg-white px-3 py-3 pr-16 text-docket-navy"
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
            className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2 disabled:opacity-60"
          >
            {busy ? 'Logging in…' : 'Log In'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-300">
            New here?{' '}
            <Link href="/signup" className="text-docket-gold underline">
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-8 flex justify-center">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="28" y1="4" x2="28" y2="46" stroke="#c9a24b" strokeWidth="2" />
            <line x1="10" y1="14" x2="46" y2="14" stroke="#c9a24b" strokeWidth="2" />
            <circle cx="10" cy="14" r="1.5" fill="#c9a24b" />
            <circle cx="46" cy="14" r="1.5" fill="#c9a24b" />
            <path d="M10 14 L4 26 A8 8 0 0 0 16 26 Z" stroke="#c9a24b" strokeWidth="1.5" fill="none" />
            <path d="M46 14 L40 26 A8 8 0 0 0 52 26 Z" stroke="#c9a24b" strokeWidth="1.5" fill="none" />
            <rect x="18" y="46" width="20" height="3" rx="1.5" fill="#c9a24b" />
          </svg>
        </div>
      </div>
    </main>
  );
}