import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';
import { Instagram, Youtube, Music2, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Booking',
  description:
    'Hubungi Kelompok Penerbang Roket untuk booking show, kolaborasi, press, atau pertanyaan lainnya.',
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-[72px] relative overflow-hidden min-h-[40vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-surface/40 to-bg-base" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_40%,rgba(32,96,160,0.08),transparent)]" />
        <div className="container-kpr relative z-10 pb-16 pt-24">
          <p className="eyebrow mb-4">Get In Touch</p>
          <h1 className="font-display text-hero text-text-primary leading-none">CONTACT</h1>
        </div>
      </section>

      <section className="section-pad border-t border-accent-dim/20">
        <div className="container-kpr">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Left: info */}
            <div className="lg:col-span-2">
              <p className="eyebrow mb-5">Reach Us</p>

              <div className="space-y-8">
                <div>
                  <p className="font-heading font-semibold text-sm uppercase tracking-wider text-text-secondary mb-3">
                    Booking & Management
                  </p>
                  <a
                    href="mailto:booking@kpr.band"
                    className="flex items-center gap-2 text-accent-bright hover:text-accent-glow transition-colors duration-200"
                  >
                    <Mail size={14} />
                    booking@kpr.band
                  </a>
                </div>

                <div>
                  <p className="font-heading font-semibold text-sm uppercase tracking-wider text-text-secondary mb-3">
                    Press & Media
                  </p>
                  <a
                    href="mailto:press@kpr.band"
                    className="flex items-center gap-2 text-accent-bright hover:text-accent-glow transition-colors duration-200"
                  >
                    <Mail size={14} />
                    press@kpr.band
                  </a>
                </div>

                <div>
                  <p className="font-heading font-semibold text-sm uppercase tracking-wider text-text-secondary mb-3">
                    Social Media
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/kpr' },
                      { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/kpr' },
                      { icon: Music2, label: 'Spotify', href: 'https://open.spotify.com/artist/kpr' },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                      >
                        <s.icon size={14} className="text-accent" />
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="border border-accent-dim/20 rounded-card p-5">
                  <p className="font-mono text-xs text-accent-bright uppercase tracking-widest mb-2">
                    Response Time
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Kami berusaha membalas semua pesan dalam 2–3 hari kerja.
                    Untuk booking urgent, hubungi langsung via email.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <p className="eyebrow mb-5">Booking / Inquiry Form</p>
              <ContactClient />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
