'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FOUNDER, FOUNDER_BIO, FOUNDER_QUOTE, FOUNDER_CLOSING, PREM } from '@/lib/content/ministry';
import { PageHero, ScrollReveal } from '@/components/motion/ScrollReveal';

export default function AboutMinistryContent() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <PageHero className="relative overflow-hidden border-b border-cinema-border">
        <div className="absolute inset-0 bg-navy-gradient opacity-80" />
        <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20 text-center">
          <p className="text-brand-orange text-xs font-bold tracking-[0.25em] uppercase mb-4">PREM International</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">About the Ministry</h1>
          <p className="text-ink-secondary max-w-2xl mx-auto text-lg">{PREM.tagline}</p>
        </div>
      </PageHero>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start">
        <ScrollReveal className="lg:sticky lg:top-24">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-white/10 bg-cinema-surface">
            <Image src={FOUNDER.image} alt={FOUNDER.name} fill className="object-cover object-top" sizes="320px" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-display text-xl font-bold text-white">{FOUNDER.alias}</p>
              <p className="text-ink-secondary text-sm mt-1">Founder & President, PREM</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal index={0}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{FOUNDER.name}</h2>
          </ScrollReveal>
          {FOUNDER_BIO.map((para, i) => (
            <ScrollReveal key={i} index={i + 1}>
              <p className="text-ink-secondary leading-relaxed">{para}</p>
            </ScrollReveal>
          ))}
          <ScrollReveal index={7}>
            <blockquote className="border-l-4 border-brand-orange pl-5 py-2 my-8">
              <p className="text-white italic text-lg leading-relaxed">{FOUNDER_QUOTE}</p>
            </blockquote>
          </ScrollReveal>
          {FOUNDER_CLOSING.map((para, i) => (
            <ScrollReveal key={i} index={i + 8}>
              <p className="text-ink-secondary leading-relaxed">{para}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="section-rule max-w-4xl mx-auto" />

      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-10">
        {[
          { title: 'About PREM', body: PREM.tagline, intro: 'The Proclaimers of Righteousness Evangelical Ministries International (PREM), Nigeria is a dynamic gospel film ministry dedicated to winning souls, discipling believers, and transforming lives through the powerful medium of drama, film, and other creative expressions inspired by the Holy Spirit.' },
        ].map((block, i) => (
          <ScrollReveal key={block.title} index={i}>
            <h2 className="font-display text-3xl font-bold text-white mb-3">{block.title}</h2>
            <p className="text-brand-orange font-semibold mb-4">{block.body}</p>
            <p className="text-ink-secondary leading-relaxed">{block.intro}</p>
          </ScrollReveal>
        ))}

        <ScrollReveal index={2}>
          <h3 className="font-display text-xl font-semibold text-white mb-4">Our History</h3>
          <div className="space-y-4">
            {PREM.history.map((para, i) => (
              <p key={i} className="text-ink-secondary leading-relaxed">{para}</p>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          <ScrollReveal index={3}>
            <div className="bg-cinema-surface border border-cinema-border rounded-lg p-6 h-full">
              <h3 className="font-display text-lg font-semibold text-brand-orange mb-3">Our Mission</h3>
              <p className="text-ink-secondary text-sm leading-relaxed">{PREM.mission}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal index={4}>
            <div className="bg-cinema-surface border border-cinema-border rounded-lg p-6 h-full">
              <h3 className="font-display text-lg font-semibold text-brand-orange mb-3">Our Vision</h3>
              <p className="text-ink-secondary text-sm leading-relaxed">{PREM.vision}</p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal index={5}>
          <div className="bg-navy-gradient border border-brand-navy/30 rounded-xl p-8 text-center">
            <h3 className="font-display text-2xl font-bold text-white mb-3">Join the Vision</h3>
            <p className="text-ink-secondary leading-relaxed mb-6 max-w-2xl mx-auto">{PREM.joinVision}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/browse" className="bg-brand-orange hover:bg-brand-orange-light text-white font-bold px-6 py-3 rounded-sm transition-colors">Watch Films</Link>
              <Link href="/upcoming-program" className="border border-white/20 hover:border-brand-orange text-white font-semibold px-6 py-3 rounded-sm transition-colors">Register for Program</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
