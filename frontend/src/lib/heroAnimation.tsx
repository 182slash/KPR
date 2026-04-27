'use client';

import { useRef } from 'react';

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
  maskRadius = 120,
  className = '',
}: HoverRevealProps) {
  const frontRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (frontRef.current) {
      frontRef.current.style.webkitMaskImage = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 0%, transparent 40%, black 80%)`;
      frontRef.current.style.maskImage = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 0%, transparent 40%, black 80%)`;
    }
  };

  const handleMouseLeave = () => {
    if (frontRef.current) {
      frontRef.current.style.webkitMaskImage = `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, transparent 40%, black 80%)`;
      frontRef.current.style.maskImage = `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, transparent 40%, black 80%)`;
    }
  };

  return (
    <div
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Back image — band member, always visible underneath */}
      <img
        src={backSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '50% 10%' }}
      />

      {/* Front image — astronaut suit, mask reveals back on hover */}
      <div
        ref={frontRef}
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, transparent 40%, black 80%)`,
          maskImage: `radial-gradient(circle ${maskRadius}px at -999px -999px, transparent 0%, transparent 40%, black 80%)`,
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