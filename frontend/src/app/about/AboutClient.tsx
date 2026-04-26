'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import type { BandMember } from '@/types';

export function AboutClient({ members }: { members: BandMember[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={staggerContainer}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {members.map((member) => (
        <motion.div
          key={member.id}
          variants={staggerItem}
          className="group flex flex-col gap-4"
        >
          {/* Photo */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-accent-dim/20 group-hover:border-accent/40 transition-colors duration-300">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Cold overlay */}
            <div className="absolute inset-0 bg-film-cool/30 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500" />
            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-bg-base to-transparent" />
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display text-2xl text-text-primary">
              {member.name}
            </h3>
            <p className="font-mono text-xs text-accent-bright uppercase tracking-widest mt-1 mb-3">
              {member.role}
            </p>
            {member.bio && (
              <p className="text-sm text-text-muted leading-relaxed">
                {member.bio}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
