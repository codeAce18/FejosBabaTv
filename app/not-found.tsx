import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cinema-black flex flex-col items-center justify-center text-center px-4">
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-brand-orange/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        <p className="font-display text-8xl font-bold text-brand-orange mb-2 text-glow-orange">
          404
        </p>
        <h1 className="font-display text-2xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-ink-secondary text-sm max-w-xs mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-orange-glow"
        >
          ← Back to Movies
        </Link>
      </div>
    </div>
  );
}