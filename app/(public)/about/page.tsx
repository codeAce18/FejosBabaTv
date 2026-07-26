import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about FejosBaba TV — Nigerian film streaming and the FejosBaba Film Academy.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-white mb-6">About FejosBaba TV</h1>
      <div className="prose prose-invert space-y-4 text-ink-secondary leading-relaxed">
        <p>
          FejosBaba TV is a Nigerian film streaming platform and film academy portal. Watch premium Nollywood
          films and series, explore free trailers, or unlock full movies with a Premium subscription.
        </p>
        <p>
          Our Film Academy gives students access to courses, exam results, and online examinations — all in one place.
        </p>
        <p>
          <Link href="/register/premium" className="text-brand-orange hover:underline">Get Premium</Link>
          {' · '}
          <Link href="/register/student" className="text-brand-orange hover:underline">Student Registration</Link>
        </p>
      </div>
    </div>
  );
}
