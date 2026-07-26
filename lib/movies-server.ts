import type { Movie } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fejosbabatv.com';

export async function fetchMovies(): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_URL}/api/movies`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchMovieById(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_URL}/api/movies/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as Movie) || null;
  } catch {
    return null;
  }
}

export async function checkApiConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { next: { revalidate: 0 } });
    return res.ok;
  } catch {
    return false;
  }
}
