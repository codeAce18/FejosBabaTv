'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, SlidersHorizontal, Play, ChevronRight, Flame, Star, Clock } from 'lucide-react';
import { moviesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import MovieCard, { MovieCardSkeleton } from '@/components/MovieCard';
import { Input, EmptyState } from '@/components/ui';
import type { Movie } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

const GENRES = ['All', 'Drama', 'Action', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Documentary'];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const { isAuthenticated, isPremium } = useAuthStore();

  const { data, isLoading } = useQuery<Movie[], Error>({
    queryKey: ['movies'],
    queryFn: async () => {
      const res = await moviesApi.getAll();
      return res?.data?.data as Movie[];
    },
  });

  const movies: Movie[] = data || [];

  const filtered = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || m.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const featured = movies[0];
  const trending = movies.slice(0, 6);
  const hasAccess = isPremium();

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      {featured && (
        <section className="relative h-[75vh] min-h-[500px] flex items-end overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <div className="max-w-xl animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} className="text-brand-orange" />
                <span className="text-brand-orange text-xs font-semibold uppercase tracking-widest">Featured</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
                {featured.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-ink-secondary bg-cinema-surface/80 px-2 py-1 rounded-full border border-cinema-border">
                  {featured.genre}
                </span>
                {featured.releaseYear && (
                  <span className="text-xs text-ink-secondary">{featured.releaseYear}</span>
                )}
                {featured.isPremium && (
                  <span className="text-xs bg-brand-orange text-white px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
                )}
              </div>
              <p className="text-ink-secondary text-sm leading-relaxed line-clamp-3 mb-6">
                {featured.description}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href={`/movies/${featured.id}`}
                  className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-orange-glow active:scale-95"
                >
                  <Play size={16} className="fill-white" />
                  {featured.isPremium && !hasAccess ? 'Watch Trailer' : 'Watch Now'}
                </Link>
                {featured.isPremium && !hasAccess && (
                  <Link
                    href="/register/premium"
                    className="flex items-center gap-2 border border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10 font-semibold px-6 py-3 rounded-lg transition-all"
                  >
                    Get Premium
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Premium Banner (non-authenticated) */}
        {!isAuthenticated() && (
          <div className="mb-10 rounded-2xl bg-navy-gradient border border-brand-navy/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-1">
                Unlock Full Movies with <span className="text-brand-orange">Premium</span>
              </h2>
              <p className="text-ink-secondary text-sm">
                Get unlimited access to all full movies and series. Starting at ₦2,000/month.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/login" className="text-ink-secondary hover:text-white text-sm font-medium px-4 py-2 transition-colors">
                Login
              </Link>
              <Link
                href="/register/premium"
                className="bg-brand-orange hover:bg-brand-orange-light text-white font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-orange-glow-sm whitespace-nowrap"
              >
                Get Premium →
              </Link>
            </div>
          </div>
        )}

        {/* Search + Genre Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search movies, genres..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
          </div>

          {/* Genre pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`flex-shrink-0 text-xs font-medium px-4 py-1.5 rounded-full border transition-all ${
                  selectedGenre === genre
                    ? 'bg-brand-orange border-brand-orange text-white shadow-orange-glow-sm'
                    : 'border-cinema-border text-ink-secondary hover:border-brand-orange/50 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        {!search && selectedGenre === 'All' && trending.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Flame size={18} className="text-brand-orange" />
              <h2 className="font-display text-xl font-semibold text-white">Trending Now</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {isLoading
                ? Array(6).fill(0).map((_, i) => <MovieCardSkeleton key={i} />)
                : trending.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} hasAccess={hasAccess} />
                ))
              }
            </div>
          </section>
        )}

        {/* All Movies */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-brand-orange" />
              <h2 className="font-display text-xl font-semibold text-white">
                {search ? `Results for "${search}"` : selectedGenre === 'All' ? 'All Movies' : selectedGenre}
              </h2>
              <span className="text-ink-muted text-sm">({filtered.length})</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, i) => <MovieCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="No movies found"
              description="Try a different search term or genre filter"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {filtered.map((movie) => (
                <MovieCard key={movie.id} movie={movie} hasAccess={hasAccess} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}