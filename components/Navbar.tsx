'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, clearAuth, isAdmin, isStudent } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/');
    setMobileOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin()) return '/admin/dashboard';
    if (isStudent()) return '/student/dashboard';
    return '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cinema-black/90 backdrop-blur-md border-b border-cinema-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/FejosLogo.png" alt="FejosBaba TV" width={50} height={50} />
            <span className="font-display text-xl font-bold tracking-wider text-white">
              FEJOS<span className="text-brand-orange">BABA</span>
              <span className="text-ink-secondary text-sm font-normal ml-1">TV</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-ink-secondary hover:text-white transition-colors text-sm font-medium">
              Movies
            </Link>
            {isAuthenticated() && (
              <Link
                href={getDashboardLink()}
                className="text-ink-secondary hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-cinema-surface px-3 py-1.5 rounded-full border border-cinema-border">
                  <div className="w-6 h-6 rounded-full bg-brand-navy flex items-center justify-center">
                    <User size={12} className="text-brand-orange" />
                  </div>
                  <span className="text-sm text-ink-secondary">
                    {user?.name?.split(' ')[0]}
                  </span>
                  {user?.role === 'PREMIUM' && (
                    <span className="text-xs bg-brand-orange text-white px-1.5 py-0.5 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-ink-muted hover:text-white transition-colors text-sm"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-ink-secondary hover:text-white transition-colors text-sm font-medium px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register/premium"
                  className="bg-brand-orange hover:bg-brand-orange-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-orange-glow-sm"
                >
                  Get Premium
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ink-secondary hover:text-white p-1"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'md:hidden border-t border-cinema-border bg-cinema-dark transition-all duration-300',
        mobileOpen ? 'block' : 'hidden'
      )}>
        <div className="px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2">Movies</Link>
          {isAuthenticated() ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-400 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2">Login</Link>
              <Link href="/register/premium" onClick={() => setMobileOpen(false)} className="block bg-brand-orange text-white text-center py-2 rounded-lg font-semibold">Get Premium</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}