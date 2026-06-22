'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, BookOpen, Search } from 'lucide-react';
import { adminApi, getErrorMessage } from '@/lib/api';
import { Button, Input, Card, Badge, Spinner, EmptyState, Select } from '@/components/ui';
import type { Course } from '@/lib/types';
import toast from 'react-hot-toast';

const LEVELS = [
  { value: '', label: 'All Levels' },
  ...['100','200','300','400'].map(l => ({ value: l, label: `${l} Level` })),
];
const SEMESTERS = [
  { value: '', label: 'Select Semester' },
  { value: 'First', label: 'First Semester' },
  { value: 'Second', label: 'Second Semester' },
];

const EMPTY: Partial<Course> = { name: '', code: '', description: '', creditUnits: 3, semester: 'First', level: '100' };

export default function AdminCoursesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => adminApi.getCourses(),
  });

  const courses: Course[] = data?.data?.data || [];
  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course deleted');
    },
    onError: e => toast.error(getErrorMessage(e)),
  });

  const openEdit = (course: Course) => {
    setEditing(course);
    setForm({ ...course });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await adminApi.updateCourse(editing.id, form);
        toast.success('Course updated!');
      } else {
        await adminApi.createCourse({ ...form, creditUnits: Number(form.creditUnits) });
        toast.success('Course created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setShowForm(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Courses</h2>
          <p className="text-ink-secondary text-sm mt-0.5">{courses.length} courses available</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Course</Button>
      </div>

      <Input placeholder="Search by name or code..." value={search}
        onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} className="max-w-sm" />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">{editing ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Course Name" placeholder="Introduction to Film Production" value={form.name}
                onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} required />
              <Input label="Course Code" placeholder="FP101" value={form.code}
                onChange={e => setForm((p: any) => ({ ...p, code: e.target.value.toUpperCase() }))} required />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Level" options={LEVELS.slice(1)} value={form.level}
                  onChange={e => setForm((p: any) => ({ ...p, level: e.target.value }))} />
                <Select label="Semester" options={SEMESTERS.slice(1)} value={form.semester}
                  onChange={e => setForm((p: any) => ({ ...p, semester: e.target.value }))} />
              </div>
              <Input label="Credit Units" type="number" min={1} max={6} value={form.creditUnits}
                onChange={e => setForm((p: any) => ({ ...p, creditUnits: e.target.value }))} required />
              <div>
                <label className="block text-sm font-medium text-ink-secondary mb-1.5">Description (optional)</label>
                <textarea className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm resize-none"
                  rows={2} value={form.description}
                  onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={submitting} className="flex-1">{editing ? 'Update' : 'Create'} Course</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<BookOpen size={28} />} title="No courses yet" description="Add courses for students to register" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => (
            <Card key={course.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-navy/30 border border-brand-navy/40 flex items-center justify-center">
                    <BookOpen size={14} className="text-blue-400" />
                  </div>
                  <span className="font-display text-sm font-bold text-brand-orange">{course.code}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(course)}><Pencil size={12} /></Button>
                  <Button variant="danger" size="sm"
                    onClick={() => confirm(`Delete ${course.name}?`) && deleteMutation.mutate(course.id)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">{course.name}</h4>
                {course.description && <p className="text-ink-secondary text-xs line-clamp-2">{course.description}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="navy">{course.level} Level</Badge>
                <Badge variant="gray">{course.semester} Sem</Badge>
                <Badge variant="gray">{course.creditUnits} Units</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}