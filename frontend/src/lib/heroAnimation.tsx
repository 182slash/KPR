'use client';

import { useRef, useEffect } from 'react';

interface HoverRevealProps {
  frontSrc: string;
  backSrc: string;
  alt?: string;
  maskRadius?: number;
  className?: string;
}

export function HoverReveal({
  frontSrc,
  backSrc,
  alt = '',
  maskRadius = 168,
  className = '',
}: HoverRevealProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<{ x: number; y: number; opacity: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const isHovering = useRef(false);

  const buildMask = (points: { x: number; y: number; opacity: number }[]) => {
    if (points.length === 0) {
      return `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, black 100%)`;
    }

    // Build a CSS mask from multiple gradient layers — each trail point is one layer
    const layers = points.map(({ x, y, opacity }) => {
      const fade = Math.round(opacity * 100);
      const edgeFade = Math.min(100, fade + 20);
      return `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 0%, transparent ${fade - 20 < 0 ? 0 : fade - 20}%, black ${edgeFade}%)`;
    });

    return layers.join(', ');
  };

  const animate = () => {
    // Fade out trail points over time
    trailRef.current = trailRef.current
      .map((p) => ({ ...p, opacity: p.opacity - 0.03 }))
      .filter((p) => p.opacity > 0);

    if (frontRef.current) {
      frontRef.current.style.webkitMaskImage = buildMask(trailRef.current);
      frontRef.current.style.maskImage = buildMask(trailRef.current);
    }

    if (trailRef.current.length > 0 || isHovering.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new point at full opacity, keep last 20 points as trail
    trailRef.current = [{ x, y, opacity: 1 }, ...trailRef.current.slice(0, 19)];

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    // Trail fades out naturally via animate loop
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Back image — band member, always visible underneath */}
      <img
        src={backSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '50% 10%' }}
      />

      {/* Front image — astronaut suit, smoke trail mask */}
      <div
        ref={frontRef}
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, black 100%)`,
          maskImage: `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, black 100%)`,
        }}
      >
        <img
          src={frontSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 10%' }}
        />
      </div>
    </div>
  );
}