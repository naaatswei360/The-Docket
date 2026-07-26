'use client';

import Link from 'next/link';

export default function CustomerServiceButton() {
  return (
    <Link
      href="/help"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-docket-gold px-4 py-2 text-sm font-semibold text-docket-navy shadow-lg shadow-black/40 transition hover:bg-docket-gold2"
      title="Customer service"
    >
      <span className="text-base">🛎️</span>
      Help
    </Link>
  );
}
