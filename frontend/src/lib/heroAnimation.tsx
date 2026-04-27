'use client';

import { useRef } from 'react';

interface HoverRevealProps {
  frontSrc: string;
  backSrc: string;
  alt?: string;
  maskRadius?: number;
  className?: string;
  objectPosition = 'center',
}

export function HoverReveal({
  frontSrc,
  backSrc,
  alt = '',
  maskRadius = 120,
  className = '',
  objectPosition = 'center',
}: HoverRevealProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (frontRef.current) {
      frontRef.current.style.webkitMaskImage = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 100%, black 100%)`;
      frontRef.current.style.maskImage = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 100%, black 100%)`;
    }
    if (cursorRef.current) {
      cursorRef.current.style.left = `${x}px`;
      cursorRef.current.style.top = `${y}px`;
    }
  };

  const handleMouseLeave = () => {
    if (frontRef.current) {
      frontRef.current.style.webkitMaskImage = `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 100%, black 100%)`;
      frontRef.current.style.maskImage = `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 100%, black 100%)`;
    }
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '0';
    }
  };

  const handleMouseEnter = () => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '1';
    }
  };

  return (
    <div
      className={`relative overflow-hidden cursor-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Back image — band member, always visible underneath */}
      <img
        src={backSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition }}
      />

      {/* Front image — astronaut suit, revealed by mask */}
      <div
        ref={frontRef}
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 100%, black 100%)`,
          maskImage: `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 100%, black 100%)`,
        }}
      >
        <img
          src={frontSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ objectPosition }}
        />
      </div>

      {/* Custom cursor ring */}
      <div
        ref={cursorRef}
        className="absolute pointer-events-none rounded-full border border-white/40 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200"
        style={{
          width: maskRadius * 2,
          height: maskRadius * 2,
        }}
      />
    </div>
  );
}