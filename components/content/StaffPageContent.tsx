'use client';

import { STAFF_MEMBERS } from '@/lib/content/staff';
import { StaffPhoto } from '@/components/content/StaffPhoto';
import { PageHero, StaggerGrid, StaggerItem } from '@/components/motion/ScrollReveal';

export default function StaffPageContent() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <PageHero className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <p className="text-brand-orange text-xs font-bold tracking-[0.25em] uppercase mb-3">PREM Team</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Members&apos; Profile</h1>
        <p className="text-ink-secondary max-w-2xl text-lg">
          The people who serve behind and in front of the camera committed to proclaiming Christ through creative excellence.
        </p>
      </PageHero>

      <StaggerGrid className="max-w-6xl mx-auto px-4 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {STAFF_MEMBERS.map((member) => (
          <StaggerItem key={member.slug}>
            <article className="group bg-cinema-surface/50 border border-cinema-border rounded-xl overflow-hidden hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <StaffPhoto slug={member.slug} name={member.name} photo={member.photo} />
              <div className="p-5 sm:p-6">
                <p className="text-brand-orange text-xs font-bold tracking-wider uppercase mb-1">Joined {member.joined}</p>
                <h2 className="font-display text-xl font-bold text-white mb-1">{member.name}</h2>
                <p className="text-ink-muted text-sm mb-4">{member.role}</p>
                <div className="space-y-3">
                  {member.bio.map((para, i) => (
                    <p key={i} className="text-ink-secondary text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
