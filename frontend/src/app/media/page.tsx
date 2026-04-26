import type { Metadata } from 'next';
import { MediaClient } from './MediaClient';

export const metadata: Metadata = {
  title: 'Media',
  description:
    'Foto, video, dan musik Kelompok Penerbang Roket. Galeri resmi KPR.',
};

export default function MediaPage() {
  return (
    <>
      <section className="pt-[72px] relative overflow-hidden min-h-[40vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-surface/40 to-bg-base" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_60%_30%,rgba(32,96,160,0.07),transparent)]" />
        <div className="container-kpr relative z-10 pb-16 pt-24">
          <p className="eyebrow mb-4">Gallery</p>
          <h1 className="font-display text-hero text-text-primary leading-none">MEDIA</h1>
        </div>
      </section>

      <section className="section-pad border-t border-accent-dim/20">
        <div className="container-kpr">
          <MediaClient />
        </div>
      </section>
    </>
  );
}
