'use client';

import Link from 'next/link';

export default function PaymentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-docket-navy2 p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">Payment</h1>
        <p className="mb-6 text-sm text-gray-400">
          Payments aren't wired up in this prototype. This page shows what the flow will
          look like once billing is built.
        </p>

        <div className="mb-4 flex gap-3">
          <button disabled className="flex-1 cursor-not-allowed rounded-lg border border-gray-600 bg-gray-800/60 py-3 text-gray-500">
            Mobile Money
          </button>
          <button disabled className="flex-1 cursor-not-allowed rounded-lg border border-gray-600 bg-gray-800/60 py-3 text-gray-500">
            Bank Card
          </button>
        </div>

        <Link href="/plans" className="text-sm text-docket-gold underline">
          Back to plans
        </Link>
      </div>
    </main>
  );
}
