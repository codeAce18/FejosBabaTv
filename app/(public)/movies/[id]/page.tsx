'use client';

import { useQuery, useMutation } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Lock, Eye, CaretLeft, Crown, FilmStrip } from '@phosphor-icons/react';

import { moviesApi } from '@/lib/api';

import { useAuthStore } from '@/store/authStore';

import { Badge, Spinner, Card } from '@/components/ui';

import VideoPlayer from '@/components/streaming/VideoPlayer';

import MovieRow from '@/components/streaming/MovieRow';

import MovieArtwork from '@/components/streaming/MovieArtwork';

import { addToWatchHistory } from '@/lib/watchHistory';

import { getStreamStatusLabel } from '@/lib/movie-utils';

import { formatNumber, formatDate } from '@/lib/utils';

import type { Movie, MovieCrew } from '@/lib/types';

import Link from 'next/link';



export default function MoviePage() {

  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const { isAuthenticated, isPremium, isAdmin } = useAuthStore();

  const hasFullAccess = isPremium() || isAdmin();

  const viewTracked = useRef(false);

  const historySaved = useRef(false);



  const { data: movieData, isLoading: movieLoading } = useQuery({

    queryKey: ['movie', id],

    queryFn: () => moviesApi.getById(id),

  });



  const { data: allMoviesData } = useQuery({

    queryKey: ['movies'],

    queryFn: () => moviesApi.getAll(),

  });



  const { data: streamData, isLoading: streamLoading } = useQuery({

    queryKey: ['stream', id],

    queryFn: () => moviesApi.getStreamUrl(id),

    enabled: !!id,

  });



  const movie = movieData?.data?.data as Movie | undefined;

  const stream = streamData?.data?.data as { type: 'trailer' | 'full'; url: string } | undefined;

  const allMovies = (allMoviesData?.data?.data as Movie[]) || [];

  const related = allMovies.filter((m) => m && m.id !== id && m.genre === movie?.genre).slice(0, 10);



  const videoSrc = stream?.url || movie?.trailerUrl || '';

  const isPremiumLocked = movie?.isPremium && !hasFullAccess && stream?.type === 'trailer';

  const statusLabel = movie ? getStreamStatusLabel(movie, stream) : '';



  useEffect(() => {

    if (id && !viewTracked.current) {

      viewTracked.current = true;

      moviesApi.trackView(id).catch(() => {});

    }

  }, [id]);



  useEffect(() => {

    if (movie && !historySaved.current) {

      historySaved.current = true;

      addToWatchHistory({

        movieId: movie.id,

        title: movie.title,

        thumbnail: movie.thumbnail,

      });

    }

  }, [movie]);



  if (movieLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center pt-20">

        <Spinner size={40} />

      </div>

    );

  }



  if (!movie) {

    return (

      <div className="min-h-screen flex items-center justify-center pt-20">

        <div className="text-center">

          <h2 className="font-display text-2xl text-white mb-2">Movie not found</h2>

          <Link href="/" className="text-brand-orange hover:underline">← Back to home</Link>

        </div>

      </div>

    );

  }



  const crew = (movie.crew || {}) as MovieCrew;

  const cast = (movie.cast || []) as string[];

  const crewEntries = [

    ['Written by', crew.writtenBy],

    ['Director', crew.director],

    ['Producer', crew.producer],

    ['Continuity', crew.continuity],

    ['Editor', crew.editor],

    ['Light', crew.light],

    ['D.O.P', crew.dop],

    ['Production Manager', crew.productionManager],

    ['Sound', crew.sound],

  ].filter(([, v]) => v) as [string, string][];



  return (

    <div className="min-h-screen pb-20">

      <div className="relative h-[52vh] min-h-[340px] -mt-16 overflow-hidden">
        <div className="absolute inset-0">
          <MovieArtwork
            variant="hero"
            poster={movie.thumbnail}
            hero={movie.heroImage}
            alt={movie.title}
            className="w-full h-full"
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:px-12 max-w-7xl mx-auto z-10">

          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-ink-secondary hover:text-white text-sm mb-4">

            <CaretLeft size={16} /> Back

          </button>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{movie.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-secondary">

            <Badge variant="orange">{movie.genre}</Badge>

            {movie.isPremium ? <Badge variant="navy">Premium</Badge> : <Badge variant="gray">Free</Badge>}

            {movie.releaseYear && <span>{movie.releaseYear}</span>}

            <span className="flex items-center gap-1"><Eye size={12} />{formatNumber(movie.views)} views</span>

          </div>

        </div>

      </div>



      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-8 relative z-10">

        {isPremiumLocked && (

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-navy/30 border border-brand-navy/50 rounded-lg px-4 py-3">

            <div className="flex items-center gap-2 text-sm text-ink-secondary">

              <Lock size={16} className="text-brand-orange" weight="fill" />

              Full movie requires Premium. You&apos;re watching the trailer preview.

            </div>

            <Link href="/register/premium" className="inline-flex items-center gap-2 bg-brand-orange text-white font-semibold px-4 py-2 rounded-sm text-sm shrink-0">

              <Crown size={16} weight="fill" /> Get Premium

            </Link>

          </div>

        )}



        <div className="relative rounded-lg overflow-hidden bg-cinema-black border border-cinema-border aspect-video shadow-2xl">

          {streamLoading ? (

            <div className="absolute inset-0 flex items-center justify-center"><Spinner size={32} /></div>

          ) : videoSrc ? (

            <VideoPlayer src={videoSrc} poster={movie.thumbnail} className="absolute inset-0" />

          ) : (

            <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-muted text-sm gap-2">

              <FilmStrip size={32} />

              Video unavailable — add trailer or full movie URL in admin

            </div>

          )}

        </div>



        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <p className="text-ink-secondary leading-relaxed text-base">{movie.description}</p>



            {stream && (

              <Card className="flex items-center gap-3">

                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${stream.type === 'full' ? 'bg-emerald-400' : 'bg-brand-orange'}`} />

                <p className="text-sm text-ink-secondary">{statusLabel}</p>

              </Card>

            )}



            {cast.length > 0 && (

              <div>

                <h3 className="font-display text-sm text-ink-muted uppercase tracking-wider mb-3">Cast</h3>

                <div className="flex flex-wrap gap-2">

                  {cast.map((name) => (

                    <span key={name} className="text-sm bg-cinema-surface border border-cinema-border text-ink-secondary px-3 py-1 rounded-full">{name}</span>

                  ))}

                </div>

              </div>

            )}



            {crewEntries.length > 0 && (

              <div>

                <h3 className="font-display text-sm text-ink-muted uppercase tracking-wider mb-3">Crew</h3>

                <div className="grid sm:grid-cols-2 gap-2">

                  {crewEntries.map(([role, name]) => (

                    <div key={role} className="flex justify-between gap-4 text-sm border-b border-cinema-border/50 py-2">

                      <span className="text-ink-muted">{role}</span>

                      <span className="text-white text-right">{name}</span>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>



          <Card className="space-y-3 h-fit">

            <h3 className="font-display text-sm text-ink-secondary uppercase tracking-wider">Details</h3>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between"><span className="text-ink-muted">Genre</span><span className="text-white">{movie.genre}</span></div>

              {movie.releaseYear && <div className="flex justify-between"><span className="text-ink-muted">Year</span><span className="text-white">{movie.releaseYear}</span></div>}

              <div className="flex justify-between"><span className="text-ink-muted">Access</span><span className="text-white">{movie.isPremium ? 'Premium' : 'Free'}</span></div>

              <div className="flex justify-between"><span className="text-ink-muted">Added</span><span className="text-white">{formatDate(movie.createdAt)}</span></div>

            </div>

            {isPremiumLocked && !isAuthenticated() && (

              <Link href="/login" className="block text-center text-sm text-brand-orange hover:underline pt-2">

                Already have Premium? Login

              </Link>

            )}

          </Card>

        </div>

      </div>



      {related.length > 0 && (

        <div className="mt-12">

          <MovieRow title="More Like This" movies={related} hasAccess={hasFullAccess} />

        </div>

      )}

    </div>

  );

}

