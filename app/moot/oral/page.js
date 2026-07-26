'use client';

import Link from 'next/link';

export default function OralMootPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-docket-navy2 p-8">
        <h1 className="mb-2 text-2xl font-bold text-white">Oral Moots</h1>
        <p className="mb-8 text-sm text-gray-400">
          Live rounds with a randomly assigned judge, a case read-out, and audio submissions
          you can be interrupted on — this is coming soon.
        </p>

        <div className="mb-3 grid grid-cols-2 gap-3 text-left text-sm text-gray-500">
          <label className="rounded-lg border border-gray-700 bg-gray-800/40 px-3 py-2">
            Role
            <select disabled className="mt-1 w-full cursor-not-allowed rounded bg-gray-700 px-2 py-1 text-gray-400">
              <option>Applicant / Respondent</option>
            </select>
          </label>
          <label className="rounded-lg border border-gray-700 bg-gray-800/40 px-3 py-2">
            Time
            <select disabled className="mt-1 w-full cursor-not-allowed rounded bg-gray-700 px-2 py-1 text-gray-400">
              <option>10 minutes</option>
            </select>
          </label>
        </div>

        <button disabled className="mb-6 w-full cursor-not-allowed rounded-lg border border-gray-600 bg-gray-800/60 py-3 text-gray-500">
          🎙️ Start speaking (disabled)
        </button>

        <Link href="/home" className="text-sm text-docket-gold underline">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
