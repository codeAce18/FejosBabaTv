import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchMovies } from '@/lib/movies-server';
import SearchPageClient from '@/components/streaming/SearchPageClient';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Search Movies',
  description: 'Search Nigerian films and Nollywood series on FejosBaba TV.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const movies = await fetchMovies();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Spinner size={32} />
        </div>
      }
    >
      <SearchPageClient movies={movies} initialQuery={searchParams.q} />
    </Suspense>
  );
}
