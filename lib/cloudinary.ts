/**
 * Cloudinary URL helpers — inject transforms without re-uploading assets.
 * Portrait posters → 2:3 cards. Landscape → 16:9 hero.
 */

function injectTransform(url: string, transform: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (url.includes('/upload/c_') || url.includes('/upload/ar_')) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
}

/** Full poster visible in 2:3 cards — smart crop focused on center. */
export function posterCardUrl(url?: string | null): string {
  if (!url) return '';
  return injectTransform(url, 'c_fill,ar_2:3,g_auto,q_auto,f_auto');
}

/** Wide hero banner — use heroImage URL with this transform. */
export function posterHeroUrl(url?: string | null): string {
  if (!url) return '';
  return injectTransform(url, 'c_fill,ar_16:9,g_auto,q_auto,f_auto');
}

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '';
  return url.startsWith('http://') ? url.replace('http://', 'https://') : url.trim();
}
