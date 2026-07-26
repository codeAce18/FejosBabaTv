import type { Metadata } from 'next';
import StaffPageContent from '@/components/content/StaffPageContent';

export const metadata: Metadata = {
  title: 'Our Staff | FejosBaba TV',
  description: 'Meet the dedicated team behind PREM and FejosBaba TV gospel film productions.',
};

export default function StaffPage() {
  return <StaffPageContent />;
}
