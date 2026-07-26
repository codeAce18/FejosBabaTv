'use client';
import { useQuery } from '@tanstack/react-query';
import { FilmStrip, Users, Crown, Eye, TrendUp } from '@phosphor-icons/react';
import { adminApi } from '@/lib/api';
import { StatCard, Card, Spinner, EmptyState } from '@/components/ui';
import { formatNumber, formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { DashboardStats } from '@/lib/types';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const stats: DashboardStats | undefined = data?.data?.data;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner size={36} /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-ink-secondary text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Movies" value={stats?.totalMovies ?? 0} icon={<FilmStrip size={20} />} />
        <StatCard label="Students" value={stats?.totalStudents ?? 0} icon={<Users size={20} />} />
        <StatCard label="Premium Users" value={stats?.totalPremiumUsers ?? 0} icon={<Crown size={20} />} />
        <StatCard label="Total Views" value={formatNumber(stats?.totalViews ?? 0)} icon={<Eye size={20} />} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Movie', href: '/admin/movies', icon: FilmStrip, color: 'brand-orange' },
          { label: 'Add Student', href: '/admin/students', icon: Users, color: 'blue-400' },
          { label: 'Add Course', href: '/admin/courses', icon: Crown, color: 'purple-400' },
          { label: 'Upload Result', href: '/admin/results', icon: TrendUp, color: 'green-400' },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 p-4 bg-cinema-surface border border-cinema-border rounded-xl hover:border-cinema-muted transition-all group text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-cinema-elevated border border-cinema-border flex items-center justify-center group-hover:border-brand-orange/30 transition-colors">
              <Icon size={18} className="text-ink-secondary group-hover:text-brand-orange transition-colors" />
            </div>
            <span className="text-xs text-ink-secondary group-hover:text-white transition-colors font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movies */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">Recent Movies</h3>
            <Link href="/admin/movies" className="text-brand-orange text-xs hover:underline">View all</Link>
          </div>
          {!stats?.recentMovies?.length ? (
            <EmptyState icon={<Film size={24} />} title="No movies yet" />
          ) : (
            <div className="space-y-3">
              {stats.recentMovies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between py-2 border-b border-cinema-border last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{movie.title}</p>
                    <p className="text-ink-muted text-xs">{formatDate(movie.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-ink-secondary text-xs">
                    <Eye size={12} />
                    {formatNumber(movie.views)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Students */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">Recent Students</h3>
            <Link href="/admin/students" className="text-brand-orange text-xs hover:underline">View all</Link>
          </div>
          {!stats?.recentStudents?.length ? (
            <EmptyState icon={<Users size={24} />} title="No students yet" />
          ) : (
            <div className="space-y-3">
              {stats.recentStudents.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-cinema-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-brand-navy/30 border border-brand-navy/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">{s.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{s.name}</p>
                    <p className="text-ink-muted text-xs truncate">
                      {(s as any).studentProfile?.department || s.email}
                    </p>
                  </div>
                  <p className="text-ink-muted text-xs flex-shrink-0">{formatDate(s.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}