'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

export function AuthShell({ children, title, subtitle, badge }: AuthShellProps) {
  return (
    <div className="w-full max-w-[980px] grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-center">
      {/* Brand panel — hidden on small screens */}
      <div className="hidden lg:block relative rounded-2xl overflow-hidden min-h-[520px] ring-1 ring-white/10">
        <div className="absolute inset-0 bg-navy-gradient" />
        <div className="absolute inset-0 film-grain opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black/40" />
        <div className="relative z-10 p-10 h-full flex flex-col justify-between">
          <div>
            <Image src="/FejosLogo.png" alt="FejosBaba TV" width={56} height={56} className="rounded-full mb-8" />
            {badge && (
              <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-brand-orange mb-4">
                {badge}
              </span>
            )}
            <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
              Gospel films.<br />
              <span className="text-brand-orange">Kingdom impact.</span>
            </h2>
            <p className="text-ink-secondary leading-relaxed max-w-sm">
              Stream PREM productions, unlock premium titles, or access the Film Academy student portal.
            </p>
          </div>
          <p className="text-ink-muted text-xs">
            PREM — Proclaiming Righteousness, Transforming Lives
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <div className="mb-6 lg:hidden text-center">
          <Image src="/FejosLogo.png" alt="" width={48} height={48} className="rounded-full mx-auto mb-3" />
        </div>
        <div className="bg-cinema-surface/80 backdrop-blur-sm border border-cinema-border rounded-xl p-7 sm:p-8 shadow-card">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
            <p className="text-ink-secondary text-sm mt-1.5">{subtitle}</p>
          </div>
          {children}
        </div>
        <p className="text-center mt-5">
          <Link href="/" className="text-ink-muted hover:text-brand-orange text-sm transition-colors">
            ← Back to movies
          </Link>
        </p>
      </div>
    </div>
  );
}

interface PortalShellProps {
  children: ReactNode;
  brand: 'admin' | 'student';
  userName?: string;
  userMeta?: string;
  userBadge?: string;
  navItems: { label: string; href: string; icon: React.ComponentType<{ size?: number; weight?: string; className?: string }> }[];
  pathname: string;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  onOpenSidebar: () => void;
  onLogout: () => void;
  pageTitle: string;
}

export function PortalShell({
  children,
  brand,
  userName,
  userMeta,
  userBadge,
  navItems,
  pathname,
  sidebarOpen,
  onCloseSidebar,
  onOpenSidebar,
  onLogout,
  pageTitle,
}: PortalShellProps) {
  const accent = brand === 'admin' ? 'brand-orange' : 'blue-400';
  const accentBg = brand === 'admin' ? 'bg-brand-orange/15 border-brand-orange/25 text-brand-orange' : 'bg-brand-navy/20 border-brand-navy/40 text-blue-300';

  return (
    <div className="min-h-screen bg-cinema-black flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-cinema-dark border-r border-cinema-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-cinema-border">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/FejosLogo.png" alt="FejosBaba" width={32} height={32} className="rounded-full" />
            <span className="font-display text-sm font-bold tracking-wider text-white">
              FEJOS<span className="text-brand-orange">BABA</span>
            </span>
          </Link>
        </div>

        <div className="px-5 py-4 border-b border-cinema-border">
          <p className="text-white text-sm font-medium truncate">{userName}</p>
          <p className={`text-xs mt-0.5 ${brand === 'admin' ? 'text-brand-orange' : 'text-blue-400'}`}>{userMeta}</p>
          {userBadge && (
            <span className={`inline-block mt-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${accentBg}`}>
              {userBadge}
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? `${accentBg} border` : 'text-ink-secondary hover:text-white hover:bg-cinema-surface border border-transparent'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-cinema-border space-y-1">
          <Link href="/" className="block px-3 py-2 text-sm text-ink-secondary hover:text-white transition-colors">
            ← View Site
          </Link>
          <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-ink-muted hover:text-red-400 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onCloseSidebar} />}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-cinema-dark/95 backdrop-blur-md border-b border-cinema-border flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button type="button" onClick={onOpenSidebar} className="lg:hidden text-ink-secondary hover:text-white p-1">
            ☰
          </button>
          <h1 className="font-display text-lg font-semibold text-white flex-1">{pageTitle}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
