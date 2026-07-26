'use client';
import { useState } from 'react';

export function StaffPhoto({
  slug,
  name,
  photo,
}: {
  slug: string;
  name: string;
  photo?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = `/staff/${photo ?? `${slug}.jpg`}`;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-cinema-elevated ring-1 ring-white/5">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-navy/50 via-cinema-surface to-cinema-black">
          <span className="font-display text-4xl text-brand-orange/90">{initials}</span>
        </div>
      )}
    </div>
  );
}
