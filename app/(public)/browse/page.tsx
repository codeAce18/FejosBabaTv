import type { Metadata } from 'next';
import { fetchMovies } from '@/lib/movies-server';
import BrowseClient from '@/components/streaming/BrowseClient';

export const metadata: Metadata = {
  title: 'Browse Movies',
  description: 'Browse all Nigerian films and series on FejosBaba TV — filter by genre, trending, and new releases.',
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { sort?: string; filter?: string; q?: string };
}) {
  const movies = await fetchMovies();
  const title =
    searchParams.filter === 'premium'
      ? 'Premium Exclusives'
      : searchParams.filter === 'free'
        ? 'Free to Watch'
        : searchParams.sort === 'trending'
          ? 'Trending Now'
          : searchParams.sort === 'new'
            ? 'New Releases'
            : 'Browse All';

  return (
    <BrowseClient
      movies={movies}
      initialSort={searchParams.sort}
      initialFilter={searchParams.filter}
      title={title}
    />
  );
}
