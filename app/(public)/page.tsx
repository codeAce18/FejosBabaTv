import { fetchMovies, checkApiConnection } from '@/lib/movies-server';
import HomePageClient from '@/components/streaming/HomePageClient';

export default async function HomePage() {
  const [movies, apiConnected] = await Promise.all([fetchMovies(), checkApiConnection()]);

  return <HomePageClient initialMovies={movies} apiConnected={apiConnected} />;
}
