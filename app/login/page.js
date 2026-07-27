'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

function trustedKey(email) {
  return `docket_trusted_device_${email.trim().toLowerCase()}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [stage, setStage] = useState('password'); // 'password' | 'code'
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    // Step 1: check the password is correct. This also creates a session.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    // Step 2: is this device already trusted for this account?
    const isTrusted =
      typeof window !== 'undefined' && window.localStorage.getItem(trustedKey(email));

    if (isTrusted) {
      // Correct password + trusted device -> straight in, no code needed.
      router.push('/plans');
      return;
    }

    // Untrusted device: don't grant access yet. Sign back out and require
    // an emailed code before finishing login.
    await supabase.auth.signOut();

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (otpError) {
      setError(otpError.message);
      setBusy(false);
      return;
    }

    setStage('code');
    setBusy(false);
  }

  async function handleCodeSubmit(e) {
    e.preventDefault();
    setCodeError('');
    setVerifying(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (verifyError) {
      setCodeError(verifyError.message);
      setVerifying(false);
      return;
    }

    // Code verified -> remember this device so future logins skip this step.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(trustedKey(email), '1');
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

        <div className="relative rounded-2xl border border-white/10 bg-docket-navy/90 p-8 shadow-2xl backdrop-blur-sm">
          {/* Stage 1: email + password */}
          <form onSubmit={handlePasswordSubmit} autoComplete="on">
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
              disabled={stage === 'code'}
              className="mb-4 w-full rounded-lg border border-gray-500 bg-white px-3 py-3 text-docket-navy disabled:opacity-60"
            />

            <label htmlFor="login-password" className="mb-1 block text-sm text-gray-300">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={stage === 'code'}
              className="mb-6 w-full rounded-lg border border-gray-500 bg-white px-3 py-3 text-docket-navy disabled:opacity-60"
            />

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={busy || stage === 'code'}
              className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy transition hover:bg-docket-gold2 disabled:opacity-60"
            >
              {busy ? 'Checking…' : 'Log In'}
            </button>

            <p className="mt-6 text-center text-sm text-gray-300">
              New here?{' '}
              <Link href="/signup" className="text-docket-gold underline">
                Sign up
              </Link>
            </p>
          </form>

          {/* Stage 2: verification code overlay (only for untrusted devices) */}
          {stage === 'code' && (
            <div className="absolute inset-0 flex flex-col justify-center rounded-2xl bg-docket-navy p-8">
              <h2 className="mb-2 text-xl font-bold text-white">Check your email</h2>
              <p className="mb-6 text-sm text-gray-400">
                We don't recognize this device yet. We sent a code to{' '}
                <span className="text-gray-200">{email}</span> — enter it below to finish
                logging in. Future logins on this device won't need this step.
              </p>

              <form onSubmit={handleCodeSubmit}>
                <label htmlFor="login-code" className="mb-1 block text-sm text-gray-300">
                  Verification code
                </label>
                <input
                  id="login-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mb-4 w-full rounded-lg border border-gray-500 bg-white px-3 py-3 text-center text-lg tracking-widest text-docket-navy"
                  placeholder="••••••"
                />

                {codeError && <p className="mb-4 text-sm text-red-400">{codeError}</p>}

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
                >
                  {verifying ? 'Verifying…' : 'Verify & Log In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('password');
                    setCode('');
                    setCodeError('');
                  }}
                  className="mt-4 w-full text-center text-sm text-gray-400 underline hover:text-gray-200"
                >
                  ← Back
                </button>
              </form>
            </div>
          )}
        </div>

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