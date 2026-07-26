import type { Metadata } from 'next';
import type { Movie } from './types';
import { SITE_URL } from './movies-server';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'FejosBaba TV — Nigerian Films & Series', template: '%s | FejosBaba TV' },
  description:
    'Stream premium Nigerian films and Nollywood series on FejosBaba TV. Watch trailers free, unlock full movies with Premium, or join the FejosBaba Film Academy.',
  keywords: ['Nigerian movies', 'Nollywood', 'FejosBaba', 'film streaming', 'Nigerian cinema'],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'FejosBaba TV',
    title: 'FejosBaba TV — Nigerian Films & Series',
    description: 'Stream premium Nigerian films and Nollywood series.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FejosBaba TV',
    description: 'Stream premium Nigerian films and Nollywood series.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/FejosLogo.png', type: 'image/png' }],
    apple: [{ url: '/FejosLogo.png', type: 'image/png' }],
    shortcut: ['/FejosLogo.png'],
  },
};

export function movieMetadata(movie: Movie): Metadata {
  const title = movie.title;
  const description = movie.description.slice(0, 160);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'video.movie',
      images: [{ url: movie.thumbnail, width: 1200, height: 630, alt: movie.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [movie.thumbnail],
    },
    alternates: { canonical: `${SITE_URL}/movies/${movie.id}` },
  };
}

export function movieJsonLd(movie: Movie) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.description,
    genre: movie.genre,
    datePublished: movie.releaseYear?.toString(),
    image: movie.thumbnail,
    url: `${SITE_URL}/movies/${movie.id}`,
  };
}
