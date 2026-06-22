'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Film, Eye, Lock, Unlock, Search } from 'lucide-react';
import { adminApi, moviesApi, getErrorMessage } from '@/lib/api';
import { Button, Input, Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatDate, formatNumber } from '@/lib/utils';
import type { Movie } from '@/lib/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface MovieForm {
  title: string; description: string; genre: string;
  thumbnail: string; trailerUrl: string; fullMovieUrl: string;
  isPremium: boolean; releaseYear: string;
}

const EMPTY_FORM: MovieForm = {
  title: '', description: '', genre: '', thumbnail: '',
  trailerUrl: '', fullMovieUrl: '', isPremium: false, releaseYear: '',
};

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
  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

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
    setEditingMovie(movie);
    setForm({
      title: movie.title, description: movie.description,
      genre: movie.genre, thumbnail: movie.thumbnail,
      trailerUrl: movie.trailerUrl, fullMovieUrl: movie.fullMovieUrl || '',
      isPremium: movie.isPremium, releaseYear: movie.releaseYear?.toString() || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      releaseYear: form.releaseYear ? parseInt(form.releaseYear) : undefined,
      fullMovieUrl: form.fullMovieUrl || undefined,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Movies</h2>
          <p className="text-ink-secondary text-sm mt-0.5">{movies.length} movies total</p>
        </div>
        <Button onClick={openCreate} size="md">
          <Plus size={16} /> Add Movie
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search movies..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={<Search size={16} />}
        className="max-w-sm"
      />

      {/* Movie Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-white transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Movie Title" placeholder="The Lagos Chronicles" value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">Description</label>
                  <textarea
                    className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm resize-none"
                    rows={3} placeholder="Movie description..." value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required
                  />
                </div>
                <div>
                  <Input label="Genre" placeholder="Drama, Action, Comedy..." value={form.genre}
                    onChange={e => setForm(p => ({ ...p, genre: e.target.value }))} required />
                </div>
                <div>
                  <Input label="Release Year" type="number" placeholder="2024" value={form.releaseYear}
                    onChange={e => setForm(p => ({ ...p, releaseYear: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Thumbnail URL (Cloudinary)" placeholder="https://res.cloudinary.com/..." value={form.thumbnail}
                    onChange={e => setForm(p => ({ ...p, thumbnail: e.target.value }))} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Trailer URL (Cloudinary)" placeholder="https://res.cloudinary.com/..." value={form.trailerUrl}
                    onChange={e => setForm(p => ({ ...p, trailerUrl: e.target.value }))} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Full Movie URL (required for premium)" placeholder="https://res.cloudinary.com/..." value={form.fullMovieUrl}
                    onChange={e => setForm(p => ({ ...p, fullMovieUrl: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm(p => ({ ...p, isPremium: !p.isPremium }))}
                      className={`w-11 h-6 rounded-full transition-all relative ${form.isPremium ? 'bg-brand-orange' : 'bg-cinema-muted'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.isPremium ? 'left-5' : 'left-0.5'}`} />
                    </div>
                    <span className="text-sm text-ink-secondary">Premium movie (requires payment to watch)</span>
                  </label>
                </div>
              </div>
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

      {/* Movies List */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Film size={28} />} title="No movies yet" description="Add your first movie to get started" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((movie) => (
            <Card key={movie.id} className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-cinema-border">
                <Image src={movie.thumbnail} alt={movie.title} fill className="object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-white font-semibold text-sm truncate">{movie.title}</h4>
                  {movie.isPremium && <Badge variant="orange">Premium</Badge>}
                  <Badge variant="gray">{movie.genre}</Badge>
                  {movie.releaseYear && <Badge variant="gray">{movie.releaseYear}</Badge>}
                </div>
                <p className="text-ink-secondary text-xs line-clamp-2 mb-2">{movie.description}</p>
                <div className="flex items-center gap-3 text-ink-muted text-xs">
                  <span className="flex items-center gap-1"><Eye size={11} />{formatNumber(movie.views)} views</span>
                  <span>Added {formatDate(movie.createdAt)}</span>
                  {movie.fullMovieUrl ? (
                    <span className="flex items-center gap-1 text-green-400"><Unlock size={11} />Full movie linked</span>
                  ) : (
                    <span className="flex items-center gap-1 text-ink-muted"><Lock size={11} />No full movie</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="secondary" size="sm" onClick={() => openEdit(movie)}>
                  <Pencil size={13} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(movie.id, movie.title)}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}