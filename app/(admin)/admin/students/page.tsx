'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Users, Search, Eye } from 'lucide-react';
import { adminApi, getErrorMessage } from '@/lib/api';
import { Button, Input, Card, Badge, Spinner, EmptyState, Select } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  { value: '', label: 'Select Department' },
  { value: 'Film Production', label: 'Film Production' },
  { value: 'Cinematography', label: 'Cinematography' },
  { value: 'Film Editing', label: 'Film Editing' },
  { value: 'Screenwriting', label: 'Screenwriting' },
  { value: 'Directing', label: 'Directing' },
  { value: 'Sound Production', label: 'Sound Production' },
  { value: 'Acting', label: 'Acting' },
];

const LEVELS = [
  { value: '', label: 'Select Level' },
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level' },
  { value: '400', label: '400 Level' },
];

const EMPTY_FORM = {
  name: '', email: '', password: 'Student@2024',
  admissionNumber: '', department: '', level: '', phone: '',
};

export default function AdminStudentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: () => adminApi.getStudents(),
  });

  const students = data?.data?.data || [];
  const filtered = students.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.studentProfile?.admissionNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast.success('Student removed');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.createStudent(form);
      toast.success(`Student created! Default password: ${form.admissionNumber}`);
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      setShowForm(false);
      setForm(EMPTY_FORM);
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
          <h2 className="font-display text-2xl font-bold text-white">Students</h2>
          <p className="text-ink-secondary text-sm mt-0.5">{students.length} enrolled students</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Student
        </Button>
      </div>

      <Input placeholder="Search by name, email, or admission number..." value={search}
        onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} className="max-w-sm" />

      {/* Add Student Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">Add New Student</h3>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" placeholder="Student full name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              <Input label="Email" type="email" placeholder="student@email.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              <Input label="Admission Number" placeholder="FA/2024/001" value={form.admissionNumber}
                onChange={e => setForm(p => ({ ...p, admissionNumber: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Department" options={DEPARTMENTS} value={form.department}
                  onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
                <Select label="Level" options={LEVELS} value={form.level}
                  onChange={e => setForm(p => ({ ...p, level: e.target.value }))} />
              </div>
              <Input label="Phone (optional)" placeholder="08012345678" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              <div className="bg-cinema-elevated border border-cinema-border rounded-lg p-3 text-xs text-ink-secondary">
                <p className="text-white font-medium mb-0.5">Default Password</p>
                <p>Student&apos;s default password will be their admission number. They should change it after first login.</p>
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="submit" loading={submitting} className="flex-1">Create Student</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Students Table */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No students yet" description="Add your first student to get started" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cinema-border">
                {['Student', 'Admission No.', 'Department', 'Level', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border">
              {filtered.map((student: any) => (
                <tr key={student.id} className="hover:bg-cinema-elevated transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-navy/30 border border-brand-navy/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 text-xs font-bold">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{student.name}</p>
                        <p className="text-ink-muted text-xs">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-ink-secondary">{student.studentProfile?.admissionNumber || '—'}</td>
                  <td className="px-5 py-3 text-sm text-ink-secondary">{student.studentProfile?.department || '—'}</td>
                  <td className="px-5 py-3">
                    <Badge variant="navy">{student.studentProfile?.level ? `${student.studentProfile.level} Level` : '—'}</Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-muted">{formatDate(student.createdAt)}</td>
                  <td className="px-5 py-3">
                    <Button variant="danger" size="sm"
                      onClick={() => confirm(`Remove ${student.name}?`) && deleteMutation.mutate(student.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}