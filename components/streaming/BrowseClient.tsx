'use client';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input, EmptyState } from '@/components/ui';
import { MovieRowCard } from '@/components/streaming/MovieRow';
import { filterMovies } from '@/lib/movie-utils';
import { useAuthStore } from '@/store/authStore';
import type { Movie } from '@/lib/types';

const GENRES = ['All', 'Drama', 'Action', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Documentary'];

interface BrowseClientProps {
  movies: Movie[];
  initialSort?: string;
  initialFilter?: string;
  initialGenre?: string;
  title?: string;
}

export default function BrowseClient({
  movies,
  initialSort,
  initialFilter,
  initialGenre = 'all',
  title = 'Browse All',
}: BrowseClientProps) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState(initialGenre === 'all' ? 'All' : initialGenre.charAt(0).toUpperCase() + initialGenre.slice(1));
  const { isPremium } = useAuthStore();
  const hasAccess = isPremium();

  const filtered = useMemo(
    () =>
      filterMovies(movies, {
        search,
        genre: genre === 'All' ? undefined : genre,
        filter: initialFilter,
        sort: initialSort,
      }),
    [movies, search, genre, initialFilter, initialSort]
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1920px] mx-auto">
      <h1 className="font-display text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-ink-secondary text-sm mb-8">{filtered.length} titles</p>

      <div className="mb-8 space-y-4 max-w-xl">
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`flex-shrink-0 text-xs font-medium px-4 py-1.5 rounded-full border transition-all ${
                genre === g
                  ? 'bg-brand-orange border-brand-orange text-white'
                  : 'border-cinema-border text-ink-secondary hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Search size={28} />} title="No movies found" description="Try a different search or genre" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((movie) => (
            <MovieRowCard key={movie.id} movie={movie} hasAccess={hasAccess} />
          ))}
        </div>
      )}
    </div>
  );
}
