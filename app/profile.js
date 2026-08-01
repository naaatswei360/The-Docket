'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';
import Avatar from '../../components/Avatar';
import { generateAvatarOptions } from '../../lib/avatar';

const EXPERIENCE_LABELS = {
  'first-time': 'First-time mooter',
  'some-experience': 'Some moot experience',
  competitive: 'Competitive / experienced',
};

const GENDER_LABELS = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('code_name, student_number, name, gender, country, experience_level, goal, notes, avatar_seed')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        setFetching(false);
      });
  }, [user]);

  const avatarOptions = user ? generateAvatarOptions(user.id) : [];

  async function chooseAvatar(seed) {
    if (!user || savingAvatar) return;
    setSavingAvatar(true);
    const { error } = await supabase.from('profiles').update({ avatar_seed: seed }).eq('user_id', user.id);
    if (!error) {
      setProfile((p) => ({ ...p, avatar_seed: seed }));
      setPickerOpen(false);
    }
    setSavingAvatar(false);
  }

  async function useInitialsInstead() {
    if (!user || savingAvatar) return;
    setSavingAvatar(true);
    const { error } = await supabase.from('profiles').update({ avatar_seed: null }).eq('user_id', user.id);
    if (!error) {
      setProfile((p) => ({ ...p, avatar_seed: null }));
      setPickerOpen(false);
    }
    setSavingAvatar(false);
  }

  if (loading || fetching || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050810]">
        <p className="text-gray-400">Loading profile…</p>
      </main>
    );
  }

  const rows = [
    { label: 'Name', value: profile.name },
    { label: 'Gender', value: GENDER_LABELS[profile.gender] || profile.gender },
    { label: 'Country', value: profile.country },
    { label: 'Experience level', value: EXPERIENCE_LABELS[profile.experience_level] || profile.experience_level },
    { label: 'Goal / focus', value: profile.goal },
    { label: 'Any other info', value: profile.notes },
  ];

  return (
    <main className="min-h-screen bg-[#050810] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/home" className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back to Home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-docket-navy2 p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar codeName={profile.code_name} avatarSeed={profile.avatar_seed} size="lg" />
                <button
                  onClick={() => setPickerOpen(true)}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-docket-navy text-sm text-gray-200 hover:bg-docket-navy/70"
                  aria-label="Change avatar"
                  title="Change avatar"
                >
                  ✎
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.code_name}</h1>
                <p className="text-sm text-gray-400">Newcomer #{profile.student_number}</p>
              </div>
            </div>

            <Link
              href="/retainer"
              className="shrink-0 rounded-lg border border-docket-gold px-4 py-2 text-sm font-semibold text-docket-gold hover:bg-docket-gold/10"
            >
              Edit
            </Link>
          </div>

          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.label} className="border-b border-white/10 pb-3">
                <p className="text-xs uppercase tracking-widest text-gray-500">{r.label}</p>
                <p className="mt-1 text-sm text-gray-100">
                  {r.value || <span className="text-gray-500">Not set</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar picker */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-docket-navy p-6 shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Choose an avatar</h2>
              <button onClick={() => setPickerOpen(false)} className="text-gray-400 hover:text-gray-200">
                ✕
              </button>
            </div>
            <p className="mb-4 text-xs text-gray-500">A set picked just for you — pick the one that feels right.</p>
            <div className="mb-4 grid grid-cols-4 gap-3">
              {avatarOptions.map((seed) => (
                <button
                  key={seed}
                  onClick={() => chooseAvatar(seed)}
                  disabled={savingAvatar}
                  className={`overflow-hidden rounded-full border-2 transition disabled:opacity-50 ${
                    profile.avatar_seed === seed ? 'border-docket-gold' : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <Avatar codeName={profile.code_name} avatarSeed={seed} size="md" />
                </button>
              ))}
            </div>
            <button
              onClick={useInitialsInstead}
              disabled={savingAvatar}
              className="w-full rounded-lg border border-gray-500 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
            >
              Use initials instead
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
