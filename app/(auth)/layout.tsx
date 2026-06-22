import Link from 'next/link';
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cinema-black flex flex-col">
      {/* Minimal header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/FejosLogo.png" alt="FejosBaba TV" width={50} height={50} />
          <span className="font-display text-lg font-bold tracking-wider text-white">
            FEJOS<span className="text-brand-orange">BABA</span>
            <span className="text-ink-secondary text-sm font-normal ml-1">TV</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      <footer className="p-6 text-center">
        <p className="text-ink-muted text-xs">
          © {new Date().getFullYear()} FejosBaba TV · All rights reserved
        </p>
      </footer>
    </div>
  );
}