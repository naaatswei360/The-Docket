'use client';

import { getTodaysTip } from '../lib/dailyTip';

export default function DailyTip() {
  const tip = getTodaysTip();

  return (
    <div className="flex justify-center py-6">
      <div className="animate-sway origin-top rounded-lg border border-docket-gold/40 bg-docket-navy2 px-6 py-3 shadow-md shadow-black/30">
        <p className="text-xs uppercase tracking-widest text-docket-gold/70 text-center mb-1">
          Daily Docket Tip
        </p>
        <p className="max-w-md text-center text-sm text-gray-200 italic">"{tip}"</p>
      </div>
    </div>
  );
}
