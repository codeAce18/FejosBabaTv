'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Lock, Eye, Calendar, Tag, ChevronLeft, Crown } from 'lucide-react';
import { moviesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button, Badge, Spinner, Card } from '@/components/ui';
import { formatNumber, formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as unknown as React.ComponentType<any>;

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, isPremium, isStudent, isAdmin } = useAuthStore();
  const hasFullAccess = isPremium() || isStudent() || isAdmin();

  const { data: movieData, isLoading: movieLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesApi.getById(id),
  });

  const { data: streamData, isLoading: streamLoading } = useQuery({
    queryKey: ['stream', id],
    queryFn: () => moviesApi.getStreamUrl(id),
    enabled: !!id,
  });

  const viewMutation = useMutation({ mutationFn: () => moviesApi.trackView(id) });

  useEffect(() => {
    if (id) viewMutation.mutate();
  }, [id]);

  const movie = movieData?.data?.data as any;
  const stream = streamData?.data?.data as any;

  if (movieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-white mb-2">Movie not found</h2>
          <Link href="/" className="text-brand-orange hover:underline">← Back to movies</Link>
        </div>
      </div>
    );
  }

  const showLockScreen = movie.isPremium && !hasFullAccess;

  return (
    <div className="min-h-screen pb-20">
      {/* ─── Video / Lock Section ─── */}
      <div className="relative bg-cinema-black">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-ink-secondary hover:text-white transition-colors text-sm mb-4"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {/* Player / Lock */}
          <div className="relative rounded-2xl overflow-hidden bg-cinema-surface border border-cinema-border aspect-video">
            {stream && !showLockScreen ? (
              <ReactPlayer
                url={stream.url}
                width="100%"
                height="100%"
                controls
                playing={false}
                config={{ file: { attributes: { controlsList: 'nodownload' } } } as any}
              />
            ) : showLockScreen ? (
              // ─── LOCK SCREEN ───
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                {/* Blurred thumbnail background */}
                <Image
                  src={movie.thumbnail}
                  alt={movie.title}
                  fill
                  className="object-cover opacity-20 blur-sm scale-110"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-cinema-surface/80 border border-brand-orange/50 flex items-center justify-center mb-4 animate-pulse-orange">
                    <Lock size={32} className="text-brand-orange" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Full Movie Locked
                  </h3>
                  <p className="text-ink-secondary text-sm mb-6 max-w-xs">
                    {isAuthenticated()
                      ? 'Upgrade to Premium to watch this full movie'
                      : 'Create a Premium account to unlock this movie'}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/register/premium"
                      className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-orange-glow"
                    >
                      <Crown size={16} />
                      Upgrade to Premium
                    </Link>
                    {!isAuthenticated() && (
                      <Link
                        href="/login"
                        className="border border-cinema-border text-ink-secondary hover:text-white hover:border-white/30 font-medium px-6 py-3 rounded-lg transition-all"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                  <p className="text-ink-muted text-xs mt-4">
                    ↓ Watch the trailer below for free
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size={32} />
              </div>
            )}
          </div>

          {/* Trailer notice for locked movies */}
          {showLockScreen && stream && (
            <div className="mt-4 rounded-xl overflow-hidden border border-cinema-border aspect-video">
              <ReactPlayer
                url={stream.url}
                width="100%"
                height="100%"
                controls
                playing={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── Movie Info ─── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="orange">{movie.genre}</Badge>
                {movie.isPremium && <Badge variant="navy">Premium</Badge>}
                {movie.releaseYear && (
                  <div className="flex items-center gap-1 text-ink-muted text-xs">
                    <Calendar size={12} />
                    {movie.releaseYear}
                  </div>
                )}
                <div className="flex items-center gap-1 text-ink-muted text-xs">
                  <Eye size={12} />
                  {formatNumber(movie.views)} views
                </div>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              <p className="text-ink-secondary leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Access type indicator */}
            {stream && (
              <Card className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${stream.type === 'full' ? 'bg-green-400' : 'bg-brand-orange'}`} />
                <p className="text-sm text-ink-secondary">
                  {stream.type === 'full'
                    ? '✅ You are watching the full movie'
                    : '🎬 You are watching the free trailer — upgrade to watch the full movie'}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Thumbnail */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-cinema-border">
              <Image src={movie.thumbnail} alt={movie.title} fill className="object-cover" />
            </div>

            {/* Details */}
            <Card className="space-y-3">
              <h3 className="font-display text-sm text-ink-secondary uppercase tracking-wider">Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Genre</span>
                  <span className="text-white">{movie.genre}</span>
                </div>
                {movie.releaseYear && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Year</span>
                    <span className="text-white">{movie.releaseYear}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Access</span>
                  <span className={movie.isPremium ? 'text-brand-orange font-semibold' : 'text-green-400'}>
                    {movie.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Added</span>
                  <span className="text-white">{formatDate(movie.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Upgrade CTA */}
            {showLockScreen && (
              <Link
                href="/register/premium"
                className="flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-brand-orange-light text-white font-semibold py-3 rounded-xl transition-all hover:shadow-orange-glow"
              >
                <Crown size={16} />
                Unlock Full Movie
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}