import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#0a0a0e',
        'bg-surface': '#101420',
        'bg-elevated': '#161c2e',
        'bg-overlay': '#1e2640',
        // Accent spectrum
        'accent-dim': '#1a4070',
        'accent': '#2060a0',
        'accent-mid': '#4080c0',
        'accent-bright': '#60a0e0',
        'accent-glow': '#80c0ff',
        // Text
        'text-primary': '#e0e0e0',
        'text-secondary': '#a0b4c0',
        'text-muted': '#7090a8',
        'text-faint': '#405060',
        // Semantic
        'success': '#2d7a4f',
        'warning': '#7a5a1a',
        'error': '#7a2020',
        'error-bright': '#e05050',
        // Film aesthetic
        'film-cool': '#0d1520',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        heading: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3.5rem, 11vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'section': '96px',
        'nav': '72px',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(32,96,160,0.1)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.8), 0 0 0 1px rgba(64,128,192,0.3)',
        'glow': '0 0 20px rgba(64,128,192,0.4), 0 0 60px rgba(32,96,160,0.15)',
        'glow-sm': '0 0 10px rgba(64,128,192,0.3)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grain': 'grain 0.5s steps(1) infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -1%)' },
          '50%': { transform: 'translate(-3%, 3%)' },
          '60%': { transform: 'translate(2%, -4%)' },
          '70%': { transform: 'translate(-4%, 2%)' },
          '80%': { transform: 'translate(3%, -2%)' },
          '90%': { transform: 'translate(-2%, 3%)' },
        },
      },
      borderRadius: {
        'card': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
