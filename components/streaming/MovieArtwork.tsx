import PosterImage from '@/components/streaming/PosterImage';

interface ArtworkProps {
  poster: string;
  hero?: string | null;
  alt: string;
  variant: 'poster' | 'hero';
  className?: string;
  priority?: boolean;
}

export default function MovieArtwork({
  poster,
  hero,
  alt,
  variant,
  className = '',
  priority = false,
}: ArtworkProps) {
  if (variant === 'hero') {
    const hasLandscapeHero = Boolean(hero);
    const src = hero || poster;

    return (
      <div className={`relative w-full h-full ${className}`}>
        <PosterImage
          src={src}
          alt={alt}
          priority={priority}
          variant={hasLandscapeHero ? 'hero-wide' : 'hero-full'}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <PosterImage
      src={poster}
      alt={alt}
      priority={priority}
      variant="card"
      className={className}
    />
  );
}
