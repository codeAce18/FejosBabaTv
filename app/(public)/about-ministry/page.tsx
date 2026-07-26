import type { Metadata } from 'next';
import AboutMinistryContent from '@/components/content/AboutMinistryContent';

export const metadata: Metadata = {
  title: 'About the Ministry | FejosBaba TV',
  description: 'Learn about Evangelist Femi Adebile Joshua (Fejosbaba) and PREM — proclaiming Christ through creative excellence.',
};

export default function AboutMinistryPage() {
  return <AboutMinistryContent />;
}
