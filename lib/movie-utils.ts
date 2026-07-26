import type { Movie } from '@/lib/types';
import type { StreamData } from '@/lib/types';

export interface MovieFilterOptions {
  search?: string;
  genre?: string;
  filter?: string;
  sort?: string;
}

export function filterMovies(movies: Movie[], opts: MovieFilterOptions): Movie[] {
  let result = [...movies];

  if (opts.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q)
    );
  }

  if (opts.genre) {
    result = result.filter((m) => m.genre.toLowerCase() === opts.genre!.toLowerCase());
  }

  if (opts.filter === 'premium') {
    result = result.filter((m) => m.isPremium);
  } else if (opts.filter === 'free') {
    result = result.filter((m) => !m.isPremium);
  }

  if (opts.sort === 'new') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (opts.sort === 'views') {
    result.sort((a, b) => b.views - a.views);
  } else if (opts.sort === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
}

export function getTrendingMovies(movies: Movie[], limit = 12): Movie[] {
  return [...movies].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getNewReleases(movies: Movie[], limit = 12): Movie[] {
  return [...movies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getPremiumMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.isPremium);
}

export function getFreeMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => !m.isPremium);
}

export function groupMoviesByGenre(movies: Movie[]): { genre: string; movies: Movie[] }[] {
  const map = new Map<string, Movie[]>();
  for (const movie of movies) {
    const key = movie.genre || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(movie);
  }
  return Array.from(map.entries()).map(([genre, items]) => ({ genre, movies: items }));
}

export function getStreamStatusLabel(
  movie: Pick<Movie, 'isPremium' | 'fullMovieUrl'>,
  stream?: Pick<StreamData, 'type'> | null
): string {
  if (!stream) return 'Loading…';

  if (stream.type === 'full') {
    return movie.isPremium ? 'Full movie · Premium access' : 'Full movie · Free to watch';
  }

  if (movie.isPremium) {
    return 'Trailer preview · Upgrade for full movie';
  }

  if (!movie.fullMovieUrl) {
    return 'Trailer preview · Full film URL not uploaded yet';
  }

  return 'Trailer preview';
}

export function shouldShowPremiumLock(
  movie: Pick<Movie, 'isPremium'>,
  hasFullAccess: boolean
): boolean {
  return movie.isPremium && !hasFullAccess;
}

export function getHeroImage(movie: Pick<Movie, 'thumbnail' | 'heroImage'>): string {
  return movie.heroImage || movie.thumbnail;
}
