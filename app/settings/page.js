'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const DEFAULT_SETTINGS = {
  formatting: {
    preset: 'jessup',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    marginInches: 1,
  },
  notifications: {
    enabled: true,
    frequency: 'weekly',
  },
  downloadFormat: 'docx',
};

// Real values from each competition's own rules — see the note under the
// formatting section for sourcing. "custom" just means "whatever's
// currently in the fields," so it has no fixed values of its own.
const PRESETS = {
  jessup: {
    label: 'Jessup',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    marginInches: 1,
    note: 'Jessup Rules of Procedure: Times New Roman 12pt, 1.5 line spacing, minimum 1" (2cm) margins, US Letter paper.',
  },
  vis: {
    label: 'Vis Moot',
    font: 'Garamond',
    fontSize: 12,
    lineSpacing: 1.5,
    marginInches: 1,
    note: 'Vis Moot Rules only require 12pt+ type, 1.5 spacing, and 1" (2.5cm) margins — they don\u2019t mandate a font. Garamond is used here because it\u2019s the convention most Vis teams follow (e.g. the Columbia Vis style guide).',
  },
  custom: {
    label: 'Custom',
    note: 'Set your own font, size, spacing, and margins below.',
  },
};

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [fetching, setFetching] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [counts, setCounts] = useState({ submissions: null, progress: null });
  const [clearing, setClearing] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('settings')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...(data?.settings || {}),
          formatting: { ...DEFAULT_SETTINGS.formatting, ...(data?.settings?.formatting || {}) },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...(data?.settings?.notifications || {}) },
        });
        setFetching(false);
      });

    supabase
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count }) => setCounts((c) => ({ ...c, submissions: count ?? 0 })));

    supabase
      .from('reference_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count }) => setCounts((c) => ({ ...c, progress: count ?? 0 })));
  }, [user]);

  function applyPreset(key) {
    const p = PRESETS[key];
    setSettings((s) => ({
      ...s,
      formatting:
        key === 'custom'
          ? { ...s.formatting, preset: 'custom' }
          : {
              preset: key,
              font: p.font,
              fontSize: p.fontSize,
              lineSpacing: p.lineSpacing,
              marginInches: p.marginInches,
            },
    }));
  }

  function updateFormatting(field, value) {
    setSettings((s) => ({
      ...s,
      formatting: { ...s.formatting, [field]: value, preset: 'custom' },
    }));
  }

  function updateNotifications(field, value) {
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [field]: value } }));
  }

  async function handleSave() {
    if (!user) return;
    setBusy(true);
    setError('');
    setSaved(false);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ settings })
      .eq('user_id', user.id);

    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleLogOut() {
    if (user && typeof window !== 'undefined') {
      window.sessionStorage.removeItem(`docket_shown_session_${user.id}`);
    }
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }

  async function handleClear(table) {
    if (!user) return;
    setClearing(table);
    await supabase.from(table).delete().eq('user_id', user.id);
    setCounts((c) => ({ ...c, [table === 'submissions' ? 'submissions' : 'progress']: 0 }));
    setClearing('');
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError('');

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();

    if (!res.ok) {
      setDeleteError(body.error || 'Could not delete your account. Try again.');
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    if (typeof window !== 'undefined') window.location.href = '/signup';
  }

  if (loading || fetching) {
    return (
      <main className="flex min-h-screen items-center justify-center text-gray-400">
        Loading settings…
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-400">Your account, formatting defaults, and data.</p>
          </div>
          <Link href="/home" className="text-sm text-gray-300 underline hover:text-white">
            ← Back to Home
          </Link>
        </div>

        {/* Document Formatting Standards */}
        <section className="mb-6 rounded-xl border border-white/10 bg-docket-navy2 p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Document Formatting Standards</h2>
          <p className="mb-4 text-sm text-gray-400">
            Defaults applied when you draft or download a memorial, so it already matches your competition's rules.
          </p>

          <div className="mb-4 flex gap-2">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  settings.formatting.preset === key
                    ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {PRESETS[key].label}
              </button>
            ))}
          </div>

          <p className="mb-5 text-xs italic text-gray-500">{PRESETS[settings.formatting.preset]?.note}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Font</label>
              <select
                value={settings.formatting.font}
                onChange={(e) => updateFormatting('font', e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-docket-navy"
              >
                <option value="Times New Roman">Times New Roman</option>
                <option value="Garamond">Garamond</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Font size</label>
              <input
                type="number"
                min={8}
                max={16}
                value={settings.formatting.fontSize}
                onChange={(e) => updateFormatting('fontSize', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-docket-navy"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Line spacing</label>
              <select
                value={settings.formatting.lineSpacing}
                onChange={(e) => updateFormatting('lineSpacing', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-docket-navy"
              >
                <option value={1}>Single (1.0)</option>
                <option value={1.5}>1.5 lines</option>
                <option value={2}>Double (2.0)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Margins (inches, all sides)</label>
              <input
                type="number"
                min={0.5}
                max={2}
                step={0.25}
                value={settings.formatting.marginInches}
                onChange={(e) => updateFormatting('marginInches', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-docket-navy"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-6 rounded-xl border border-white/10 bg-docket-navy2 p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Notifications & Reminders</h2>
          <p className="mb-4 text-sm text-gray-400">Nudges to keep practicing.</p>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-300">Enable reminders</span>
            <button
              type="button"
              onClick={() => updateNotifications('enabled', !settings.notifications.enabled)}
              className={`h-6 w-11 rounded-full transition ${
                settings.notifications.enabled ? 'bg-docket-gold' : 'bg-gray-600'
              }`}
            >
              <span
                className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition ${
                  settings.notifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {settings.notifications.enabled && (
            <div>
              <label className="mb-1 block text-sm text-gray-300">Frequency</label>
              <select
                value={settings.notifications.frequency}
                onChange={(e) => updateNotifications('frequency', e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-docket-navy"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </section>

        {/* Default download format */}
        <section className="mb-6 rounded-xl border border-white/10 bg-docket-navy2 p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Downloading Memorials</h2>
          <p className="mb-4 text-sm text-gray-400">Default file format when you download a memorial.</p>

          <div className="flex gap-3">
            {[
              { key: 'docx', label: 'Word (.docx)' },
              { key: 'pdf', label: 'PDF (.pdf)' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSettings((s) => ({ ...s, downloadFormat: opt.key }))}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  settings.downloadFormat === opt.key
                    ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={busy}
            className="rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm text-emerald-400">Saved.</span>}
          {error && <span className="text-sm text-red-400">{error}</span>}
        </div>

        {/* Storage */}
        <section className="mb-6 rounded-xl border border-white/10 bg-docket-navy2 p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Storage</h2>
          <p className="mb-4 text-sm text-gray-400">What's saved to your account.</p>

          <div className="mb-3 flex items-center justify-between rounded-lg bg-black/20 px-4 py-3">
            <span className="text-sm text-gray-300">
              Saved memorial submissions — {counts.submissions ?? '…'}
            </span>
            <button
              onClick={() => handleClear('submissions')}
              disabled={!counts.submissions || clearing === 'submissions'}
              className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
            >
              {clearing === 'submissions' ? 'Clearing…' : 'Clear'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-black/20 px-4 py-3">
            <span className="text-sm text-gray-300">
              Saved References practice scores — {counts.progress ?? '…'}
            </span>
            <button
              onClick={() => handleClear('reference_progress')}
              disabled={!counts.progress || clearing === 'reference_progress'}
              className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
            >
              {clearing === 'reference_progress' ? 'Clearing…' : 'Clear'}
            </button>
          </div>
        </section>

        {/* Account actions */}
        <section className="mb-6 rounded-xl border border-white/10 bg-docket-navy2 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>
          <button
            onClick={handleLogOut}
            className="w-full rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-200 hover:border-gray-400"
          >
            Log Out
          </button>
        </section>

        {/* Danger zone */}
        <section className="mb-16 rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="mb-1 text-lg font-semibold text-red-400">Delete My Account</h2>
          <p className="mb-4 text-sm text-gray-400">
            Permanently deletes your account and everything tied to it — profile, saved memorials, and practice
            scores. This can't be undone.
          </p>

          {!deleteOpen ? (
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg border border-red-500/60 px-6 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
            >
              Delete my account
            </button>
          ) : (
            <div className="rounded-lg border border-red-500/40 bg-black/20 p-4">
              <p className="mb-3 text-sm text-gray-300">
                Type <span className="font-mono font-semibold text-red-400">DELETE</span> to confirm.
              </p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="mb-3 w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-docket-navy"
              />
              {deleteError && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || deleting}
                  className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-40"
                >
                  {deleting ? 'Deleting…' : 'Permanently delete'}
                </button>
                <button
                  onClick={() => {
                    setDeleteOpen(false);
                    setDeleteConfirmText('');
                    setDeleteError('');
                  }}
                  className="rounded-lg border border-gray-600 px-5 py-2 text-sm text-gray-300 hover:border-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
