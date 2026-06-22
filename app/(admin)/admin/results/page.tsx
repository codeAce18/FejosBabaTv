'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { adminApi, getErrorMessage } from '@/lib/api';
import { Button, Card, Select, Spinner } from '@/components/ui';
import { gradeColor } from '@/lib/utils';
import toast from 'react-hot-toast';

const SESSIONS = ['2024/2025', '2023/2024', '2022/2023'].map(s => ({ value: s, label: s }));
const SEMESTERS = [{ value: 'First', label: 'First Semester' }, { value: 'Second', label: 'Second Semester' }];

export default function AdminResultsPage() {
  const [form, setForm] = useState({ studentId: '', courseId: '', score: '', session: '2024/2025', semester: 'First' });
  const [submitting, setSubmitting] = useState(false);
  const [lastUploaded, setLastUploaded] = useState<any>(null);

  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['admin-students'],
    queryFn: () => adminApi.getStudents(),
  });

  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => adminApi.getCourses(),
  });

  const students = studentsData?.data?.data || [];
  const courses = coursesData?.data?.data || [];

  const studentOptions = [
    { value: '', label: 'Select Student' },
    ...students.map((s: any) => ({
      value: s.studentProfile?.id || '',
      label: `${s.name} — ${s.studentProfile?.admissionNumber || ''}`,
    })),
  ];

  const courseOptions = [
    { value: '', label: 'Select Course' },
    ...courses.map((c: any) => ({ value: c.id, label: `${c.code} — ${c.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId || !form.score) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await adminApi.uploadResult({
        ...form,
        score: parseFloat(form.score),
      });
      setLastUploaded(res.data.data);
      toast.success('Result uploaded successfully!');
      setForm(p => ({ ...p, score: '' }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 45) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Upload Results</h2>
        <p className="text-ink-secondary text-sm mt-0.5">Enter a student&apos;s score for a course</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
            <Upload size={16} className="text-brand-orange" />
          </div>
          <h3 className="font-display text-base font-semibold text-white">Result Entry Form</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Student"
            options={studentOptions}
            value={form.studentId}
            onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))}
          />

          <Select
            label="Course"
            options={courseOptions}
            value={form.courseId}
            onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Session"
              options={SESSIONS}
              value={form.session}
              onChange={e => setForm(p => ({ ...p, session: e.target.value }))}
            />
            <Select
              label="Semester"
              options={SEMESTERS}
              value={form.semester}
              onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1.5">Score (0 — 100)</label>
            <div className="flex items-center gap-4">
              <input
                type="number" min={0} max={100} step={0.5}
                placeholder="e.g. 75.5"
                value={form.score}
                onChange={e => setForm(p => ({ ...p, score: e.target.value }))}
                className="flex-1 bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm"
              />
              {form.score && (
                <div className="text-center">
                  <p className={`font-display text-2xl font-bold ${gradeColor(getGrade(parseFloat(form.score)))}`}>
                    {getGrade(parseFloat(form.score))}
                  </p>
                  <p className="text-ink-muted text-xs">Grade</p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" loading={submitting} size="lg" className="w-full">
            <Upload size={16} />
            Upload Result
          </Button>
        </form>
      </Card>

      {/* Grade Reference */}
      <Card>
        <h4 className="text-sm font-semibold text-ink-secondary mb-3 uppercase tracking-wider">Grading Scale</h4>
        <div className="grid grid-cols-5 gap-2">
          {[
            { range: '70–100', grade: 'A', label: 'Excellent', color: 'text-green-400' },
            { range: '60–69', grade: 'B', label: 'Good', color: 'text-blue-400' },
            { range: '50–59', grade: 'C', label: 'Fair', color: 'text-yellow-400' },
            { range: '45–49', grade: 'D', label: 'Pass', color: 'text-orange-400' },
            { range: '0–44', grade: 'F', label: 'Fail', color: 'text-red-400' },
          ].map(item => (
            <div key={item.grade} className="text-center p-2 rounded-lg bg-cinema-elevated border border-cinema-border">
              <p className={`font-display text-xl font-bold ${item.color}`}>{item.grade}</p>
              <p className="text-ink-muted text-xs">{item.range}</p>
              <p className="text-ink-secondary text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Last uploaded */}
      {lastUploaded && (
        <Card className="border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-400" />
            <h4 className="text-green-400 font-semibold text-sm">Last Uploaded</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><p className="text-ink-muted text-xs">Score</p><p className="text-white font-bold">{lastUploaded.score}</p></div>
            <div><p className="text-ink-muted text-xs">Grade</p><p className={`font-bold ${gradeColor(lastUploaded.grade)}`}>{lastUploaded.grade}</p></div>
            <div><p className="text-ink-muted text-xs">Session</p><p className="text-white">{lastUploaded.session}</p></div>
          </div>
        </Card>
      )}
    </div>
  );
}