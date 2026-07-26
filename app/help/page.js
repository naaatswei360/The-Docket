'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqergnbk';

export default function HelpPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'not logged in',
          message,
        }),
      });

      if (res.ok) {
        setStatus('sent');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <Link href="/home" className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back
        </Link>

        <h1 className="mb-2 text-2xl font-bold text-white">Customer Service</h1>
        <p className="mb-6 text-sm text-gray-400">
          Tell us what's going on — this goes straight to our support inbox.
        </p>

        {status === 'sent' ? (
          <div className="rounded-lg border border-docket-gold/40 bg-docket-navy2 p-6 text-center">
            <p className="text-gray-200">Thanks — we've got your message and will get back to you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              required
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or question…"
              className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-sm"
            />

            {status === 'error' && (
              <p className="mb-4 text-sm text-red-400">
                Something went wrong sending your message. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
