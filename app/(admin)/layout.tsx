'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Film, Users, BookOpen, FileText,
  ClipboardList, Crown, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Movies', href: '/admin/movies', icon: Film },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Results', href: '/admin/results', icon: FileText },
  { label: 'Exams', href: '/admin/exams', icon: ClipboardList },
  { label: 'Premium Users', href: '/admin/premium', icon: Crown },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isAdmin, clearAuth, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
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
      {/* ─── Sidebar ─── */}
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

        {/* Admin badge */}
        <div className="px-5 py-4 border-b border-cinema-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center">
              <span className="text-brand-orange text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-brand-orange text-xs">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/20'
                    : 'text-ink-secondary hover:text-white hover:bg-cinema-surface'
                )}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-cinema-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-cinema-dark border-b border-cinema-border flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ink-secondary hover:text-white">
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-semibold text-white capitalize">
              {NAV_ITEMS.find(n => n.href === pathname)?.label || 'Admin'}
            </h1>
          </div>
          <Link href="/" className="text-xs text-ink-secondary hover:text-brand-orange transition-colors">
            ← View Site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}