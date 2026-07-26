'use client';
import Link from 'next/link';
import { Play, Lock, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import PosterImage from '@/components/streaming/PosterImage';
import type { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
  hasAccess?: boolean;
}

export default function MovieCard({ movie, hasAccess = false }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-cinema-surface border border-cinema-border transition-all duration-300 hover:border-brand-orange/40 hover:shadow-card-hover hover:-translate-y-1">

        {/* Thumbnail */}
        <div className="relative aspect-[2/3] overflow-hidden">
        <PosterImage src={movie.thumbnail} alt={movie.title} variant="card" className="absolute inset-0" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-transparent opacity-80" />

          {/* Orange glow on hover */}
          <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/5 transition-all duration-300" />

          {/* Play / Lock button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 ${
              !hasAccess && movie.isPremium
                ? 'bg-black/60 border-brand-orange/50'
                : 'bg-brand-orange/90 border-brand-orange shadow-orange-glow'
            }`}>
              {!hasAccess && movie.isPremium ? (
                <Lock size={22} className="text-brand-orange" />
              ) : (
                <Play size={22} className="text-white fill-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Premium badge */}
          {movie.isPremium && (
            <div className="absolute top-2 right-2">
              <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                PREMIUM
              </span>
            </div>
          )}

          {/* Genre badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/60 backdrop-blur-sm text-ink-secondary text-xs px-2 py-0.5 rounded-full border border-cinema-border">
              {movie.genre}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-display text-base font-semibold text-white leading-tight line-clamp-2 group-hover:text-brand-orange-light transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {movie.releaseYear && (
                <span className="text-xs text-ink-muted">{movie.releaseYear}</span>
              )}
              <div className="flex items-center gap-1 text-ink-muted">
                <Eye size={10} />
                <span className="text-xs">{formatNumber(movie.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton loader ───
export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-cinema-surface border border-cinema-border">
      <div className="aspect-[2/3] skeleton" />
    </div>
  );
}