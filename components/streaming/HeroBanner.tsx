'use client';
import Link from 'next/link';
import { Play, Info, Crown } from '@phosphor-icons/react';
import type { Movie } from '@/lib/types';
import MovieArtwork from '@/components/streaming/MovieArtwork';

interface HeroBannerProps {
  movie: Movie;
  hasAccess: boolean;
}

export default function HeroBanner({ movie, hasAccess }: HeroBannerProps) {
  const showPremiumCta = movie.isPremium && !hasAccess;
  const isFree = !movie.isPremium;

  return (
    <section className="relative w-full overflow-hidden bg-cinema-black pt-16">
      {/* Poster — full height, no crop, sits below navbar */}
      <div className="relative w-full min-h-[78vh] sm:min-h-[82vh] lg:min-h-[88vh] max-h-[980px]">
        <MovieArtwork
          variant="hero"
          poster={movie.thumbnail}
          hero={movie.heroImage}
          alt={movie.title}
          className="absolute inset-0 w-full h-full"
          priority
        />
      </div>

      {/* Text floats over lower-left — legibility via shadow, not grey wash */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-8 lg:px-12 pb-28 sm:pb-32 pt-24 max-w-7xl mx-auto pointer-events-none">
        <div className="max-w-2xl animate-slide-up pointer-events-auto [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {movie.isPremium ? (
              <span className="inline-flex items-center gap-1.5 bg-brand-orange text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm shadow-lg">
                <Crown size={12} weight="fill" /> Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm">
                Free to watch
              </span>
            )}
            {movie.releaseYear && <span className="text-white/90 text-sm">{movie.releaseYear}</span>}
            <span className="text-white/50 text-sm">·</span>
            <span className="text-white/90 text-sm uppercase tracking-wide">{movie.genre}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.02] mb-5">
            {movie.title}
          </h1>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed line-clamp-3 mb-7 max-w-xl">
            {movie.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/movies/${movie.id}`}
              className="inline-flex items-center gap-2.5 bg-brand-orange hover:bg-brand-orange-light text-white font-bold px-7 py-3 rounded-sm transition-all hover:scale-[1.02] shadow-orange-glow-sm"
            >
              <Play size={20} weight="fill" />
              {showPremiumCta ? 'Watch Trailer' : isFree ? 'Watch Now' : 'Play'}
            </Link>
            <Link
              href={`/movies/${movie.id}`}
              className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/55 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-sm border border-white/25 transition-all"
            >
              <Info size={18} />
              Details
            </Link>
            {showPremiumCta && (
              <Link
                href="/register/premium"
                className="inline-flex items-center gap-1.5 text-brand-orange-light hover:text-white font-semibold text-sm transition-colors ml-1"
              >
                Unlock full movie with Premium →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
