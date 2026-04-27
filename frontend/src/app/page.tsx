'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import useSWR from 'swr';
import { albumsApi, eventsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/index';
import { formatEventDateShort, formatIDR } from '@/lib/utils';
import { staggerContainer, staggerItem, fadeInUp, letterReveal } from '@/lib/motion';
import { HoverReveal } from '@/lib/heroAnimation';

const BAND_NAME_LINE1 = 'KELOMPOK';
const BAND_NAME_LINE2 = 'PENERBANG';
const BAND_NAME_LINE3 = 'ROKET';

function HeroLetters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="flex overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterReveal}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: albumsRes } = useSWR('albums', () => albumsApi.list());
  const { data: eventsRes } = useSWR('events-upcoming', () =>
    eventsApi.list({ upcoming: true, limit: 3 })
  );

  const albums = albumsRes?.data ?? [];
  const latestAlbum = albums[0];
  const upcomingEvents = eventsRes?.data ?? [];

  return (
    <>
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        aria-label="Hero"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050810] via-[#0a0e1a] to-bg-base" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(32,96,160,0.14),transparent)]" />

        {/* Decorative corner elements */}
        <div className="absolute top-24 left-4 sm:left-8 z-10 flex flex-col gap-1">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.06, duration: 0.4 }}
              className="h-px bg-accent/40 origin-left"
              style={{ width: `${20 - i * 2}px` }}
            />
          ))}
        </div>
        <div className="absolute top-24 right-4 sm:right-8 z-10 flex flex-col gap-1 items-end">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.06, duration: 0.4 }}
              className="h-px bg-accent/40 origin-right"
              style={{ width: `${20 - i * 2}px` }}
            />
          ))}
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4"
          style={{ opacity }}
        >
          {/* Year / origin eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="eyebrow mb-8 text-sm"
          >
            Jakarta · Est. 2011
          </motion.p>

          {/* Band name */}
          {/* Police tape — diagonal scrolling banner */}
          <div
            className="absolute pointer-events-none overflow-hidden"
            style={{
              bottom: '30%',
              left: '50%',
              transform: 'translateX(-50%) rotate(-12deg)',
              width: '500%',
              zIndex: 20,
            }}
          >
            {/* Top tape — scrolls left, white */}
<div className="flex overflow-hidden mb-3" style={{ whiteSpace: 'nowrap' }}>
  <motion.div
    animate={{ x: ['0%', '-50%'] }}
    transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
    className="flex shrink-0"
  >
    {[...Array(4)].map((_, i) => (
      <span key={i} className="inline-flex items-center bg-white px-8 py-4 font-display text-5xl font-black text-bg-base uppercase select-none" style={{ letterSpacing: '0.15em' }}>
        BRINGIN TUA <span className="mx-4 inline-block w-px h-10 bg-bg-base/40 align-middle" /> DIMANA MERDEKA <span className="mx-4 inline-block w-px h-10 bg-bg-base/40 align-middle" /> ANJING JALANAN <span className="mx-4 inline-block w-px h-10 bg-bg-base/40 align-middle" /> RODA GILA <span className="mx-4 inline-block w-px h-10 bg-bg-base/40 align-middle" /> TARGET OPERASI <span className="mx-4 inline-block w-px h-10 bg-bg-base/40 align-middle" />
      </span>
    ))}
  </motion.div>
</div>
{/* Bottom tape — scrolls right, blue, album titles */}
<div className="flex overflow-hidden" style={{ whiteSpace: 'nowrap' }}>
  <motion.div
    animate={{ x: ['-25%', '0%'] }}
    transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
    className="flex shrink-0"
  >
    {[...Array(8)].map((_, i) => (
      <span key={i} className="inline-flex items-center bg-accent-bright px-4 py-2 font-display text-2xl font-black text-bg-base uppercase select-none" style={{ letterSpacing: '0.15em' }}>
        Teriakan Bocah (2015) <span className="mx-3 inline-block w-px h-6 bg-bg-base/40 align-middle" /> HAAI (2015) <span className="mx-3 inline-block w-px h-6 bg-bg-base/40 align-middle" /> Galaksi Palapa (2018) <span className="mx-3 inline-block w-px h-6 bg-bg-base/40 align-middle" /> Aksioma (bersama Eka Annash) (2023) <span className="mx-3 inline-block w-px h-6 bg-bg-base/40 align-middle" /> KOMA (2024) <span className="mx-3 inline-block w-px h-6 bg-bg-base/40 align-middle" />
      </span>
    ))}
  </motion.div>
</div>
</div>

          {/* Hover reveal — 3 band members under astronaut suits */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex gap-4 mt-10 mb-2"
          >
            {[
              { front: 'astronout1.jpeg', back: 'member1.jpeg' },
              { front: 'astronout2.jpeg', back: 'member2.jpeg' },
              { front: 'astronout3.jpeg', back: 'member3.jpeg' },
            ].map((item, i) => (
              <HoverReveal
                key={i}
                frontSrc={`/${item.front}`}
                backSrc={`/${item.back}`}
                maskRadius={200}
                className="w-[280px] h-[500px] rounded-lg"
              />
            ))}
          </motion.div>

          {/* Genre tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-2 mt-8 mb-10"
          >
            {['Acid Rock', 'Heavy Metal', 'Psychedelic Rock', 'Hard Rock'].map(
              (genre) => (
                <span
                  key={genre}
                  className="font-mono text-base text-text-faint uppercase tracking-widest border border-text-faint/20 px-3 py-1 rounded-sm"
                >
                  {genre}
                </span>
              )
            )}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button href="/discography" size="lg" leftIcon={<Play size={16} />}>
              Listen Now
            </Button>
            <Button
              href="/events"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight size={16} />}
            >
              Upcoming Shows
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          onClick={() =>
            document
              .getElementById('latest-release')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-faint hover:text-text-muted transition-colors duration-200 cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="font-mono text-[12px] uppercase tracking-widest text-accent-bright drop-shadow-[0_0_6px_rgba(32,96,160,0.9)]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </section>

      {/* ─── LATEST RELEASE ─── */}
      {latestAlbum && (
        <section
          id="latest-release"
          className="section-pad border-t border-accent-dim/20"
        >
          <div className="container-kpr">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Album art */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-accent/10 rounded-card blur-2xl scale-90 group-hover:bg-accent/15 transition-all duration-500" />
                <div className="relative aspect-square max-w-md mx-auto">
                  <Image
                    src={latestAlbum.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80'}
                    alt={`${latestAlbum.title} album cover`}
                    fill
                    className="object-cover rounded-card border border-accent-dim/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 rounded-card ring-1 ring-accent/20" />
                </div>
              </motion.div>

              {/* Info */}
              <motion.div variants={staggerContainer} className="flex flex-col gap-6">
                <motion.p variants={staggerItem} className="eyebrow">
                  Latest Release
                </motion.p>
                <motion.h2
                  variants={staggerItem}
                  className="font-display text-display text-text-primary"
                >
                  {latestAlbum.title}
                </motion.h2>
                <motion.p
                  variants={staggerItem}
                  className="font-mono text-text-muted text-sm"
                >
                  {latestAlbum.releaseYear} · Kelompok Penerbang Roket
                </motion.p>
                {latestAlbum.description && (
                  <motion.p
                    variants={staggerItem}
                    className="text-text-secondary leading-relaxed"
                  >
                    {latestAlbum.description}
                  </motion.p>
                )}
                <motion.div
                  variants={staggerItem}
                  className="flex flex-wrap gap-3"
                >
                  {latestAlbum.spotifyUrl && (
                    <Button
                      href={latestAlbum.spotifyUrl}
                      external
                      variant="primary"
                      size="md"
                    >
                      Spotify
                    </Button>
                  )}
                  {latestAlbum.bandcampUrl && (
                    <Button
                      href={latestAlbum.bandcampUrl}
                      external
                      variant="outline"
                      size="md"
                    >
                      Bandcamp
                    </Button>
                  )}
                  {latestAlbum.youtubeMusicUrl && (
                    <Button
                      href={latestAlbum.youtubeMusicUrl}
                      external
                      variant="ghost"
                      size="md"
                    >
                      YouTube Music
                    </Button>
                  )}
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Button
                    href="/discography"
                    variant="ghost"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Full Discography
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── UPCOMING EVENTS STRIP ─── */}
      {upcomingEvents.length > 0 && (
        <section className="section-pad bg-bg-surface border-y border-accent-dim/20">
          <div className="container-kpr">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <div className="flex items-end justify-between mb-10">
                <motion.div variants={fadeInUp}>
                  <p className="eyebrow mb-2">On Stage</p>
                  <h2 className="font-display text-4xl text-text-primary">
                    UPCOMING SHOWS
                  </h2>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button
                    href="/events"
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    All Shows
                  </Button>
                </motion.div>
              </div>

              <div className="flex flex-col divide-y divide-accent-dim/20">
                {upcomingEvents.map((event) => {
                  const d = formatEventDateShort(event.eventDate);
                  return (
                    <motion.div
                      key={event.id}
                      variants={staggerItem}
                      className="flex items-center gap-6 py-5 group"
                    >
                      {/* Date block */}
                      <div className="shrink-0 w-14 text-center">
                        <p className="font-display text-3xl text-accent-bright leading-none">
                          {d.day}
                        </p>
                        <p className="font-mono text-xs text-text-muted uppercase">
                          {d.month} {d.year}
                        </p>
                      </div>

                      <div className="w-px h-10 bg-accent-dim/40 shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-text-primary text-lg truncate group-hover:text-accent-bright transition-colors duration-200">
                          {event.title}
                        </p>
                        <p className="font-mono text-xs text-text-muted truncate">
                          {event.venue} · {event.city}
                        </p>
                      </div>

                      <Badge
                        label={event.status.replace('_', ' ')}
                        status={event.status}
                        variant="status"
                      />

                      {event.ticketUrl && event.status === 'upcoming' && (
                        <Button
                          href={event.ticketUrl}
                          external
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                        >
                          Tickets
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── MERCH TEASER ─── */}
      <section className="section-pad">
        <div className="container-kpr text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="max-w-2xl mx-auto"
          >
            <motion.p variants={staggerItem} className="eyebrow mb-4">
              Official Store
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display text-display text-text-primary mb-6"
            >
              GEAR UP
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-text-secondary mb-10 leading-relaxed"
            >
              T-shirts, posters, accessories — semua official KPR merch tersedia
              di sini.
            </motion.p>
            <motion.div variants={staggerItem}>
              <Button
                href="/merch"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                Shop Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}