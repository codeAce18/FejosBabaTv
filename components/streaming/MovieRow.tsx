'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { CaretLeft, CaretRight, Play, Lock } from '@phosphor-icons/react';
import type { Movie } from '@/lib/types';
import MovieArtwork from '@/components/streaming/MovieArtwork';

interface MovieRowCardProps {
  movie: Movie;
  hasAccess?: boolean;
}

export function MovieRowCard({ movie, hasAccess = false }: MovieRowCardProps) {
  const locked = movie.isPremium && !hasAccess;

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group/card relative flex-shrink-0 w-[148px] sm:w-[168px] md:w-[188px] transition-transform duration-300 hover:scale-[1.04] hover:z-20"
    >
      <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden bg-cinema-surface ring-1 ring-white/5 group-hover/card:ring-brand-orange/50 group-hover/card:shadow-card-hover transition-all">
        <MovieArtwork
          variant="poster"
          poster={movie.thumbnail}
          alt={movie.title}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/25">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center border-2 backdrop-blur-sm ${
              locked ? 'border-brand-orange bg-black/70' : 'border-white bg-brand-orange'
            }`}
          >
            {locked ? (
              <Lock size={18} weight="fill" className="text-brand-orange" />
            ) : (
              <Play size={18} weight="fill" className="text-white ml-0.5" />
            )}
          </div>
        </div>
        {movie.isPremium ? (
          <span className="absolute top-2 right-2 bg-brand-orange text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm">
            Premium
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm border border-white/10">
            Free
          </span>
        )}
      </div>
      <p className="mt-2.5 text-xs sm:text-sm text-ink-secondary group-hover/card:text-white truncate transition-colors font-medium">
        {movie.title}
      </p>
    </Link>
  );
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  hasAccess?: boolean;
  seeAllHref?: string;
}

export default function MovieRow({ title, movies, hasAccess = false, seeAllHref }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const list = Array.isArray(movies) ? movies : [];

  if (list.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' });
  };

  return (
    <section className="mb-9 sm:mb-11 group/row">
      <div className="flex items-end justify-between mb-4 px-4 sm:px-8 lg:px-12">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-xs text-brand-orange hover:text-brand-orange-light font-semibold uppercase tracking-wider">
            View all
          </Link>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-2 top-0 bottom-10 z-10 w-11 h-11 items-center justify-center bg-cinema-black/70 opacity-0 group-hover/row:opacity-100 hover:bg-cinema-black/90 transition-all rounded-full border border-white/10"
          aria-label="Scroll left"
        >
          <CaretLeft size={22} weight="bold" className="text-white" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-12 pb-2 scroll-smooth"
        >
          {list.map((movie) => (
            <MovieRowCard key={movie.id} movie={movie} hasAccess={hasAccess} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-2 top-0 bottom-10 z-10 w-11 h-11 items-center justify-center bg-cinema-black/70 opacity-0 group-hover/row:opacity-100 hover:bg-cinema-black/90 transition-all rounded-full border border-white/10"
          aria-label="Scroll right"
        >
          <CaretRight size={22} weight="bold" className="text-white" />
        </button>
      </div>
    </section>
  );
}

export function MovieRowSkeleton() {
  return (
    <div className="mb-10 px-4 sm:px-8">
      <div className="h-7 w-44 bg-cinema-surface rounded mb-4 skeleton" />
      <div className="flex gap-3 overflow-hidden">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="w-[168px] aspect-[2/3] rounded-sm skeleton flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}
