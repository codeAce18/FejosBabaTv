'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { normalizeImageUrl, posterCardUrl } from '@/lib/cloudinary';
import { FilmStrip } from '@phosphor-icons/react';

export type PosterVariant = 'card' | 'hero-full' | 'hero-wide' | 'raw';

interface PosterImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: PosterVariant;
}

export default function PosterImage({
  src,
  alt,
  className,
  priority = false,
  variant = 'card',
}: PosterImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn('flex items-center justify-center bg-cinema-black text-ink-muted', className)}>
        <FilmStrip size={28} className="opacity-40" />
      </div>
    );
  }

  const normalized = normalizeImageUrl(src);
  const displaySrc = variant === 'card' ? posterCardUrl(normalized) || normalized : normalized;

  if (variant === 'hero-wide' || variant === 'raw') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('block w-full h-full object-cover object-center', className)}
      />
    );
  }

  if (variant === 'hero-full') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('block w-full h-full object-contain object-center', className)}
      />
    );
  }

  // card — blurred backdrop + contained poster
  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-cinema-black', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45 saturate-150"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-contain object-center"
      />
    </div>
  );
}
