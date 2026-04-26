'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Music, Youtube, Globe, X } from 'lucide-react';
import useSWR from 'swr';
import { albumsApi } from '@/lib/api';
import { staggerContainer, staggerItem, modalScale, overlayFade } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { AlbumCardSkeleton } from '@/components/ui/index';
import type { Album } from '@/types';

interface StreamingLink {
  label: string;
  url: string;
  icon: React.ReactNode;
  colorClass: string;
}

function getStreamingLinks(album: Album): StreamingLink[] {
  const links: StreamingLink[] = [];
  if (album.spotifyUrl)
    links.push({ label: 'Spotify', url: album.spotifyUrl, icon: <Music size={14} />, colorClass: 'hover:text-green-400 hover:border-green-400/40' });
  if (album.youtubeMusicUrl)
    links.push({ label: 'YouTube Music', url: album.youtubeMusicUrl, icon: <Youtube size={14} />, colorClass: 'hover:text-red-400 hover:border-red-400/40' });
  if (album.bandcampUrl)
    links.push({ label: 'Bandcamp', url: album.bandcampUrl, icon: <Globe size={14} />, colorClass: 'hover:text-blue-400 hover:border-blue-400/40' });
  if (album.appleMusicUrl)
    links.push({ label: 'Apple Music', url: album.appleMusicUrl, icon: <Music size={14} />, colorClass: 'hover:text-pink-400 hover:border-pink-400/40' });
  return links;
}

export function DiscographyClient({ initialAlbums }: { initialAlbums: Album[] }) {
  const [selected, setSelected] = useState<Album | null>(null);

  const { data, isLoading } = useSWR('albums', () => albumsApi.list(), {
    fallbackData: { data: initialAlbums },
  });

  const albums = data?.data ?? initialAlbums;

  return (
    <>
      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <AlbumCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {albums.map((album) => (
            <motion.button
              key={album.id}
              variants={staggerItem}
              onClick={() => setSelected(album)}
              className="group text-left flex flex-col gap-3 cursor-pointer"
              aria-label={`View ${album.title}`}
            >
              <div className="relative aspect-square overflow-hidden rounded-card border border-accent-dim/20 group-hover:border-accent/50 transition-all duration-300 shadow-card group-hover:shadow-card-hover">
                <Image
                  src={album.coverUrl}
                  alt={`${album.title} cover`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-accent-dim/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-mono text-xs text-white uppercase tracking-widest">
                    View →
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg text-text-primary group-hover:text-accent-bright transition-colors duration-200 leading-tight">
                  {album.title}
                </h3>
                <p className="font-mono text-xs text-text-muted mt-0.5">
                  {album.releaseYear}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Album detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="overlay"
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-md"
            />
            <motion.div
              key="modal"
              variants={modalScale}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50 bg-bg-surface border border-accent-dim/30 rounded-card overflow-auto max-h-[90vh] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary bg-bg-elevated rounded-sm transition-colors duration-200"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 p-6">
                {/* Cover */}
                <div className="shrink-0 relative w-full sm:w-52 aspect-square rounded-card overflow-hidden border border-accent-dim/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <Image
                    src={selected.coverUrl}
                    alt={`${selected.title} cover`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4 flex-1 min-w-0">
                  <div>
                    <p className="font-mono text-xs text-accent-bright uppercase tracking-widest mb-1">
                      {selected.releaseYear} · Kelompok Penerbang Roket
                    </p>
                    <h2 className="font-display text-4xl text-text-primary leading-none">
                      {selected.title}
                    </h2>
                  </div>

                  {selected.description && (
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {selected.description}
                    </p>
                  )}

                  <div className="mt-auto">
                    <p className="eyebrow mb-3">Listen On</p>
                    <div className="flex flex-wrap gap-2">
                      {getStreamingLinks(selected).map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-text-faint/30 text-text-muted rounded-sm transition-all duration-200 ${link.colorClass}`}
                        >
                          {link.icon}
                          {link.label}
                          <ExternalLink size={10} />
                        </a>
                      ))}
                      {getStreamingLinks(selected).length === 0 && (
                        <p className="text-text-muted text-xs font-mono">
                          No streaming links yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
