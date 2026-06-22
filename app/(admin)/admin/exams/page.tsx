'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ClipboardList, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import { adminApi, getErrorMessage } from '@/lib/api';
import { Button, Card, Badge, Spinner, EmptyState, Select, Input } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminExamsPage() {
  const [showExamForm, setShowExamForm] = useState(false);
  const [showQForm, setShowQForm] = useState<string | null>(null);
  const [examForm, setExamForm] = useState({ title: '', courseId: '', duration: 60, totalMarks: 100, startTime: '', endTime: '' });
  const [questions, setQuestions] = useState([{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: examsData, isLoading } = useQuery({ queryKey: ['admin-exams'], queryFn: () => adminApi.getExams() });
  const { data: coursesData } = useQuery({ queryKey: ['admin-courses'], queryFn: () => adminApi.getCourses() });

  const exams = examsData?.data?.data || [];
  const courses = coursesData?.data?.data || [];

  const courseOptions = [
    { value: '', label: 'Select Course' },
    ...courses.map((c: any) => ({ value: c.id, label: `${c.code} — ${c.name}` })),
  ];

  const toggleMutation = useMutation({
    mutationFn: (examId: string) => adminApi.toggleExam(examId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-exams'] }),
    onError: e => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
      toast.success('Exam deleted');
    },
    onError: e => toast.error(getErrorMessage(e)),
  });

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.createExam({
        ...examForm,
        duration: Number(examForm.duration),
        totalMarks: Number(examForm.totalMarks),
        startTime: new Date(examForm.startTime).toISOString(),
        endTime: new Date(examForm.endTime).toISOString(),
      });
      toast.success('Exam created! Now add questions.');
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
      setShowExamForm(false);
      setExamForm({ title: '', courseId: '', duration: 60, totalMarks: 100, startTime: '', endTime: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => setQuestions(p => [...p, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
  const removeQuestion = (i: number) => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, field: string, value: string) => {
    setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };

  const handleAddQuestions = async (examId: string) => {
    setSubmitting(true);
    try {
      await adminApi.addQuestions(examId, { questions });
      toast.success(`${questions.length} question(s) added!`);
      setShowQForm(null);
      setQuestions([{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
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
          <h2 className="font-display text-2xl font-bold text-white">Exams</h2>
          <p className="text-ink-secondary text-sm mt-0.5">{exams.length} exams created</p>
        </div>
        <Button onClick={() => setShowExamForm(true)}><Plus size={16} /> Create Exam</Button>
      </div>

      {/* Exam Form Modal */}
      {showExamForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">Create Exam</h3>
              <button onClick={() => setShowExamForm(false)} className="text-ink-muted hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <Input label="Exam Title" placeholder="FP101 First Semester Exam" value={examForm.title}
                onChange={e => setExamForm(p => ({ ...p, title: e.target.value }))} required />
              <Select label="Course" options={courseOptions} value={examForm.courseId}
                onChange={e => setExamForm(p => ({ ...p, courseId: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Duration (mins)" type="number" value={examForm.duration}
                  onChange={e => setExamForm(p => ({ ...p, duration: Number(e.target.value) }))} />
                <Input label="Total Marks" type="number" value={examForm.totalMarks}
                  onChange={e => setExamForm(p => ({ ...p, totalMarks: Number(e.target.value) }))} />
              </div>
              <Input label="Start Time" type="datetime-local" value={examForm.startTime}
                onChange={e => setExamForm(p => ({ ...p, startTime: e.target.value }))} required />
              <Input label="End Time" type="datetime-local" value={examForm.endTime}
                onChange={e => setExamForm(p => ({ ...p, endTime: e.target.value }))} required />
              <div className="flex gap-3">
                <Button type="submit" loading={submitting} className="flex-1">Create Exam</Button>
                <Button type="button" variant="secondary" onClick={() => setShowExamForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Exams List */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : exams.length === 0 ? (
        <EmptyState icon={<ClipboardList size={28} />} title="No exams yet" description="Create an exam and add questions" />
      ) : (
        <div className="space-y-4">
          {exams.map((exam: any) => (
            <Card key={exam.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold">{exam.title}</h4>
                    <Badge variant={exam.isActive ? 'green' : 'gray'}>{exam.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="text-ink-secondary text-sm">{exam.course?.name} · {exam.duration} mins · {exam.totalMarks} marks</p>
                  <p className="text-ink-muted text-xs mt-1">
                    {exam._count?.questions || 0} questions · {exam._count?.examAttempts || 0} attempts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => toggleMutation.mutate(exam.id)}>
                    {exam.isActive ? <ToggleRight size={14} className="text-green-400" /> : <ToggleLeft size={14} />}
                    {exam.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowQForm(showQForm === exam.id ? null : exam.id)}>
                    <Plus size={14} /> Questions
                  </Button>
                  <Button variant="danger" size="sm"
                    onClick={() => confirm('Delete this exam?') && deleteMutation.mutate(exam.id)}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>

              {/* Add Questions Panel */}
              {showQForm === exam.id && (
                <div className="mt-4 pt-4 border-t border-cinema-border space-y-4">
                  <h5 className="text-sm font-semibold text-white">Add Questions</h5>
                  {questions.map((q, i) => (
                    <div key={i} className="bg-cinema-elevated border border-cinema-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-brand-orange">Question {i + 1}</span>
                        {questions.length > 1 && (
                          <button onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                        )}
                      </div>
                      <textarea className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white px-3 py-2 text-sm resize-none focus:outline-none focus:border-brand-orange"
                        rows={2} placeholder="Enter question..." value={q.question}
                        onChange={e => updateQuestion(i, 'question', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map(opt => (
                          <div key={opt} className={`flex items-center gap-2 bg-cinema-surface border rounded-lg px-3 py-2 ${q.correctAnswer === opt ? 'border-green-500/50 bg-green-500/5' : 'border-cinema-border'}`}>
                            <span className={`text-xs font-bold ${q.correctAnswer === opt ? 'text-green-400' : 'text-ink-muted'}`}>{opt}.</span>
                            <input className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-ink-muted"
                              placeholder={`Option ${opt}`} value={(q as any)[`option${opt}`]}
                              onChange={e => updateQuestion(i, `option${opt}`, e.target.value)} />
                            <input type="radio" name={`correct-${i}`} value={opt} checked={q.correctAnswer === opt}
                              onChange={() => updateQuestion(i, 'correctAnswer', opt)} className="accent-green-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={addQuestion}><Plus size={14} /> Add Another</Button>
                    <Button size="sm" loading={submitting} onClick={() => handleAddQuestions(exam.id)}>
                      Save {questions.length} Question(s)
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}