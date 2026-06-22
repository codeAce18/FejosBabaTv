'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, TrendingUp, Printer } from 'lucide-react';
import { studentApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, Badge, Spinner, EmptyState, Select } from '@/components/ui';
import { gradeColor, formatDate } from '@/lib/utils';
import type { Result } from '@/lib/types';

const SESSIONS = [
  { value: '', label: 'All Sessions' },
  { value: '2024/2025', label: '2024/2025' },
  { value: '2023/2024', label: '2023/2024' },
];

const GPA_CLASS = (gpa: number) => {
  if (gpa >= 4.5) return { label: 'First Class Honours', color: 'text-green-400' };
  if (gpa >= 3.5) return { label: 'Second Class Upper', color: 'text-blue-400' };
  if (gpa >= 2.5) return { label: 'Second Class Lower', color: 'text-yellow-400' };
  if (gpa >= 1.5) return { label: 'Third Class', color: 'text-orange-400' };
  if (gpa > 0) return { label: 'Pass', color: 'text-red-400' };
  return { label: 'No results yet', color: 'text-ink-muted' };
};

export default function StudentResultsPage() {
  const [session, setSession] = useState('');
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['student-results', session],
    queryFn: () => studentApi.getResults(session || undefined),
  });

  const results: Result[] = data?.data?.data?.results || [];
  const gpa: number = data?.data?.data?.gpa || 0;
  const totalUnits: number = data?.data?.data?.totalCreditUnits || 0;
  const classification = GPA_CLASS(gpa);

  const handlePrint = () => window.print();

  // Group by semester
  const grouped = results.reduce((acc: Record<string, Result[]>, r) => {
    const key = `${r.session} — ${r.semester} Semester`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">My Results</h2>
          <p className="text-ink-secondary text-sm mt-0.5">
            Academic performance for {user?.name}
          </p>
        </div>
        {results.length > 0 && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-ink-secondary hover:text-white text-sm border border-cinema-border px-3 py-2 rounded-lg transition-all hover:border-cinema-muted"
          >
            <Printer size={14} /> Print
          </button>
        )}
      </div>

      {/* Filter */}
      <Select
        label=""
        options={SESSIONS}
        value={session}
        onChange={e => setSession(e.target.value)}
        className="max-w-xs"
      />

      {/* GPA Summary Card */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-ink-secondary text-xs uppercase tracking-wider mb-1">Cumulative GPA</p>
            <p className="font-display text-4xl font-bold text-brand-orange">{gpa.toFixed(2)}</p>
            <p className={`text-xs mt-1 font-medium ${classification.color}`}>{classification.label}</p>
          </Card>
          <Card className="text-center">
            <p className="text-ink-secondary text-xs uppercase tracking-wider mb-1">Total Credit Units</p>
            <p className="font-display text-4xl font-bold text-white">{totalUnits}</p>
            <p className="text-ink-muted text-xs mt-1">Units earned</p>
          </Card>
          <Card className="text-center">
            <p className="text-ink-secondary text-xs uppercase tracking-wider mb-1">Courses Taken</p>
            <p className="font-display text-4xl font-bold text-white">{results.length}</p>
            <p className="text-ink-muted text-xs mt-1">Total courses</p>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : results.length === 0 ? (
        <EmptyState icon={<FileText size={28} />} title="No results yet"
          description="Your results will appear here once uploaded by your admin" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([semester, semResults]) => {
            const semUnits = semResults.reduce((a, r) => a + (r.course?.creditUnits || 0), 0);
            return (
              <div key={semester}>
                <h3 className="font-display text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-orange" />
                  {semester}
                </h3>
                <Card className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cinema-border">
                        {['Course Code', 'Course Name', 'Units', 'Score', 'Grade'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wider px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cinema-border">
                      {semResults.map(result => (
                        <tr key={result.id} className="hover:bg-cinema-elevated transition-colors">
                          <td className="px-5 py-3">
                            <span className="font-display font-bold text-brand-orange">{result.course?.code}</span>
                          </td>
                          <td className="px-5 py-3 text-white text-sm">{result.course?.name}</td>
                          <td className="px-5 py-3 text-ink-secondary text-sm">{result.course?.creditUnits}</td>
                          <td className="px-5 py-3 text-white font-medium">{result.score}</td>
                          <td className="px-5 py-3">
                            <span className={`font-display text-2xl font-bold ${gradeColor(result.grade)}`}>
                              {result.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-cinema-border bg-cinema-elevated">
                        <td colSpan={2} className="px-5 py-2 text-ink-secondary text-xs font-semibold">
                          Semester Total
                        </td>
                        <td className="px-5 py-2 text-white text-sm font-bold">{semUnits}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}