'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ease } from '@/lib/motion';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HeroScrollValues {
  scrollYProgress: MotionValue<number>;
  starsY: MotionValue<string>;
  rocketY: MotionValue<string>;
  rocketOpacity: MotionValue<number>;
  nameOpacity: MotionValue<number>;
  nameY: MotionValue<string>;
  tagOpacity: MotionValue<number>;
  tagY: MotionValue<string>;
  sectionOpacity: MotionValue<number>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useHeroScroll(ref: React.RefObject<HTMLElement>): HeroScrollValues {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const starsY        = useTransform(scrollYProgress, [0, 1],   ['0%',   '60%']);
  const rocketY       = useTransform(scrollYProgress, [0, 1],   ['0%',  '-80%']);
  const rocketOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const nameOpacity   = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const nameY         = useTransform(scrollYProgress, [0, 0.3], ['0%', '-10%']);
  const tagOpacity    = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const tagY          = useTransform(scrollYProgress, [0.2, 0.5], ['20%', '0%']);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return {
    scrollYProgress,
    starsY,
    rocketY,
    rocketOpacity,
    nameOpacity,
    nameY,
    tagOpacity,
    tagY,
    sectionOpacity,
  };
}

// ─── Star field ───────────────────────────────────────────────────────────────

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

interface StarFieldProps {
  starsY: MotionValue<string>;
  count?: number;
}

export function StarField({ starsY, count = 80 }: StarFieldProps) {
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ y: starsY }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </motion.div>
  );
}

// ─── Rocket ───────────────────────────────────────────────────────────────────

interface RocketProps {
  rocketY: MotionValue<string>;
  rocketOpacity: MotionValue<number>;
}

export function Rocket({ rocketY, rocketOpacity }: RocketProps) {
  return (
    <motion.div
      className="absolute bottom-28 z-10 text-accent-bright/70"
      style={{ y: rocketY, opacity: rocketOpacity }}
    >
      <svg
        width="48"
        height="80"
        viewBox="0 0 48 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Body */}
        <path
          d="M24 4 C14 4 8 20 8 36 L8 54 L40 54 L40 36 C40 20 34 4 24 4Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Nose cone */}
        <path d="M24 0 L16 18 L32 18Z" fill="currentColor" />
        {/* Window */}
        <circle
          cx="24"
          cy="34"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* Left fin */}
        <path d="M8 44 L2 58 L8 54Z" fill="currentColor" opacity="0.7" />
        {/* Right fin */}
        <path d="M40 44 L46 58 L40 54Z" fill="currentColor" opacity="0.7" />
        {/* Exhaust glow */}
        <path d="M16 54 Q18 64 24 70 Q30 64 32 54Z" fill="currentColor" opacity="0.3" />
        {/* Flame */}
        <path d="M19 54 Q21 62 24 67 Q27 62 29 54Z" fill="#f59e0b" opacity="0.7" />
      </svg>
    </motion.div>
  );
}

// ─── Space background ─────────────────────────────────────────────────────────

export function SpaceBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050810] via-[#0a0e1a] to-bg-base" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(32,96,160,0.14),transparent)]" />
    </>
  );
}

// ─── Scroll-driven text swap ──────────────────────────────────────────────────

interface HeroTextSwapProps {
  nameOpacity: MotionValue<number>;
  nameY: MotionValue<string>;
  tagOpacity: MotionValue<number>;
  tagY: MotionValue<string>;
  children: React.ReactNode; // band name markup passed from page.tsx
}

export function HeroTextSwap({
  nameOpacity,
  nameY,
  tagOpacity,
  tagY,
  children,
}: HeroTextSwapProps) {
  return (
    <div className="relative">
      {/* Band name — fades out on scroll */}
      <motion.div style={{ opacity: nameOpacity, y: nameY }}>
        {children}
      </motion.div>

      {/* Tagline — fades in on scroll */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: tagOpacity, y: tagY }}
      >
        <p className="font-display text-4xl sm:text-6xl text-text-primary/80 text-shadow-glow select-none leading-tight text-center">
          Touring the galaxy
          <br />
          <span className="text-accent-bright">since… idk</span>
        </p>
      </motion.div>
    </div>
  );
}