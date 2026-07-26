import type { Metadata } from 'next';
import { fetchMovies } from '@/lib/movies-server';
import BrowseClient from '@/components/streaming/BrowseClient';

export async function generateMetadata({ params }: { params: { genre: string } }): Promise<Metadata> {
  const genre = decodeURIComponent(params.genre);
  const label = genre.charAt(0).toUpperCase() + genre.slice(1);
  return {
    title: `${label} Movies`,
    description: `Watch ${label} Nigerian films and Nollywood series on FejosBaba TV.`,
  };
}

export default async function GenreBrowsePage({ params }: { params: { genre: string } }) {
  const genre = decodeURIComponent(params.genre);
  const movies = await fetchMovies();
  const label = genre.charAt(0).toUpperCase() + genre.slice(1);

  return (
    <BrowseClient movies={movies} initialGenre={genre} title={`${label} Movies`} />
  );
}
