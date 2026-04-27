import type { Metadata } from 'next';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/index';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Kelompok Penerbang Roket (KPR) adalah band acid rock, heavy metal, dan psychedelic dari Jakarta, berdiri sejak 2011. Anggota: John Paul Patton, Rey Marshall, I Gusti Vikranta.',
};

const MEMBERS = [
  {
    id: '1',
    name: 'John Paul Patton',
    role: 'Vocals / Bass',
    imageUrl: 'https://superlive.id/storage/supermusic/cover-1480313021-large.png',
    bio: 'Fondasi ritmis dan suara frontal KPR sejak awal terbentuk. Vokal raw, basline yang berat.',
  },
  {
    id: '2',
    name: 'Rey Marshall',
    role: 'Guitar / Backing Vocals',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80',
    bio: 'Arsitek riff dan solowork psychedelic KPR. Terinspirasi dari Page, Blackmore, Iommi.',
  },
  {
    id: '3',
    name: 'I Gusti Vikranta',
    role: 'Drums / Backing Vocals',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=80',
    bio: 'Mesin penggerak di balik groove dan power KPR. Permainan dinamis dari jazz hingga blastbeat.',
  },
];

const INFLUENCES = [
  'Led Zeppelin',
  'Deep Purple',
  'Black Sabbath',
  'Hawkwind',
  'Pink Floyd',
  'MC5',
  'Blue Cheer',
  'Cream',
];

const TIMELINE = [
  { year: '2011', event: 'Band terbentuk di Jakarta' },
  { year: '2015', event: 'Rilis EP perdana "Teriakan Bocah" & single "HAAI"' },
  { year: '2018', event: 'Album "Galaksi Palapa" — perjalanan psikedelik penuh' },
  { year: '2023', event: '"Aksioma" — statement album dengan produksi lebih masif' },
  { year: '2024', event: '"KOMA" — kembali ke akar, raw dan tanpa kompromi' },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-[72px] relative overflow-hidden min-h-[50vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-surface/60 to-bg-base" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_50%,rgba(32,96,160,0.08),transparent)]" />
        <div className="container-kpr relative z-10 pb-16 pt-24">
          <p className="eyebrow mb-4">The Band</p>
          <h1 className="font-display text-hero text-text-primary leading-none">
            ABOUT
          </h1>
        </div>
      </section>

      {/* ─── BIO ─── */}
      <section className="section-pad border-t border-accent-dim/20">
        <div className="container-kpr">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-3">
              <p className="eyebrow mb-5">Origin Story</p>
              <div className="space-y-5 text-text-secondary text-lg leading-relaxed">
                <p>
                  Kelompok Penerbang Roket lahir dari lorong-lorong Jakarta pada
                  2011 — tiga orang yang masing-masing membawa obsesi pada suara
                  berat, riff yang tebal, dan eksplorasi psikedelik. Nama itu
                  sendiri sebuah paradoks: roket yang melayang dengan kecepatan
                  ekstrem, namun dioperasikan oleh sekumpulan orang biasa.
                </p>
                <p>
                  Dibentuk dengan satu mandat: main sekeras yang bisa, sejujur
                  yang bisa. Tidak ada formula, tidak ada target pasar. Hanya
                  amplifier yang distorsi, drum yang dipukul dengan conviction,
                  dan lagu-lagu yang lahir dari keresahan dan eksitasi yang sama.
                </p>
                <p>
                  Sepuluh tahun lebih perjalanan, lima rekaman, ratusan panggung
                  — KPR tetap berpegang pada prinsip awal: musik yang berat
                  adalah bahasa yang paling jujur.
                </p>
              </div>
            </div>

            {/* Influences */}
            <div className="lg:col-span-2">
              <p className="eyebrow mb-5">Influences</p>
              <div className="flex flex-wrap gap-2">
                {INFLUENCES.map((inf) => (
                  <span
                    key={inf}
                    className="font-heading font-medium text-sm uppercase tracking-wider px-3 py-1.5 border border-accent/30 text-text-muted hover:text-text-primary hover:border-accent/60 transition-colors duration-200 rounded-sm"
                  >
                    {inf}
                  </span>
                ))}
              </div>

              {/* Quick stats */}
              <div className="mt-10 grid grid-cols-2 gap-6">
                {[
                  { value: '13+', label: 'Years Active' },
                  { value: '5', label: 'Releases' },
                  { value: 'JKT', label: 'Based In' },
                  { value: '3', label: 'Members' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-4xl text-accent-bright">
                      {stat.value}
                    </p>
                    <p className="font-mono text-xs text-text-muted uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MEMBERS ─── */}
      <section className="section-pad bg-bg-surface border-y border-accent-dim/20">
        <div className="container-kpr">
          <SectionHeader eyebrow="The Lineup" title="MEMBERS" />
          <AboutClient members={MEMBERS} />
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="section-pad">
        <div className="container-kpr max-w-3xl">
          <SectionHeader eyebrow="History" title="TIMELINE" />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-accent-dim/30" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex gap-8 items-start relative">
                  {/* Year */}
                  <div className="shrink-0 w-[52px] text-right">
                    <span className="font-mono text-xs text-accent-bright font-medium">
                      {item.year}
                    </span>
                  </div>
                  {/* Dot */}
                  <div className="shrink-0 w-3 h-3 rounded-full border-2 border-accent bg-bg-base mt-0.5 relative z-10" />
                  {/* Event */}
                  <p className="text-text-secondary leading-relaxed pt-0.5">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
