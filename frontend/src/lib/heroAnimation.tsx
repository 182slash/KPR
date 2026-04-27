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
  maskRadius = 718,
  className = '',
}: HoverRevealProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frontRef.current || !containerRef.current) return;

    // Use viewport coords mapped to the front div (which is fixed-position aware)
    const rect = frontRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    frontRef.current.style.webkitMaskImage = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 0%, transparent 20%, rgba(0,0,0,0.5) 55%, black 100%)`;
    frontRef.current.style.maskImage = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, transparent 0%, transparent 20%, rgba(0,0,0,0.5) 55%, black 100%)`;
  };

  const handleMouseLeave = () => {
    if (!frontRef.current) return;
    frontRef.current.style.webkitMaskImage = 'none';
    frontRef.current.style.maskImage = 'none';
    // Instantly hide front = back fully visible on leave... 
    // flip: show front fully on leave instead:
    frontRef.current.style.webkitMaskImage = `radial-gradient(circle ${maskRadius}px at -9999px -9999px, transparent 0%, black 1%)`;
    frontRef.current.style.maskImage = `radial-gradient(circle ${maskRadius}px at -9999px -9999px, transparent 0%, black 1%)`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative cursor-crosshair ${className}`}  // ← removed overflow-hidden
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={backSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '50% 10%' }}
      />

      <div
        ref={frontRef}
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(circle ${maskRadius}px at -9999px -9999px, transparent 0%, black 1%)`,
          maskImage: `radial-gradient(circle ${maskRadius}px at -9999px -9999px, transparent 0%, black 1%)`,
        }}
      >
        <img
          src={frontSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 10%', filter: 'brightness(0.8)' }}
        />
      </div>
    </div>
  );
}