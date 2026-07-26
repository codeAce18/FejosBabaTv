import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'FejosBaba TV terms of use.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-white mb-6">Terms of Use</h1>
      <div className="space-y-4 text-ink-secondary text-sm leading-relaxed">
        <p>By using FejosBaba TV you agree to these terms. Content is for personal, non-commercial viewing only.</p>
        <p>Premium subscriptions are billed via Paystack. Refunds are handled per our payment policy.</p>
        <p>Film Academy students must provide accurate registration details. Misrepresentation may result in account suspension.</p>
      </div>
    </div>
  );
}
