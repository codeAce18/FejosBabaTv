import type { MetadataRoute } from 'next';
import { fetchMovies, SITE_URL } from '@/lib/movies-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await fetchMovies();
  const now = new Date();

  const movieUrls = movies.map((m) => ({
    url: `${SITE_URL}/movies/${m.id}`,
    lastModified: new Date(m.updatedAt || m.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/browse`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/register/premium`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about-ministry`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/staff`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/upcoming-program`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...movieUrls,
  ];
}
