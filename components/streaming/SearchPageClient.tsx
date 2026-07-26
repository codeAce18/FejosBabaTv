'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input, EmptyState } from '@/components/ui';
import { MovieRowCard } from '@/components/streaming/MovieRow';
import { filterMovies } from '@/lib/movie-utils';
import { useAuthStore } from '@/store/authStore';
import type { Movie } from '@/lib/types';

interface SearchPageClientProps {
  movies: Movie[];
  initialQuery?: string;
}

export default function SearchPageClient({ movies, initialQuery = '' }: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '');
  const { isPremium } = useAuthStore();
  const hasAccess = isPremium();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const results = useMemo(
    () => (query.trim() ? filterMovies(movies, { search: query.trim() }) : []),
    [movies, query]
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value.trim());
    router.replace(params.toString() ? `/search?${params.toString()}` : '/search', { scroll: false });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1920px] mx-auto">
      <h1 className="font-display text-3xl font-bold text-white mb-6">Search</h1>

      <div className="relative max-w-2xl mb-10">
        <Input
          placeholder="Search by title, genre, or description..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          leftIcon={<Search size={18} />}
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-white p-1"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!query.trim() ? (
        <div className="text-ink-secondary text-sm">
          <p className="mb-4">Try searching for a movie title or genre like &quot;Drama&quot; or &quot;War&quot;.</p>
          <div className="flex flex-wrap gap-2">
            {['Drama', 'Action', 'Comedy', 'Premium'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSearch(tag)}
                className="text-xs px-3 py-1.5 rounded-full border border-cinema-border text-ink-secondary hover:border-brand-orange hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title={`No results for "${query}"`}
          description="Try a different keyword or browse all movies"
        />
      ) : (
        <>
          <p className="text-ink-muted text-sm mb-6">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <MovieRowCard key={movie.id} movie={movie} hasAccess={hasAccess} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
