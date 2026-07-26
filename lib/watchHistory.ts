export interface WatchHistoryItem {
  movieId: string;
  watchedAt: string;
  title: string;
  thumbnail: string;
}

const STORAGE_KEY = 'fejos-watch-history';
const MAX_ITEMS = 12;

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchHistoryItem[];
  } catch {
    return [];
  }
}

export function addToWatchHistory(item: Omit<WatchHistoryItem, 'watchedAt'>): void {
  if (typeof window === 'undefined') return;
  const entry: WatchHistoryItem = { ...item, watchedAt: new Date().toISOString() };
  const without = getWatchHistory().filter((h) => h.movieId !== item.movieId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...without].slice(0, MAX_ITEMS)));
}

export function clearWatchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
