import { supabase } from './supabaseClient';

const ADJECTIVES = [
  'Silver', 'Crimson', 'Steady', 'Sharp', 'Quiet', 'Bold', 'Iron', 'Amber',
  'Swift', 'Keen', 'Steel', 'Velvet', 'Stern', 'Bright', 'Solemn', 'Loyal',
];

const NOUNS = [
  'Barrister', 'Advocate', 'Counsel', 'Jurist', 'Pleader', 'Solicitor',
  'Litigant', 'Magistrate', 'Envoy', 'Sentinel', 'Scholar', 'Orator',
];

function makeCodeName(date) {
  // Seeded loosely by the day, then randomised so it still feels "made up on the day"
  const daySeed = date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate();
  const rand = Math.floor(Math.random() * 1000);
  const adj = ADJECTIVES[(daySeed + rand) % ADJECTIVES.length];
  const noun = NOUNS[(daySeed * 7 + rand) % NOUNS.length];
  const suffix = String((daySeed + rand) % 100).padStart(2, '0');
  return `${adj} ${noun} ${suffix}`;
}

// Ensures a profiles row exists for the given user. If not, creates one with
// a freshly-made code name and the next newcomer number. Returns the profile.
export async function ensureProfile(user) {
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return { profile: existing, isNew: false };

  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  const student_number = (count || 0) + 1;
  const code_name = makeCodeName(new Date());

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ user_id: user.id, code_name, student_number })
    .select()
    .single();

  if (insertError) throw insertError;

  return { profile: created, isNew: true };
}
