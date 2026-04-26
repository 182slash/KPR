import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { Toaster } from 'react-hot-toast';
import { CartDrawer } from '@/components/features/CartDrawer';

export const viewport: Viewport = {
  themeColor: '#0a0a0e',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: {
    default: 'Kelompok Penerbang Roket | KPR',
    template: '%s | Kelompok Penerbang Roket',
  },
  description:
    'KPR — Kelompok Penerbang Roket. Acid rock, heavy metal, psychedelic dari Jakarta sejak 2011. Temukan musik, jadwal gig, merchandise, dan lebih.',
  keywords: [
    'Kelompok Penerbang Roket',
    'KPR',
    'band Jakarta',
    'acid rock Indonesia',
    'heavy metal Jakarta',
    'psychedelic rock',
    'KOMA album',
  ],
  authors: [{ name: 'Kelompok Penerbang Roket' }],
  creator: 'Kelompok Penerbang Roket',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kpr.band'
  ),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Kelompok Penerbang Roket',
    title: 'Kelompok Penerbang Roket | KPR',
    description:
      'Acid rock, heavy metal, psychedelic dari Jakarta sejak 2011.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kelompok Penerbang Roket',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kelompok Penerbang Roket | KPR',
    description:
      'Acid rock, heavy metal, psychedelic dari Jakarta sejak 2011.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-bg-base text-text-primary font-body antialiased">
        <GrainOverlay />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#101420',
              color: '#e0e0e0',
              border: '1px solid rgba(32,96,160,0.3)',
              borderRadius: '6px',
              fontFamily: 'var(--font-dm-sans)',
            },
            success: {
              iconTheme: { primary: '#4080c0', secondary: '#101420' },
            },
            error: {
              iconTheme: { primary: '#e05050', secondary: '#101420' },
            },
          }}
        />
      </body>
    </html>
  );
}
