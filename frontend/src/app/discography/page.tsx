import type { Metadata } from 'next';
import { DiscographyClient } from './DiscographyClient';

export const metadata: Metadata = {
  title: 'Discography',
  description:
    'Seluruh diskografi Kelompok Penerbang Roket: Teriakan Bocah (2015), HAAI (2015), Galaksi Palapa (2018), Aksioma (2023), KOMA (2024).',
};

// Fallback static data — replaced at runtime from API
const STATIC_ALBUMS = [
  {
    id: '1',
    slug: 'koma',
    title: 'KOMA',
    releaseYear: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80',
    description: 'Kembali ke akar. Raw, berat, tanpa kompromi.',
    spotifyUrl: '#',
    bandcampUrl: '#',
    youtubeMusicUrl: '#',
    appleMusicUrl: null,
    isPublished: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    slug: 'aksioma',
    title: 'Aksioma',
    releaseYear: 2023,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80',
    description: 'Statement album dengan produksi lebih masif.',
    spotifyUrl: '#',
    bandcampUrl: '#',
    youtubeMusicUrl: null,
    appleMusicUrl: null,
    isPublished: true,
    createdAt: '2023-01-01',
  },
  {
    id: '3',
    slug: 'galaksi-palapa',
    title: 'Galaksi Palapa',
    releaseYear: 2018,
    coverUrl: 'https://images.unsplash.com/photo-1446941303997-31a27d3f7f63?w=600&q=80',
    description: 'Perjalanan psikedelik yang dalam.',
    spotifyUrl: '#',
    bandcampUrl: '#',
    youtubeMusicUrl: null,
    appleMusicUrl: null,
    isPublished: true,
    createdAt: '2018-01-01',
  },
  {
    id: '4',
    slug: 'haai',
    title: 'HAAI',
    releaseYear: 2015,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    description: 'EP kedua — energi liar dan mentah.',
    spotifyUrl: '#',
    bandcampUrl: '#',
    youtubeMusicUrl: null,
    appleMusicUrl: null,
    isPublished: true,
    createdAt: '2015-06-01',
  },
  {
    id: '5',
    slug: 'teriakan-bocah',
    title: 'Teriakan Bocah',
    releaseYear: 2015,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&q=80',
    description: 'Debut EP yang menghentak Jakarta.',
    spotifyUrl: '#',
    bandcampUrl: '#',
    youtubeMusicUrl: null,
    appleMusicUrl: null,
    isPublished: true,
    createdAt: '2015-01-01',
  },
];

export default function DiscographyPage() {
  return (
    <>
      {/* Hero header */}
      <section className="pt-[72px] relative overflow-hidden min-h-[40vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-surface/40 to-bg-base" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_40%,rgba(32,96,160,0.07),transparent)]" />
        <div className="container-kpr relative z-10 pb-16 pt-24">
          <p className="eyebrow mb-4">Complete Works</p>
          <h1 className="font-display text-hero text-text-primary leading-none">
            DISCOGRAPHY
          </h1>
        </div>
      </section>

      <section className="section-pad border-t border-accent-dim/20">
        <div className="container-kpr">
          <DiscographyClient initialAlbums={STATIC_ALBUMS as any} />
        </div>
      </section>
    </>
  );
}
