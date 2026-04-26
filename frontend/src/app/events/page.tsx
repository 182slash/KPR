import type { Metadata } from 'next';
import { EventsClient } from './EventsClient';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Jadwal gig dan konser Kelompok Penerbang Roket. Temukan tiket untuk show KPR terdekat di kota kamu.',
};

export default function EventsPage() {
  return (
    <>
      <section className="pt-[72px] relative overflow-hidden min-h-[40vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-surface/40 to-bg-base" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_10%_60%,rgba(32,96,160,0.08),transparent)]" />
        <div className="container-kpr relative z-10 pb-16 pt-24">
          <p className="eyebrow mb-4">Live</p>
          <h1 className="font-display text-hero text-text-primary leading-none">
            EVENTS
          </h1>
        </div>
      </section>

      <section className="section-pad border-t border-accent-dim/20">
        <div className="container-kpr">
          <EventsClient />
        </div>
      </section>
    </>
  );
}
