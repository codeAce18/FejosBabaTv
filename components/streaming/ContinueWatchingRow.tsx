'use client';
import { useEffect, useState } from 'react';
import MovieRow from '@/components/streaming/MovieRow';
import { getWatchHistory } from '@/lib/watchHistory';
import type { Movie } from '@/lib/types';

interface ContinueWatchingRowProps {
  movies: Movie[];
  hasAccess: boolean;
}

export default function ContinueWatchingRow({ movies, hasAccess }: ContinueWatchingRowProps) {
  const [continueMovies, setContinueMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const history = getWatchHistory();
    if (history.length === 0) return;

    const byId = new Map(movies.map((m) => [m.id, m]));
    const ordered = history
      .map((h) => byId.get(h.movieId))
      .filter((m): m is Movie => Boolean(m));

    setContinueMovies(ordered);
  }, [movies]);

  if (continueMovies.length === 0) return null;

  return (
    <MovieRow
      title="Continue Watching"
      movies={continueMovies}
      hasAccess={hasAccess}
    />
  );
}
