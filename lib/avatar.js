// Avatar helpers.
//
// Every profile has `avatar_seed` (nullable, on the `profiles` table). Until
// a user picks one, it's null and we show a "contact card" style initials
// avatar — a coloured circle with the first letter of their code name, the
// same idea as a phone's default contact photo. If they pick a DiceBear
// avatar instead, avatar_seed stores that seed string.

const INITIAL_COLORS = [
  '#B45309', '#0F766E', '#7C3AED', '#BE123C', '#1D4ED8',
  '#B91C1C', '#0369A1', '#4D7C0F', '#A21CAF', '#C2410C',
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// A stable initials avatar derived from the code name — same user, same
// look, every time.
export function getInitialsAvatar(codeName) {
  const name = (codeName || '?').trim();
  const initial = name.charAt(0).toUpperCase() || '?';
  const color = INITIAL_COLORS[hashString(name) % INITIAL_COLORS.length];
  return { initial, color };
}

// DiceBear's "Adventurer" set — varied faces, hair, and skin tones,
// generated procedurally from a seed string.
export function dicebearUrl(seed) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
}

// A personalised set of avatar options for a user to choose from. Seeds are
// derived from the user's own id, so every user is offered a different,
// but stable (same options if they reopen the picker), set of looks.
export function generateAvatarOptions(userId, count = 12) {
  const base = userId || 'guest';
  return Array.from({ length: count }, (_, i) => `${base}-avatar-${i}`);
}
