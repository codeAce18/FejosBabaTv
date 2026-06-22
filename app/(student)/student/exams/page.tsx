'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { studentApi, getErrorMessage } from '@/lib/api';
import { Button, Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Exam, Question, ExamAttempt } from '@/lib/types';
import toast from 'react-hot-toast';

type AnswerMap = Record<string, 'A' | 'B' | 'C' | 'D'>;

export default function StudentExamsPage() {
  const [activeExam, setActiveExam] = useState<{ exam: any; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<any>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: examsData, isLoading } = useQuery({
    queryKey: ['student-exams'],
    queryFn: () => studentApi.getExams(),
  });

  const { data: historyData } = useQuery({
    queryKey: ['student-exam-history'],
    queryFn: () => studentApi.getExamHistory(),
  });

  const exams: Exam[] = examsData?.data?.data || [];
  const history: ExamAttempt[] = historyData?.data?.data || [];

  const handleStartExam = async (examId: string) => {
    setStarting(examId);
    try {
      const res = await studentApi.startExam(examId);
      const data = res.data.data;
      setActiveExam({ exam: data, questions: data.questions });
      setAnswers({});
      setResult(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setStarting(null);
    }
  };

  const handleSubmit = async () => {
    if (!activeExam) return;
    const unanswered = activeExam.questions.filter((q: Question) => !answers[q.id]);
    if (unanswered.length > 0) {
      const proceed = confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`);
      if (!proceed) return;
    }

    setSubmitting(true);
    try {
      const res = await studentApi.submitExam(activeExam.exam.examId, { answers });
      setResult(res.data.data);
      setActiveExam(null);
      queryClient.invalidateQueries({ queryKey: ['student-exam-history'] });
      toast.success('Exam submitted successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const setAnswer = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(p => ({ ...p, [questionId]: answer }));
  };

  // ─── Active Exam UI ───
  if (activeExam) {
    const { questions } = activeExam;
    const answered = Object.keys(answers).length;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Exam Header */}
        <div className="sticky top-16 z-20 bg-cinema-black pb-4">
          <Card className="border-brand-orange/30">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{activeExam.exam.title}</h2>
                <p className="text-ink-secondary text-sm">{questions.length} questions · {activeExam.exam.duration} minutes</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-brand-orange font-bold text-lg">{answered}/{questions.length}</p>
                  <p className="text-ink-muted text-xs">Answered</p>
                </div>
                <Button onClick={handleSubmit} loading={submitting} size="md">
                  <CheckCircle size={16} /> Submit Exam
                </Button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-cinema-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange rounded-full transition-all"
                style={{ width: `${(answered / questions.length) * 100}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q: Question, idx: number) => (
            <Card key={q.id} className={`transition-all ${answers[q.id] ? 'border-brand-orange/30' : 'border-cinema-border'}`}>
              <div className="flex items-start gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-cinema-elevated border border-cinema-border flex items-center justify-center text-xs font-bold text-ink-secondary flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-white text-sm leading-relaxed">{q.question}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-10">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const optText = q[`option${opt}` as keyof Question] as string;
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswer(q.id, opt)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all border ${
                        selected
                          ? 'border-brand-orange bg-brand-orange/15 text-white'
                          : 'border-cinema-border bg-cinema-elevated hover:border-cinema-muted text-ink-secondary hover:text-white'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                        selected ? 'border-brand-orange bg-brand-orange text-white' : 'border-cinema-muted'
                      }`}>
                        {opt}
                      </span>
                      <span className="text-sm">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={handleSubmit} loading={submitting} size="lg" className="w-full">
          <CheckCircle size={18} /> Submit Exam ({answered}/{questions.length} answered)
        </Button>
      </div>
    );
  }

  // ─── Result Screen ───
  if (result) {
    const percentage = (result.score / result.totalMarks) * 100;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center border-green-500/30">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">Exam Submitted!</h2>
          <p className="text-ink-secondary text-sm mb-6">Your answers have been recorded and graded</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div><p className="text-ink-muted text-xs">Score</p><p className="font-display text-2xl font-bold text-brand-orange">{result.score}</p></div>
            <div><p className="text-ink-muted text-xs">Total</p><p className="font-display text-2xl font-bold text-white">{result.totalMarks}</p></div>
            <div><p className="text-ink-muted text-xs">Correct</p><p className="font-display text-2xl font-bold text-green-400">{result.correctAnswers}/{result.totalQuestions}</p></div>
          </div>
          <div className="h-3 bg-cinema-elevated rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${percentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
          </div>
          <p className="text-ink-secondary text-sm mb-6">{percentage.toFixed(1)}% scored</p>
          <Button onClick={() => setResult(null)} className="w-full">← Back to Exams</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Exams</h2>
        <p className="text-ink-secondary text-sm mt-0.5">Take available exams for your enrolled courses</p>
      </div>

      {/* Available Exams */}
      <div>
        <h3 className="font-display text-base font-semibold text-white mb-3">Available Now</h3>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size={32} /></div>
        ) : exams.length === 0 ? (
          <EmptyState icon={<ClipboardList size={28} />} title="No active exams"
            description="Active exams will appear here. Make sure you have registered for the relevant courses." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((exam: any) => (
              <Card key={exam.id} className="border-green-500/20 bg-green-500/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <Badge variant="green">Live</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-ink-muted text-xs">
                    <Clock size={12} /> {exam.duration} min
                  </div>
                </div>
                <h4 className="text-white font-semibold mb-1">{exam.title}</h4>
                <p className="text-ink-secondary text-sm mb-1">{exam.course?.code} — {exam.course?.name}</p>
                <p className="text-ink-muted text-xs mb-4">{exam._count?.questions || 0} questions · {exam.totalMarks} marks</p>
                <Button
                  size="sm"
                  className="w-full"
                  loading={starting === exam.id}
                  onClick={() => handleStartExam(exam.id)}
                >
                  <Play size={14} /> Start Exam
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Exam History */}
      {history.length > 0 && (
        <div>
          <h3 className="font-display text-base font-semibold text-white mb-3">Exam History</h3>
          <Card className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cinema-border">
                  {['Exam', 'Course', 'Score', 'Submitted'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border">
                {history.map((attempt: ExamAttempt) => {
                  const pct = attempt.score !== undefined && attempt.exam?.totalMarks
                    ? ((attempt.score / attempt.exam.totalMarks) * 100).toFixed(1)
                    : null;
                  return (
                    <tr key={attempt.id} className="hover:bg-cinema-elevated transition-colors">
                      <td className="px-5 py-3 text-white text-sm font-medium">{attempt.exam?.title}</td>
                      <td className="px-5 py-3 text-ink-secondary text-sm">{attempt.exam?.course?.code}</td>
                      <td className="px-5 py-3">
                        <span className={`font-bold ${pct && parseFloat(pct) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                          {attempt.score ?? '—'}/{attempt.exam?.totalMarks}
                          {pct && <span className="text-xs font-normal ml-1 text-ink-muted">({pct}%)</span>}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink-muted text-xs">
                        {attempt.submittedAt ? formatDate(attempt.submittedAt) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}