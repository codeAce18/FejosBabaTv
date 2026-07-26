'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  SquaresFour, BookOpen, FileText, ClipboardText, User, List, SignOut, GraduationCap,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/student/dashboard', icon: SquaresFour },
  { label: 'My Courses', href: '/student/courses', icon: BookOpen },
  { label: 'My Results', href: '/student/results', icon: FileText },
  { label: 'Exams', href: '/student/exams', icon: ClipboardText },
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
  }, [isAuthenticated, isStudent, router]);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-cinema-black flex">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-cinema-dark border-r border-cinema-border flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-cinema-border">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/FejosLogo.png" alt="FejosBaba" width={32} height={32} className="rounded-full" />
            <span className="font-display text-sm font-bold tracking-wider text-white">
              FEJOS<span className="text-brand-orange">BABA</span>
            </span>
          </Link>
          <button type="button" onClick={() => setSidebarOpen(false)} className="lg:hidden text-ink-secondary hover:text-white">✕</button>
        </div>

        <div className="px-5 py-4 border-b border-cinema-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-navy/30 border border-brand-navy/50 flex items-center justify-center">
              <GraduationCap size={16} className="text-blue-400" weight="fill" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-blue-400 text-xs truncate">{user?.studentProfile?.department || 'Student'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border',
                  active
                    ? 'bg-brand-navy/20 text-blue-300 border-brand-navy/40'
                    : 'text-ink-secondary hover:text-white hover:bg-cinema-surface border-transparent'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-cinema-border space-y-1">
          <Link href="/" className="block px-3 py-2 text-sm text-ink-secondary hover:text-white transition-colors">← Back to Movies</Link>
          <button type="button" onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-ink-muted hover:text-red-400 transition-colors">
            <SignOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-cinema-dark/95 backdrop-blur-md border-b border-cinema-border flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden text-ink-secondary hover:text-white">
            <List size={22} />
          </button>
          <h1 className="font-display text-lg font-semibold text-white flex-1">
            {NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Student Portal'}
          </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
