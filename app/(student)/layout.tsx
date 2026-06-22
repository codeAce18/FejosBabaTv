'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, FileText, ClipboardList, User, Menu, X, LogOut, ChevronRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/student/courses', icon: BookOpen },
  { label: 'My Results', href: '/student/results', icon: FileText },
  { label: 'Exams', href: '/student/exams', icon: ClipboardList },
  { label: 'Profile', href: '/student/profile', icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isStudent, clearAuth, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated() || !isStudent()) {
      router.replace('/login');
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-cinema-black flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-cinema-dark border-r border-cinema-border flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-cinema-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-navy flex items-center justify-center">
              <div className="w-3.5 h-2.5 bg-brand-orange rounded-sm" />
            </div>
            <span className="font-display text-base font-bold tracking-wider text-white">
              FEJOS<span className="text-brand-orange">BABA</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ink-secondary hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Student Info */}
        <div className="px-5 py-4 border-b border-cinema-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-navy/30 border border-brand-navy/50 flex items-center justify-center">
              <GraduationCap size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-tight truncate max-w-[140px]">{user?.name}</p>
              <p className="text-blue-400 text-xs">{user?.studentProfile?.department || 'Student'}</p>
            </div>
          </div>
          {user?.studentProfile && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-brand-navy/30 border border-brand-navy/40 text-blue-300 px-2 py-0.5 rounded-full">
                {user.studentProfile.admissionNumber}
              </span>
              <span className="text-xs text-ink-muted">{user.studentProfile.level} Level</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-navy/20 text-blue-300 border border-brand-navy/40'
                    : 'text-ink-secondary hover:text-white hover:bg-cinema-surface'
                )}>
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-cinema-border space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-secondary hover:text-white hover:bg-cinema-surface transition-all">
            ← Back to Movies
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-cinema-dark border-b border-cinema-border flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ink-secondary hover:text-white">
            <Menu size={22} />
          </button>
          <h1 className="font-display text-lg font-semibold text-white flex-1">
            {NAV_ITEMS.find(n => n.href === pathname)?.label || 'Student Portal'}
          </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}