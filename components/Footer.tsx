import Link from 'next/link';
import Image from 'next/image';
import { YoutubeLogo, InstagramLogo, FacebookLogo } from '@phosphor-icons/react/dist/ssr';

export default function Footer() {
  return (
    <footer className="bg-cinema-dark border-t border-cinema-border mt-24 relative">
      <div className="absolute top-0 left-0 right-0 section-rule" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/FejosLogo.png" alt="FejosBaba TV" width={48} height={48} className="rounded-full" />
              <span className="font-display text-xl font-bold tracking-[0.1em] text-white">
                FEJOS<span className="text-brand-orange">BABA</span>
                <span className="text-ink-muted text-sm font-normal ml-1">TV</span>
              </span>
            </div>
            <p className="text-ink-secondary text-sm leading-relaxed max-w-sm">
              Gospel films, discipleship media, and creative training from PREM — proclaiming Christ through creative excellence.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-brand-orange transition-colors" aria-label="YouTube">
                <YoutubeLogo size={22} weight="fill" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-brand-orange transition-colors" aria-label="Instagram">
                <InstagramLogo size={22} weight="fill" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-brand-orange transition-colors" aria-label="Facebook">
                <FacebookLogo size={22} weight="fill" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-xs font-bold text-white mb-4 tracking-[0.2em] uppercase">Watch</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse All', href: '/browse' },
                { label: 'New Releases', href: '/browse?sort=new' },
                { label: 'Free Movies', href: '/browse?filter=free' },
                { label: 'Premium', href: '/browse?filter=premium' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-ink-secondary hover:text-brand-orange text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display text-xs font-bold text-white mb-4 tracking-[0.2em] uppercase">Ministry</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About PREM', href: '/about-ministry' },
                { label: 'Our Staff', href: '/staff' },
                { label: 'Upcoming Program', href: '/upcoming-program' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-ink-secondary hover:text-brand-orange text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display text-xs font-bold text-white mb-4 tracking-[0.2em] uppercase">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Login', href: '/login' },
                { label: 'Get Premium', href: '/register/premium' },
                { label: 'Student Portal', href: '/register/student' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-ink-secondary hover:text-brand-orange text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cinema-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink-muted text-xs">© {new Date().getFullYear()} FejosBaba TV · PREM. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-ink-muted hover:text-ink-secondary text-xs transition-colors">Privacy</Link>
            <Link href="/terms" className="text-ink-muted hover:text-ink-secondary text-xs transition-colors">Terms</Link>
            <Link href="/about" className="text-ink-muted hover:text-ink-secondary text-xs transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
