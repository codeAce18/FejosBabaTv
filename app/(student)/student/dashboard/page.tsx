'use client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, ClipboardList, TrendingUp, GraduationCap } from 'lucide-react';
import { studentApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, StatCard, Spinner, Badge } from '@/components/ui';
import { formatDate, gradeColor } from '@/lib/utils';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const { data: resultsData, isLoading: loadingResults } = useQuery({
    queryKey: ['student-results'],
    queryFn: () => studentApi.getResults(),
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ['student-enrollments'],
    queryFn: () => studentApi.getEnrollments(),
  });

  const { data: examsData } = useQuery({
    queryKey: ['student-exams'],
    queryFn: () => studentApi.getExams(),
  });

  const results = resultsData?.data?.data?.results || [];
  const gpa = resultsData?.data?.data?.gpa || 0;
  const enrollments = enrollmentsData?.data?.data || [];
  const exams = examsData?.data?.data || [];

  const profile = user?.studentProfile;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-navy-gradient border border-brand-navy/40 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={28} className="text-white" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-blue-200 text-sm">
            {profile?.department} · {profile?.level} Level · {profile?.admissionNumber}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Enrolled Courses" value={enrollments.length} icon={<BookOpen size={20} />} />
        <StatCard label="Results Available" value={results.length} icon={<FileText size={20} />} />
        <StatCard label="Active Exams" value={exams.length} icon={<ClipboardList size={20} />} />
        <StatCard label="Current GPA" value={gpa.toFixed(2)} icon={<TrendingUp size={20} />}
          trend={gpa >= 4.5 ? '⭐ First Class' : gpa >= 3.5 ? '✅ Second Class Upper' : gpa > 0 ? '' : 'No results yet'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">Recent Results</h3>
            <Link href="/student/results" className="text-brand-orange text-xs hover:underline">View all</Link>
          </div>
          {loadingResults ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : results.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No results uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {results.slice(0, 5).map((result: any) => (
                <div key={result.id} className="flex items-center justify-between py-2 border-b border-cinema-border last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{result.course?.code}</p>
                    <p className="text-ink-muted text-xs">{result.course?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-xl font-bold ${gradeColor(result.grade)}`}>{result.grade}</p>
                    <p className="text-ink-muted text-xs">{result.score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Exams */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">Active Exams</h3>
            <Link href="/student/exams" className="text-brand-orange text-xs hover:underline">View all</Link>
          </div>
          {exams.length === 0 ? (
            <p className="text-ink-muted text-sm text-center py-8">No active exams right now</p>
          ) : (
            <div className="space-y-3">
              {exams.map((exam: any) => (
                <div key={exam.id} className="p-3 rounded-xl bg-cinema-elevated border border-cinema-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-semibold">{exam.title}</p>
                      <p className="text-ink-muted text-xs">{exam.course?.code} · {exam.duration} mins</p>
                    </div>
                    <Badge variant="green">Live</Badge>
                  </div>
                  <Link href="/student/exams"
                    className="text-xs text-brand-orange hover:underline font-medium">
                    Take exam →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* My Courses */}
      {enrollments.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">Enrolled Courses</h3>
            <Link href="/student/courses" className="text-brand-orange text-xs hover:underline">Manage</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enrollments.map((enr: any) => (
              <div key={enr.id} className="p-3 rounded-xl bg-cinema-elevated border border-cinema-border">
                <span className="text-brand-orange font-display text-sm font-bold">{enr.course?.code}</span>
                <p className="text-white text-xs mt-0.5 font-medium">{enr.course?.name}</p>
                <p className="text-ink-muted text-xs mt-1">{enr.course?.creditUnits} units · {enr.semester}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}