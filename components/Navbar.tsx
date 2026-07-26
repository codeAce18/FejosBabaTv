'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { List, X, SignOut, User, SquaresFour, MagnifyingGlass } from '@phosphor-icons/react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const PUBLIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Browse', href: '/browse' },
  { label: 'About Ministry', href: '/about-ministry' },
  { label: 'Staff', href: '/staff' },
  { label: 'Upcoming Program', href: '/upcoming-program' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, clearAuth, isAdmin, isStudent } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const solidNav = scrolled || !isHome;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        solidNav
          ? 'bg-cinema-black/95 backdrop-blur-md border-b border-cinema-border'
          : 'bg-gradient-to-b from-cinema-black/90 via-cinema-black/40 to-transparent'
      )}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image src="/FejosLogo.png" alt="FejosBaba TV" width={42} height={42} className="rounded-full" />
              <span className="font-display text-lg font-bold tracking-[0.12em] text-white hidden sm:block">
                FEJOS<span className="text-brand-orange">BABA</span>
                <span className="text-ink-muted text-xs font-normal tracking-widest ml-1.5">TV</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {PUBLIC_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-1',
                    pathname === href || (href !== '/' && pathname.startsWith(href))
                      ? 'text-white after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-brand-orange'
                      : 'text-ink-secondary hover:text-white'
                  )}
                >
                  {label}
                </Link>
              ))}
              {isAuthenticated() && (
                <Link
                  href={getDashboardLink()}
                  className="text-ink-secondary hover:text-white text-sm font-medium flex items-center gap-1.5"
                >
                  <SquaresFour size={16} /> Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/search" className="text-ink-secondary hover:text-white p-2 transition-colors" aria-label="Search">
              <MagnifyingGlass size={20} />
            </Link>
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-cinema-surface/80 px-3 py-1.5 rounded-full border border-cinema-border">
                  <div className="w-7 h-7 rounded-full bg-brand-navy flex items-center justify-center">
                    <User size={14} className="text-brand-orange" weight="fill" />
                  </div>
                  <span className="text-sm text-ink-secondary">{user?.name?.split(' ')[0]}</span>
                  {user?.role === 'PREMIUM' && (
                    <span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-sm font-bold tracking-wide">PRO</span>
                  )}
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-ink-muted hover:text-white text-sm">
                  <SignOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-ink-secondary hover:text-white text-sm font-medium px-3 py-2">
                  Login
                </Link>
                <Link
                  href="/register/premium"
                  className="bg-brand-orange hover:bg-brand-orange-light text-white text-sm font-bold px-5 py-2.5 rounded-sm transition-all shadow-orange-glow-sm"
                >
                  Get Premium
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-ink-secondary hover:text-white p-1">
            {mobileOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      <div className={cn('md:hidden border-t border-cinema-border bg-cinema-dark/98 backdrop-blur-lg', mobileOpen ? 'block' : 'hidden')}>
        <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
          <Link href="/search" onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2.5">
            Search
          </Link>
          {PUBLIC_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2.5">
              {label}
            </Link>
          ))}
          {isAuthenticated() ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2.5">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-400 py-2.5">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-ink-secondary hover:text-white py-2.5">
                Login
              </Link>
              <Link
                href="/register/premium"
                onClick={() => setMobileOpen(false)}
                className="block bg-brand-orange text-white text-center py-3 rounded-sm font-bold mt-2"
              >
                Get Premium
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
