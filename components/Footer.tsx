import Link from 'next/link';
import Image from "next/image";
import { Film, X, Play as YoutubeIcon,} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cinema-dark border-t border-cinema-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/FejosLogo.png" alt="FejosBaba TV" width={50} height={50} />
              <span className="font-display text-xl font-bold tracking-wider text-white">
                FEJOS<span className="text-brand-orange">BABA</span>
                <span className="text-ink-secondary text-sm font-normal ml-1">TV</span>
              </span>
            </div>
            <p className="text-ink-secondary text-sm leading-relaxed max-w-xs">
              Your home for premium Nigerian films, series, and the FejosBaba Film Academy. Watch, learn, and grow with us.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {[
                { icon: X, href: '#' },
                { icon: YoutubeIcon, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="text-ink-muted hover:text-brand-orange transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Movies */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4 tracking-wider uppercase">Movies</h4>
            <ul className="space-y-2">
              {['Browse All', 'New Releases', 'Drama', 'Action', 'Comedy'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-ink-secondary hover:text-brand-orange text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4 tracking-wider uppercase">Account</h4>
            <ul className="space-y-2">
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

        <div className="border-t border-cinema-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink-muted text-xs">
            © {new Date().getFullYear()} FejosBaba TV. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-ink-muted hover:text-ink-secondary text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-ink-muted hover:text-ink-secondary text-xs transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}