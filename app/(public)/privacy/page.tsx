import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FejosBaba TV privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-white mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-ink-secondary text-sm leading-relaxed">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>FejosBaba TV collects account information (name, email) and usage data to provide streaming and academy services. Payment processing is handled securely by Paystack.</p>
        <p>We do not sell your personal data. Contact us for data deletion requests at support@fejosbabatv.com.</p>
      </div>
    </div>
  );
}
