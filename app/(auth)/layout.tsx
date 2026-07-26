import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cinema-black flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-navy-gradient opacity-40 pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image src="/FejosLogo.png" alt="FejosBaba TV" width={44} height={44} className="rounded-full" />
          <span className="font-display text-lg font-bold tracking-[0.12em] text-white">
            FEJOS<span className="text-brand-orange">BABA</span>
            <span className="text-ink-muted text-xs font-normal ml-1.5">TV</span>
          </span>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">{children}</main>
      <footer className="relative z-10 p-6 text-center">
        <p className="text-ink-muted text-xs">© {new Date().getFullYear()} FejosBaba TV · PREM</p>
      </footer>
    </div>
  );
}
