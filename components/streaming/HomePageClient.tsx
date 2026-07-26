'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { WarningCircle, WifiX } from '@phosphor-icons/react';
import { useAuthStore } from '@/store/authStore';
import HeroBanner from '@/components/streaming/HeroBanner';
import MovieRow, { MovieRowSkeleton } from '@/components/streaming/MovieRow';
import ContinueWatchingRow from '@/components/streaming/ContinueWatchingRow';
import {
  groupMoviesByGenre,
  getTrendingMovies,
  getNewReleases,
  getPremiumMovies,
  getFreeMovies,
} from '@/lib/movie-utils';
import type { Movie } from '@/lib/types';

interface HomePageClientProps {
  initialMovies: Movie[];
  apiConnected: boolean;
}

export default function HomePageClient({ initialMovies, apiConnected }: HomePageClientProps) {
  const { isAuthenticated, isPremium } = useAuthStore();
  const hasAccess = isPremium();
  const movies = initialMovies;

  const featured = movies[0];
  const trending = useMemo(() => getTrendingMovies(movies), [movies]);
  const newReleases = useMemo(() => getNewReleases(movies), [movies]);
  const premium = useMemo(() => getPremiumMovies(movies), [movies]);
  const free = useMemo(() => getFreeMovies(movies), [movies]);
  const byGenre = useMemo(() => groupMoviesByGenre(movies), [movies]);

  if (!apiConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-md">
          <WifiX size={48} className="text-brand-orange mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">Can&apos;t reach the server</h2>
          <p className="text-ink-secondary text-sm mb-4">
            Make sure the backend is running on port 5000, then refresh this page.
          </p>
          <code className="text-xs bg-cinema-surface px-3 py-2 rounded-lg text-brand-orange block">
            cd FejosMovieHub-backend → npm run dev
          </code>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-md">
          <WarningCircle size={48} className="text-ink-muted mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">No movies yet</h2>
          <p className="text-ink-secondary text-sm">
            Log in as admin and add movies from the admin dashboard.
          </p>
          <Link href="/login" className="inline-block mt-4 text-brand-orange hover:underline text-sm font-medium">
            Admin login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {featured && <HeroBanner movie={featured} hasAccess={hasAccess} />}

      <div className="relative z-10 space-y-2">
        {!isAuthenticated() && (
          <div className="mx-4 sm:mx-8 lg:mx-12 mb-6 rounded-xl bg-navy-gradient border border-brand-navy/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                Unlock full movies with <span className="text-brand-orange">Premium</span>
              </h2>
              <p className="text-ink-secondary text-sm mt-1">From ₦2,000/month · Cancel anytime</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/login" className="text-sm text-ink-secondary hover:text-white px-4 py-2">Login</Link>
              <Link href="/register/premium" className="bg-brand-orange hover:bg-brand-orange-light text-white text-sm font-semibold px-5 py-2 rounded-md">
                Get Premium
              </Link>
            </div>
          </div>
        )}

        <ContinueWatchingRow movies={movies} hasAccess={hasAccess} />
        <MovieRow title="Trending Now" movies={trending} hasAccess={hasAccess} seeAllHref="/browse?sort=trending" />
        <MovieRow title="New Releases" movies={newReleases} hasAccess={hasAccess} seeAllHref="/browse?sort=new" />
        {free.length > 0 && (
          <MovieRow title="Free to Watch" movies={free} hasAccess={hasAccess} seeAllHref="/browse?filter=free" />
        )}
        {premium.length > 0 && (
          <MovieRow title="Premium Exclusives" movies={premium} hasAccess={hasAccess} seeAllHref="/browse?filter=premium" />
        )}
        {byGenre.map(({ genre, movies: genreMovies }) => (
          <MovieRow
            key={genre}
            title={genre}
            movies={genreMovies}
            hasAccess={hasAccess}
            seeAllHref={`/browse/${encodeURIComponent(genre.toLowerCase())}`}
          />
        ))}
      </div>
    </div>
  );
}

export { MovieRowSkeleton };
