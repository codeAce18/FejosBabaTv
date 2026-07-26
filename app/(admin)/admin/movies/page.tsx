'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash, FilmStrip, Eye, Lock, LockOpen, MagnifyingGlass } from '@phosphor-icons/react';
import { moviesApi, getErrorMessage } from '@/lib/api';
import { Button, Input, Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatDate, formatNumber } from '@/lib/utils';
import type { Movie, MovieCrew } from '@/lib/types';
import PosterImage from '@/components/streaming/PosterImage';
import toast from 'react-hot-toast';

interface MovieForm {
  title: string;
  description: string;
  genre: string;
  thumbnail: string;
  heroImage: string;
  trailerUrl: string;
  fullMovieUrl: string;
  isPremium: boolean;
  releaseYear: string;
  castText: string;
  writtenBy: string;
  director: string;
  producer: string;
  continuity: string;
  editor: string;
  light: string;
  dop: string;
  productionManager: string;
  sound: string;
}

const EMPTY_FORM: MovieForm = {
  title: '', description: '', genre: '', thumbnail: '', heroImage: '',
  trailerUrl: '', fullMovieUrl: '', isPremium: false, releaseYear: '',
  castText: '', writtenBy: '', director: '', producer: '', continuity: '',
  editor: '', light: '', dop: '', productionManager: '', sound: '',
};

function parseCast(text: string): string[] {
  return text.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
}

function buildCrew(form: MovieForm): MovieCrew | undefined {
  const crew: MovieCrew = {
    writtenBy: form.writtenBy || undefined,
    director: form.director || undefined,
    producer: form.producer || undefined,
    continuity: form.continuity || undefined,
    editor: form.editor || undefined,
    light: form.light || undefined,
    dop: form.dop || undefined,
    productionManager: form.productionManager || undefined,
    sound: form.sound || undefined,
  };
  return Object.values(crew).some(Boolean) ? crew : undefined;
}

export default function AdminMoviesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<MovieForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: () => moviesApi.getAll(),
  });

  const movies: Movie[] = data?.data?.data || [];
  const filtered = movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  const deleteMutation = useMutation({
    mutationFn: (id: string) => moviesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      toast.success('Movie deleted');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const openCreate = () => {
    setEditingMovie(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (movie: Movie) => {
    const crew = (movie.crew || {}) as MovieCrew;
    setEditingMovie(movie);
    setForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      thumbnail: movie.thumbnail,
      heroImage: movie.heroImage || '',
      trailerUrl: movie.trailerUrl,
      fullMovieUrl: movie.fullMovieUrl || '',
      isPremium: movie.isPremium,
      releaseYear: movie.releaseYear?.toString() || '',
      castText: (movie.cast || []).join('\n'),
      writtenBy: crew.writtenBy || '',
      director: crew.director || '',
      producer: crew.producer || '',
      continuity: crew.continuity || '',
      editor: crew.editor || '',
      light: crew.light || '',
      dop: crew.dop || '',
      productionManager: crew.productionManager || '',
      sound: crew.sound || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const cast = parseCast(form.castText);
    const payload = {
      title: form.title,
      description: form.description,
      genre: form.genre,
      thumbnail: form.thumbnail,
      heroImage: form.heroImage || undefined,
      trailerUrl: form.trailerUrl,
      fullMovieUrl: form.fullMovieUrl || undefined,
      isPremium: form.isPremium,
      releaseYear: form.releaseYear ? parseInt(form.releaseYear) : undefined,
      cast: cast.length ? cast : undefined,
      crew: buildCrew(form),
    };
    try {
      if (editingMovie) {
        await moviesApi.update(editingMovie.id, payload);
        toast.success('Movie updated!');
      } else {
        await moviesApi.create(payload);
        toast.success('Movie created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Movies</h2>
          <p className="text-ink-secondary text-sm mt-0.5">{movies.length} movies total</p>
        </div>
        <Button onClick={openCreate} size="md">
          <Plus size={16} /> Add Movie
        </Button>
      </div>

      <Input
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<MagnifyingGlass size={16} />}
        className="max-w-sm"
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-white transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-brand-orange uppercase tracking-wider">Basic Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Movie Title" placeholder="Breathing Letters" value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-ink-secondary mb-1.5">Synopsis / Description</label>
                    <textarea
                      className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm resize-none"
                      rows={3} placeholder="Short synopsis..." value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required
                    />
                  </div>
                  <Input label="Genre" placeholder="Drama" value={form.genre}
                    onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))} required />
                  <Input label="Release Year" type="number" placeholder="2024" value={form.releaseYear}
                    onChange={(e) => setForm((p) => ({ ...p, releaseYear: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-brand-orange uppercase tracking-wider">Media URLs</h4>
                <Input label="Poster / Cover (portrait · for cards)" placeholder="Cloudinary portrait URL" value={form.thumbnail}
                  onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))} required />
                <Input label="Hero Banner (landscape · optional)" placeholder="Wide 16:9 banner for homepage hero"
                  value={form.heroImage} onChange={(e) => setForm((p) => ({ ...p, heroImage: e.target.value }))} />
                <p className="text-ink-muted text-xs -mt-2">Use portrait posters for cards and a separate wide banner for the hero section to avoid cropping.</p>
                <Input label="Trailer URL" placeholder="Cloudinary or YouTube trailer URL" value={form.trailerUrl}
                  onChange={(e) => setForm((p) => ({ ...p, trailerUrl: e.target.value }))} required />
                <Input label="Full Movie URL" placeholder="Bunny embed or YouTube Unlisted URL" value={form.fullMovieUrl}
                  onChange={(e) => setForm((p) => ({ ...p, fullMovieUrl: e.target.value }))} />
                <p className="text-ink-muted text-xs -mt-2 leading-relaxed">
                  <strong className="text-ink-secondary">Bunny.net:</strong> paste the link from Stream → video → <em>Play</em> or <em>Embed</em>.
                  Both work, e.g.{' '}
                  <code className="text-brand-orange text-[11px]">player.mediadelivery.net/play/713267/VIDEO_ID</code>
                  <br />
                  <strong className="text-ink-secondary">Poster</strong> = portrait (cards). <strong className="text-ink-secondary">Hero Banner</strong> = wide landscape (homepage).
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-brand-orange uppercase tracking-wider">Cast & Crew</h4>
                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">Cast (one name per line)</label>
                  <textarea
                    className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm resize-none"
                    rows={4} placeholder="Olamide Olayinka&#10;Mercy Aluko&#10;..."
                    value={form.castText} onChange={(e) => setForm((p) => ({ ...p, castText: e.target.value }))}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Written by" value={form.writtenBy} onChange={(e) => setForm((p) => ({ ...p, writtenBy: e.target.value }))} />
                  <Input label="Director" value={form.director} onChange={(e) => setForm((p) => ({ ...p, director: e.target.value }))} />
                  <Input label="Producer" value={form.producer} onChange={(e) => setForm((p) => ({ ...p, producer: e.target.value }))} />
                  <Input label="Continuity" value={form.continuity} onChange={(e) => setForm((p) => ({ ...p, continuity: e.target.value }))} />
                  <Input label="Editor" value={form.editor} onChange={(e) => setForm((p) => ({ ...p, editor: e.target.value }))} />
                  <Input label="Light" value={form.light} onChange={(e) => setForm((p) => ({ ...p, light: e.target.value }))} />
                  <Input label="D.O.P" value={form.dop} onChange={(e) => setForm((p) => ({ ...p, dop: e.target.value }))} />
                  <Input label="Production Manager" value={form.productionManager} onChange={(e) => setForm((p) => ({ ...p, productionManager: e.target.value }))} />
                  <Input label="Sound" value={form.sound} onChange={(e) => setForm((p) => ({ ...p, sound: e.target.value }))} />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((p) => ({ ...p, isPremium: !p.isPremium }))}
                  className={`w-11 h-6 rounded-full transition-all relative ${form.isPremium ? 'bg-brand-orange' : 'bg-cinema-muted'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.isPremium ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-ink-secondary">Premium movie (free users watch trailer only until they subscribe)</span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" loading={submitting} className="flex-1">
                  {editingMovie ? 'Update Movie' : 'Create Movie'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FilmStrip size={28} />} title="No movies yet" description="Add your first movie to get started" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((movie) => (
            <Card key={movie.id} className="flex items-center gap-4">
              <div className="relative w-16 h-24 rounded overflow-hidden flex-shrink-0 bg-cinema-surface">
                <PosterImage src={movie.thumbnail} alt={movie.title} className="absolute inset-0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{movie.title}</h3>
                  {movie.isPremium ? (
                    <Badge variant="orange"><Lock size={10} className="inline mr-1" />Premium</Badge>
                  ) : (
                    <Badge variant="navy"><LockOpen size={10} className="inline mr-1" />Free</Badge>
                  )}
                </div>
                <p className="text-ink-muted text-xs">{movie.genre} · {movie.releaseYear || '—'} · {formatNumber(movie.views)} views</p>
                <p className="text-ink-muted text-xs mt-0.5">Added {formatDate(movie.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(movie)} className="p-2 text-ink-secondary hover:text-brand-orange transition-colors" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(movie.id, movie.title)} className="p-2 text-ink-secondary hover:text-red-400 transition-colors" title="Delete">
                  <Trash size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
