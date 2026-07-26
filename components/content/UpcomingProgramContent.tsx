'use client';

import Image from 'next/image';
import ProgramRegistrationForm from '@/components/content/ProgramRegistrationForm';
import { PageHero, ScrollReveal } from '@/components/motion/ScrollReveal';

export default function UpcomingProgramContent() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="relative aspect-[3/4] sm:aspect-[16/10] rounded-xl overflow-hidden mb-10 ring-white/10 bg-cinema-surface">
            <Image
              src="/program/Flyer.png"
              alt="Upcoming program flier"
              fill
              className="object-contain bg-cinema-black"
              sizes="(max-width:768px) 100vw, 768px"
              priority
            />
          </div>
        </ScrollReveal>

        <PageHero className="mb-10">
          <p className="text-brand-orange text-xs font-bold tracking-[0.25em] uppercase mb-3">Registration Open</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Upcoming Program</h1>
          <p className="text-ink-secondary">
            Complete the form below to register. All submissions are stored securely and reviewed by the ministry team.
          </p>
        </PageHero>

        <ScrollReveal index={1}>
          <ProgramRegistrationForm />
        </ScrollReveal>
      </div>
    </div>
  );
}
