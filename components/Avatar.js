'use client';

import { getInitialsAvatar, dicebearUrl } from '../lib/avatar';

const SIZE_CLASS = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-base',
  lg: 'h-28 w-28 text-4xl',
};

// Renders either the chosen DiceBear avatar (when avatarSeed is set) or the
// default "contact card" initials avatar derived from codeName.
export default function Avatar({ codeName, avatarSeed, size = 'md', className = '' }) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;

  if (avatarSeed) {
    return (
      <img
        src={dicebearUrl(avatarSeed)}
        alt={codeName || 'Avatar'}
        className={`${sizeClass} shrink-0 rounded-full border border-white/20 bg-docket-navy2 object-cover ${className}`}
      />
    );
  }

  const { initial, color } = getInitialsAvatar(codeName);
  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border border-white/20 font-bold text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}
