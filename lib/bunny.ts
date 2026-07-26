/**
 * Bunny.net Stream URL helpers.
 * Accepts play links, embed links, or libraryId + videoId and returns iframe embed URL.
 */

const BUNNY_PLAY_PATTERN =
  /(?:https?:\/\/)?(?:player|video)\.mediadelivery\.net\/play\/(\d+)\/([a-f0-9-]+)/i;

const BUNNY_EMBED_PATTERN =
  /(?:https?:\/\/)?iframe\.mediadelivery\.net\/embed\/(\d+)\/([a-f0-9-]+)/i;

export function parseBunnyVideo(url: string): { libraryId: string; videoId: string } | null {
  const playMatch = url.match(BUNNY_PLAY_PATTERN);
  if (playMatch) return { libraryId: playMatch[1], videoId: playMatch[2] };

  const embedMatch = url.match(BUNNY_EMBED_PATTERN);
  if (embedMatch) return { libraryId: embedMatch[1], videoId: embedMatch[2] };

  return null;
}

export function isBunnyStreamUrl(url: string): boolean {
  return parseBunnyVideo(url) !== null;
}

/** Always returns iframe embed URL for in-site playback. */
export function toBunnyEmbedUrl(url: string, autoplay = false): string | null {
  const parsed = parseBunnyVideo(url);
  if (!parsed) return null;

  const base = `https://iframe.mediadelivery.net/embed/${parsed.libraryId}/${parsed.videoId}`;
  const params = new URLSearchParams({
    autoplay: autoplay ? 'true' : 'false',
    preload: 'true',
  });
  return `${base}?${params.toString()}`;
}
