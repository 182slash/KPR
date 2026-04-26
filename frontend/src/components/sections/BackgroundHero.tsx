'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { letterReveal } from '@/lib/motion';

// ─── Band name letter-reveal ──────────────────────────────────────────────────
function HeroLetters({
  text,
  delay = 0,
  className = '',
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`flex overflow-hidden ${className}`}>
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

export default function BackgroundHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
      aria-label="Hero"
    >
      {/* ── Image background ─────────────────────────────────────────────── */}
      <img
        src="/{fonts,images,icons}/herobackground.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      />

      {/* ── Dark overlay — keeps text readable ───────────────────────────── */}
      <div
        className="absolute inset-0 z-[2] bg-black/70"
        aria-hidden="true"
      />

      {/* ── Additional vignette — darkens edges for cinematic feel ─────────── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Decorative corner tick marks ─────────────────────────────────── */}
      <div className="absolute top-24 left-4 sm:left-8 z-10 flex flex-col gap-1">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.06, duration: 0.4 }}
            className="h-px bg-white/30 origin-left"
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
            className="h-px bg-white/30 origin-right"
            style={{ width: `${20 - i * 2}px` }}
          />
        ))}
      </div>

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="eyebrow mb-8"
        >
          Jakarta · Est. 2011
        </motion.p>

        {/* Band name */}
        <h1 className="font-display text-hero text-white leading-none select-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
          <HeroLetters text="KELOMPOK" delay={0.3} />
          <HeroLetters text="PENERBANG" delay={0.6} />
          <HeroLetters
            text="ROKET"
            delay={0.9}
            className="text-accent-bright"
          />
        </h1>

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
                className="font-mono text-xs text-white/60 uppercase tracking-widest border border-white/20 px-3 py-1 rounded-sm backdrop-blur-sm"
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
          <Button
            href="/discography"
            size="lg"
            leftIcon={<Play size={16} />}
          >
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors duration-200"
          aria-label="Scroll to explore"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}