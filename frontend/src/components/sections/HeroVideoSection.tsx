'use client';

import { useRef, useEffect, useState } from 'react';
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

// ─── Constants ────────────────────────────────────────────────────────────────
// Total scroll height of the hero wrapper — more = slower video scrub
const SCROLL_MULTIPLIER = 500; // vh units equivalent in px logic; actual px = 500vh

export default function HeroVideoSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    // ── Scroll handler ────────────────────────────────────────────────────────
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const video = videoRef.current;
        const wrapper = wrapperRef.current;
        if (!video || !wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperTop = wrapper.offsetTop;
        const wrapperHeight = wrapper.offsetHeight;
        const viewportHeight = window.innerHeight;

        // How far into the wrapper has the user scrolled?
        // scrollY - wrapperTop gives pixels scrolled past the wrapper's top
        const scrolledPast = window.scrollY - wrapperTop;

        // Total scrollable distance within this wrapper (wrapper height minus one viewport)
        const totalScrollDistance = wrapperHeight - viewportHeight;

        if (totalScrollDistance <= 0) return;

        // Clamp progress 0 → 1
        const progress = Math.min(Math.max(scrolledPast / totalScrollDistance, 0), 1);

        // Scrub video to matching frame
        if (video.duration && isFinite(video.duration)) {
          const targetTime = progress * video.duration;
          // Only set if meaningfully different to avoid redundant decoding
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
          }
        }

        lastScrollY.current = window.scrollY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Run once on mount to set initial frame
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoReady]);

  return (
    /**
     * WRAPPER — 500vh tall.
     * This is what actually takes up scroll space.
     * The sticky child stays pinned to viewport while this scrolls past.
     */
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: '500vh' }}
      aria-label="Hero"
    >
      {/**
       * STICKY CONTAINER — viewport-height, sticks to top.
       * Everything visible lives here.
       */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* ── Video background ─────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/{fonts,images,icons}/hero-video.mp4"
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={() => {
            setVideoReady(true);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
          onError={() => setVideoError(true)}
        />

        {/* ── Fallback gradient background (shown while video loads or on error) ── */}
        <div
          className="absolute inset-0 z-[1] transition-opacity duration-700 pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-bg-base" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(32,96,160,0.12),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #4080c0 0px, #4080c0 1px, transparent 1px, transparent 80px)',
            }}
          />
        </div>

        {/* ── Dark overlay — keeps text readable over video ─────────────────── */}
        <div
          className="absolute inset-0 z-[2] bg-black/50"
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

        {/* ── Hero content — sits above video + overlay ─────────────────────── */}
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

          {/* Scroll progress indicator — fades out as user scrolls */}
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

        {/* ── Scroll progress bar — thin line at bottom of hero ─────────────── */}
        <ScrollProgressBar wrapperRef={wrapperRef} />
      </div>
    </div>
  );
}

// ─── Scroll progress bar subcomponent ────────────────────────────────────────
function ScrollProgressBar({
  wrapperRef,
}: {
  wrapperRef: React.RefObject<HTMLDivElement>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      const bar = barRef.current;
      if (!wrapper || !bar) return;

      const scrolledPast = window.scrollY - wrapper.offsetTop;
      const totalScrollDistance = wrapper.offsetHeight - window.innerHeight;
      const progress =
        totalScrollDistance > 0
          ? Math.min(Math.max(scrolledPast / totalScrollDistance, 0), 1)
          : 0;

      bar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [wrapperRef]);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full bg-accent-bright origin-left"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
}