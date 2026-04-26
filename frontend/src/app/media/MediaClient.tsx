'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';
import useSWR from 'swr';
import { mediaApi } from '@/lib/api';
import { staggerContainer, staggerItem, overlayFade, modalScale } from '@/lib/motion';
import type { Media } from '@/types';

const STATIC_PHOTOS: Media[] = [
  { id: '1', type: 'photo', title: 'Live at Hammersonic', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', isPublished: true, sortOrder: 0, createdAt: '2024-01-01' },
  { id: '2', type: 'photo', title: 'Studio Session', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80', isPublished: true, sortOrder: 1, createdAt: '2024-01-01' },
  { id: '3', type: 'photo', title: 'Backstage', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80', isPublished: true, sortOrder: 2, createdAt: '2024-01-01' },
  { id: '4', type: 'photo', title: 'Rehearsal', url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80', isPublished: true, sortOrder: 3, createdAt: '2024-01-01' },
  { id: '5', type: 'photo', title: 'Crowd Shot', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80', isPublished: true, sortOrder: 4, createdAt: '2024-01-01' },
  { id: '6', type: 'photo', title: 'Gear Setup', url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80', isPublished: true, sortOrder: 5, createdAt: '2024-01-01' },
  { id: '7', type: 'photo', title: 'Stage Lights', url: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80', isPublished: true, sortOrder: 6, createdAt: '2024-01-01' },
  { id: '8', type: 'photo', title: 'Band Portrait', url: 'https://images.unsplash.com/photo-1446941303997-31a27d3f7f63?w=800&q=80', isPublished: true, sortOrder: 7, createdAt: '2024-01-01' },
];

const VIDEOS = [
  { id: 'v1', title: 'KOMA — Official Music Video', youtubeId: 'dQw4w9WgXcQ', description: 'Official MV dari album KOMA (2024)' },
  { id: 'v2', title: 'Live at Hammersonic 2024', youtubeId: 'dQw4w9WgXcQ', description: 'Full set recording' },
  { id: 'v3', title: 'Galaksi Palapa — Studio Documentary', youtubeId: 'dQw4w9WgXcQ', description: 'Behind the scenes rekaman album' },
];

type MediaTab = 'photos' | 'videos' | 'music';

export function MediaClient() {
  const [tab, setTab] = useState<MediaTab>('photos');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const { data } = useSWR('media-photos', () => mediaApi.list('photo'), {
    fallbackData: { data: STATIC_PHOTOS },
  });

  const photos = data?.data ?? STATIC_PHOTOS;

  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length));

  const tabs: { key: MediaTab; label: string }[] = [
    { key: 'photos', label: 'Photos' },
    { key: 'videos', label: 'Videos' },
    { key: 'music', label: 'Music' },
  ];

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 mb-10 border-b border-accent-dim/20">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`font-heading font-semibold text-sm uppercase tracking-wider px-5 py-3 border-b-2 transition-all duration-200 -mb-px ${
              tab === t.key
                ? 'border-accent-bright text-accent-bright'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PHOTOS */}
        {tab === 'photos' && (
          <motion.div
            key="photos"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={staggerContainer}
            className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
          >
            {photos.map((photo, idx) => (
              <motion.button
                key={photo.id}
                variants={staggerItem}
                onClick={() => setLightboxIdx(idx)}
                className="group relative w-full break-inside-avoid overflow-hidden rounded-card border border-accent-dim/20 hover:border-accent/40 transition-colors duration-300 block"
                aria-label={`View photo: ${photo.title ?? idx + 1}`}
              >
                <div className="relative w-full" style={{ aspectRatio: idx % 3 === 0 ? '3/4' : '1/1' }}>
                  <Image
                    src={photo.url}
                    alt={photo.title ?? `Photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-bg-base/20 group-hover:bg-bg-base/0 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-bg-base/60 backdrop-blur-sm flex items-center justify-center">
                      <ExternalLink size={16} className="text-white" />
                    </div>
                  </div>
                </div>
                {photo.title && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-bg-base/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-mono text-xs text-text-secondary truncate">{photo.title}</p>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* VIDEOS */}
        {tab === 'videos' && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {VIDEOS.map((video) => (
              <div key={video.id} className="flex flex-col gap-3">
                <div className="relative aspect-video rounded-card overflow-hidden border border-accent-dim/20 bg-bg-surface group">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-bg-base/40 group-hover:bg-bg-base/20 transition-colors duration-300" />
                  <a
                    href={`https://youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Watch ${video.title}`}
                  >
                    <div className="w-16 h-16 rounded-full bg-accent/80 hover:bg-accent transition-colors duration-200 flex items-center justify-center shadow-glow">
                      <Play size={24} className="text-white ml-1" fill="white" />
                    </div>
                  </a>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm text-text-primary">{video.title}</h3>
                  <p className="font-mono text-xs text-text-muted mt-0.5">{video.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* MUSIC */}
        {tab === 'music' && (
          <motion.div
            key="music"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="eyebrow mb-4">Spotify</p>
              <iframe
                src="https://open.spotify.com/embed/artist/7cWBaAVWtjH0fIbbBBQLao?utm_source=generator&theme=0"
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-card border border-accent-dim/20"
                title="KPR on Spotify"
              />
            </div>
            <div>
              <p className="eyebrow mb-4">Bandcamp</p>
              <div className="border border-accent-dim/20 rounded-card p-8 text-center">
                <p className="text-text-muted mb-4">Listen and support us directly on Bandcamp</p>
                <a
                  href="https://kelompokpenerbangroket.bandcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-heading font-semibold text-sm uppercase tracking-wider text-accent-bright hover:text-accent-glow transition-colors duration-200"
                >
                  Open Bandcamp <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <>
            <motion.div
              key="lb-bg"
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-bg-base/95 backdrop-blur-lg"
              onClick={closeLightbox}
            />
            <motion.div
              key="lb-content"
              variants={modalScale}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-4 z-50 flex flex-col items-center justify-center"
            >
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary bg-bg-surface/80 rounded-sm"
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>

              {/* Image */}
              <div className="relative w-full max-w-4xl max-h-[80vh] aspect-[4/3]">
                <Image
                  src={photos[lightboxIdx].url}
                  alt={photos[lightboxIdx].title ?? `Photo ${lightboxIdx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Caption */}
              {photos[lightboxIdx].title && (
                <p className="font-mono text-xs text-text-muted mt-4">{photos[lightboxIdx].title}</p>
              )}

              {/* Nav */}
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary bg-bg-surface/80 rounded-sm"
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary bg-bg-surface/80 rounded-sm"
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>

              <p className="absolute bottom-2 font-mono text-xs text-text-faint">
                {lightboxIdx + 1} / {photos.length}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
