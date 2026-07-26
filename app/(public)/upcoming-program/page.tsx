import type { Metadata } from 'next';
import UpcomingProgramContent from '@/components/content/UpcomingProgramContent';

export const metadata: Metadata = {
  title: 'Upcoming Program Registration | FejosBaba TV',
  description: 'Register for upcoming PREM conferences and programs.',
};

export default function UpcomingProgramPage() {
  return <UpcomingProgramContent />;
}
