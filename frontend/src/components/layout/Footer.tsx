import Link from 'next/link';
import { Instagram, Youtube, Music2, Globe } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Discography', href: '/discography' },
  { label: 'Events', href: '/events' },
  { label: 'Merch', href: '/merch' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/kelompokpenerbangro ket',
    icon: Instagram,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@kelompokpenerbangr oket',
    icon: Youtube,
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/kpr',
    icon: Music2,
  },
  {
    label: 'Bandcamp',
    href: 'https://kelompokpenerbangroket.bandcamp.com',
    icon: Globe,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-surface border-t border-accent-dim/20 mt-auto">
      <div className="container-kpr py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-accent/60 mb-4">
                <span
                  className="font-display text-base text-accent-bright"
                  style={{ letterSpacing: '0.05em' }}
                >
                  KPR
                </span>
              </div>
              <p className="font-display text-xl text-text-primary leading-tight">
                KELOMPOK
                <br />
                PENERBANG ROKET
              </p>
            </div>
            <p className="font-body text-sm text-text-muted leading-relaxed max-w-xs">
              Acid rock · Hard rock · Heavy metal dari Jakarta, Indonesia.
              Berdiri sejak 2011.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-heading text-sm text-text-muted hover:text-text-primary transition-colors duration-200 uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + contact */}
          <div>
            <p className="eyebrow mb-5">Connect</p>
            <ul className="space-y-3 mb-6">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-bright transition-colors duration-200"
                  >
                    <s.icon size={14} />
                    <span className="font-heading uppercase tracking-wider">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-accent-dim/20 pt-5">
              <p className="text-xs text-text-muted font-mono mb-1">
                Booking & Management
              </p>
              <a
                href="mailto:booking@kpr.band"
                className="text-sm text-accent-bright hover:text-accent-glow transition-colors duration-200"
              >
                booking@kpr.band
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-accent-dim/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-faint">
            © {year} Kelompok Penerbang Roket. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="font-mono text-xs text-text-faint hover:text-text-muted transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-mono text-xs text-text-faint hover:text-text-muted transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
