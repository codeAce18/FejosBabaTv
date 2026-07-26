import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/movies-server';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ['/', '/browse', '/search', '/movies/', '/about', '/privacy', '/terms'] },
      { userAgent: '*', disallow: ['/admin/', '/student/', '/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
