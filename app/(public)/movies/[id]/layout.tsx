import type { Metadata } from 'next';
import { fetchMovieById } from '@/lib/movies-server';
import { movieMetadata, movieJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const movie = await fetchMovieById(params.id);
  if (!movie) return { title: 'Movie Not Found' };
  return movieMetadata(movie);
}

export default async function MovieLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const movie = await fetchMovieById(params.id);
  const jsonLd = movie ? movieJsonLd(movie) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
