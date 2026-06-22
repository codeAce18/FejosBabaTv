'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, CheckCircle, Search } from 'lucide-react';
import { studentApi, getErrorMessage } from '@/lib/api';
import { Button, Card, Badge, Spinner, EmptyState, Select } from '@/components/ui';
import type { Course, Enrollment } from '@/lib/types';
import toast from 'react-hot-toast';

const SESSIONS = ['2024/2025', '2023/2024'].map(s => ({ value: s, label: s }));
const SEMESTERS = [
  { value: 'First', label: 'First Semester' },
  { value: 'Second', label: 'Second Semester' },
];

export default function StudentCoursesPage() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [session, setSession] = useState('2024/2025');
  const [semester, setSemester] = useState('First');
  const [registering, setRegistering] = useState(false);
  const queryClient = useQueryClient();

  const { data: availableData, isLoading: loadingAvailable } = useQuery({
    queryKey: ['student-available-courses'],
    queryFn: () => studentApi.getCourses(),
  });

  const { data: enrolledData, isLoading: loadingEnrolled } = useQuery({
    queryKey: ['student-enrollments'],
    queryFn: () => studentApi.getEnrollments(),
  });

  const available: Course[] = availableData?.data?.data || [];
  const enrolled: Enrollment[] = enrolledData?.data?.data || [];
  const enrolledIds = enrolled.map(e => e.courseId);

  const toggleCourse = (id: string) => {
    setSelectedCourses(p =>
      p.includes(id) ? p.filter(c => c !== id) : [...p, id]
    );
  };

  const handleRegister = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Select at least one course');
      return;
    }
    setRegistering(true);
    try {
      await studentApi.registerCourses({ courseIds: selectedCourses, session, semester });
      toast.success(`Registered for ${selectedCourses.length} course(s)!`);
      setSelectedCourses([]);
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">My Courses</h2>
        <p className="text-ink-secondary text-sm mt-0.5">
          Browse available courses and register for the semester
        </p>
      </div>

      {/* Registration Settings */}
      <Card>
        <h3 className="font-display text-base font-semibold text-white mb-4">Course Registration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Select label="Academic Session" options={SESSIONS} value={session}
            onChange={e => setSession(e.target.value)} />
          <Select label="Semester" options={SEMESTERS} value={semester}
            onChange={e => setSemester(e.target.value)} />
        </div>
        {selectedCourses.length > 0 && (
          <div className="flex items-center justify-between bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-4 py-3">
            <p className="text-brand-orange text-sm font-medium">
              {selectedCourses.length} course(s) selected
            </p>
            <Button size="sm" loading={registering} onClick={handleRegister}>
              <Plus size={14} /> Register Selected
            </Button>
          </div>
        )}
      </Card>

      {/* Available Courses */}
      <div>
        <h3 className="font-display text-base font-semibold text-white mb-3">
          Available Courses for Your Level
        </h3>
        {loadingAvailable ? (
          <div className="flex justify-center py-12"><Spinner size={32} /></div>
        ) : available.length === 0 ? (
          <EmptyState icon={<BookOpen size={28} />} title="No courses available"
            description="Courses for your level will appear here once added by admin" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map(course => {
              const isEnrolled = enrolledIds.includes(course.id);
              const isSelected = selectedCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => !isEnrolled && toggleCourse(course.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isEnrolled
                      ? 'border-green-500/30 bg-green-500/5 cursor-default'
                      : isSelected
                      ? 'border-brand-orange bg-brand-orange/10 shadow-orange-glow-sm'
                      : 'border-cinema-border bg-cinema-surface hover:border-cinema-muted'
                  }`}
                >
                  {/* Selection indicator */}
                  <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isEnrolled
                      ? 'border-green-500 bg-green-500'
                      : isSelected
                      ? 'border-brand-orange bg-brand-orange'
                      : 'border-cinema-muted'
                  }`}>
                    {(isEnrolled || isSelected) && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </div>

                  <span className="font-display text-sm font-bold text-brand-orange">{course.code}</span>
                  <h4 className="text-white text-sm font-semibold mt-1 pr-6">{course.name}</h4>
                  {course.description && (
                    <p className="text-ink-muted text-xs mt-1 line-clamp-2">{course.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="navy">{course.level} Level</Badge>
                    <Badge variant="gray">{course.creditUnits} Units</Badge>
                    <Badge variant="gray">{course.semester}</Badge>
                    {isEnrolled && <Badge variant="green">Registered</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enrolled Courses */}
      <div>
        <h3 className="font-display text-base font-semibold text-white mb-3">
          My Registered Courses ({enrolled.length})
        </h3>
        {loadingEnrolled ? (
          <div className="flex justify-center py-8"><Spinner size={28} /></div>
        ) : enrolled.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-ink-muted text-sm">You haven&apos;t registered for any courses yet.</p>
            <p className="text-ink-muted text-xs mt-1">Select courses above and click Register.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <Card className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cinema-border">
                    {['Code', 'Course Name', 'Units', 'Session', 'Semester'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-ink-muted uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cinema-border">
                  {enrolled.map(enr => (
                    <tr key={enr.id} className="hover:bg-cinema-elevated transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-display font-bold text-brand-orange text-sm">{enr.course?.code}</span>
                      </td>
                      <td className="px-5 py-3 text-white text-sm">{enr.course?.name}</td>
                      <td className="px-5 py-3">
                        <Badge variant="gray">{enr.course?.creditUnits}</Badge>
                      </td>
                      <td className="px-5 py-3 text-ink-secondary text-sm">{enr.session}</td>
                      <td className="px-5 py-3 text-ink-secondary text-sm">{enr.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}