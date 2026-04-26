'use client';

import { useMemo } from 'react';
import { motion, MotionValue } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroScrollValues {
  starsY: MotionValue<string>;
  rocketY: MotionValue<string>;
  rocketOpacity: MotionValue<number>;
  nameOpacity: MotionValue<number>;
  nameY: MotionValue<string>;
  tagOpacity: MotionValue<number>;
  tagY: MotionValue<string>;
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

export function StarField({ starsY, count = 80 }: { starsY: MotionValue<string>; count?: number }) {
  const stars = useMemo(() => generateStars(count), [count]);
  return (
    <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: starsY }}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
        />
      ))}
    </motion.div>
  );
}

// ─── Rocket ───────────────────────────────────────────────────────────────────

export function Rocket({ rocketY, rocketOpacity }: { rocketY: MotionValue<string>; rocketOpacity: MotionValue<number> }) {
  return (
    <motion.div className="absolute bottom-28 z-10 text-accent-bright/70" style={{ y: rocketY, opacity: rocketOpacity }}>
      <svg width="48" height="80" viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M24 4 C14 4 8 20 8 36 L8 54 L40 54 L40 36 C40 20 34 4 24 4Z" fill="currentColor" opacity="0.9" />
        <path d="M24 0 L16 18 L32 18Z" fill="currentColor" />
        <circle cx="24" cy="34" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M8 44 L2 58 L8 54Z" fill="currentColor" opacity="0.7" />
        <path d="M40 44 L46 58 L40 54Z" fill="currentColor" opacity="0.7" />
        <path d="M16 54 Q18 64 24 70 Q30 64 32 54Z" fill="currentColor" opacity="0.3" />
        <path d="M19 54 Q21 62 24 67 Q27 62 29 54Z" fill="#f59e0b" opacity="0.7" />
      </svg>
    </motion.div>
  );
}

// ─── Tagline swap ─────────────────────────────────────────────────────────────

export function HeroTagline({ tagOpacity, tagY }: { tagOpacity: MotionValue<number>; tagY: MotionValue<string> }) {
  return (
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
  );
}