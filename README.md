# Kelompok Penerbang Roket — Official Website

> Acid rock · Hard rock · Heavy metal · Psychedelic rock  
> Jakarta, Indonesia · Est. 2011

[![CI](https://github.com/182slash/Bataknese/actions/workflows/ci.yml/badge.svg)](https://github.com/182slash/Bataknese/actions/workflows/ci.yml)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL (via Supabase) |
| Media | Cloudinary (image optimization + storage) |
| Payments | Midtrans (GoPay, QRIS, Bank Transfer, Credit Card) |
| Email | Resend |
| Frontend Deploy | Vercel |
| Backend Deploy | DigitalOcean App Platform |

---

## Monorepo Structure

```
kelompok-penerbang-roket-web/
├── frontend/          # Next.js 14 App Router
├── backend/           # Express REST API
├── scripts/           # Dev utilities
├── .github/workflows/ # CI/CD
├── .do/               # DigitalOcean App spec
└── package.json       # npm workspaces root
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database (Supabase recommended)
- Cloudinary account
- Midtrans sandbox account
- Resend account

### 1. Clone & setup

```bash
git clone https://github.com/182slash/Bataknese.git
cd Bataknese
chmod +x scripts/setup.sh
./scripts/setup.sh
```

The setup script will:
- Install all npm dependencies (frontend + backend)
- Copy `.env.example` → `.env.local` / `.env`
- Generate Prisma client
- Run database migrations
- Seed initial data (albums, events, products, admin user)

### 2. Configure environment variables

**Frontend** — `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
NEXT_PUBLIC_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
```

**Backend** — `backend/.env`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
JWT_SECRET=<openssl rand -base64 64>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@kpr.band
EMAIL_BOOKING_TO=booking@kpr.band
```

### 3. Run in development

```bash
# Terminal 1 — API server
cd backend && npm run dev
# → http://localhost:4000

# Terminal 2 — Next.js frontend
cd frontend && npm run dev
# → http://localhost:3000

# Or both at once from root
npm run dev
```

### 4. Open Prisma Studio (database GUI)

```bash
cd backend && npx prisma studio
# → http://localhost:5555
```

---

## Database Management

```bash
cd backend

# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (dev only — destroys all data)
npx prisma migrate reset

# Seed database
npm run db:seed

# Open Prisma Studio
npx prisma studio
```

---

## API Reference

Base URL: `http://localhost:4000/v1` (dev) | `https://api.kpr.band/v1` (prod)

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/albums` | List all albums |
| `GET` | `/albums/:slug` | Get album detail |
| `GET` | `/events` | List events (`?upcoming=true&city=Jakarta&limit=3`) |
| `GET` | `/events/:id` | Get event detail |
| `GET` | `/products` | List products (`?category=apparel&featured=true`) |
| `GET` | `/products/:slug` | Get product detail |
| `POST` | `/orders` | Create order + get Midtrans snap token |
| `POST` | `/orders/midtrans-webhook` | Midtrans payment webhook |
| `GET` | `/media` | List media (`?type=photo&type=video`) |
| `POST` | `/contact` | Submit booking/contact form |
| `GET` | `/health` | Health check |

### Admin Endpoints (JWT required)

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/login` | Admin login → JWT |
| `GET` | `/auth/me` | Get current admin |
| `POST` | `/auth/change-password` | Change admin password |
| `POST` | `/albums` | Create album |
| `PUT` | `/albums/:id` | Update album |
| `DELETE` | `/albums/:id` | Delete album |
| `POST` | `/events` | Create event |
| `PUT` | `/events/:id` | Update event |
| `DELETE` | `/events/:id` | Delete event |
| `POST` | `/products` | Create product |
| `PUT` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |
| `GET` | `/orders` | List orders |
| `PUT` | `/orders/:id/status` | Update order status |
| `POST` | `/media` | Add media record |
| `DELETE` | `/media/:id` | Delete media + Cloudinary |
| `POST` | `/upload/image` | Upload image to Cloudinary |
| `DELETE` | `/upload/image/:publicId` | Delete from Cloudinary |
| `GET` | `/contact` | List contact messages |
| `PATCH` | `/contact/:id/read` | Mark message as read |

---

## Deployment

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select `182slash/Bataknese` repository
3. Set **Root Directory** to `frontend/`
4. Framework: `Next.js` (auto-detected)
5. Add all `NEXT_PUBLIC_*` environment variables
6. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL=https://kpr.band`
7. Deploy → set custom domain `kpr.band`

```bash
# Or deploy via Vercel CLI
cd frontend
npx vercel --prod
```

### Backend → DigitalOcean App Platform

1. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps) → Create App
2. Connect GitHub → select `182slash/Bataknese`
3. Source directory: `backend/`
4. DO detects Dockerfile automatically
5. Add all environment variables from `backend/.env` (mark secrets as Secret)
6. Set custom domain `api.kpr.band`
7. Deploy

```bash
# Or deploy via doctl CLI
doctl apps create --spec .do/app.yaml
```

### Post-deployment checklist

```
[ ] CORS: ALLOWED_ORIGINS includes https://kpr.band in backend env
[ ] Midtrans: Switch to production keys (MIDTRANS_IS_PRODUCTION=true)
[ ] Midtrans: Set webhook URL to https://api.kpr.band/v1/orders/midtrans-webhook
[ ] DNS: kpr.band → Vercel, api.kpr.band → DigitalOcean
[ ] SSL: Auto-provisioned by both platforms
[ ] Admin: Change default admin password immediately after first login
[ ] Seed: Run db:seed on production DB to populate albums
[ ] Test: Complete checkout flow with Midtrans sandbox
[ ] Monitoring: Set up Sentry (optional but recommended)
```

---

## Project Structure Details

### Frontend pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Hero + latest release + events strip |
| `/about` | `app/about/page.tsx` | Band bio + members + timeline |
| `/discography` | `app/discography/page.tsx` | Albums grid + streaming links modal |
| `/events` | `app/events/page.tsx` | Gig listings with ticket CTAs |
| `/merch` | `app/merch/page.tsx` | Product grid with category filter |
| `/merch/[slug]` | `app/merch/[slug]/page.tsx` | Product detail + add to cart |
| `/merch/cart` | `app/merch/cart/page.tsx` | Cart view + order summary |
| `/merch/checkout` | `app/merch/checkout/page.tsx` | Multi-step checkout + Midtrans |
| `/media` | `app/media/page.tsx` | Photos lightbox + videos + Spotify |
| `/contact` | `app/contact/page.tsx` | Booking/contact form |

### Key design decisions

- **Guest checkout** — no user accounts required to buy merch
- **Zustand cart** — persisted to localStorage via `zustand/middleware/persist`  
- **Static fallback data** — all pages render correctly even if API is down (SEO safe)
- **Server Components** — metadata/SEO handled server-side; client components opt-in with `'use client'`
- **Film grain aesthetic** — global `GrainOverlay` component, CSS animation, `opacity: 0.035`
- **Cold color palette** — `#0a0a0e` base, `#2060a0` accent, strictly no warm tones

---

## Band Info

**Kelompok Penerbang Roket (KPR)**

| | |
|---|---|
| Origin | Jakarta, Indonesia |
| Formed | 2011 |
| Genre | Acid rock, Hard rock, Punk rock, Psychedelic rock, Heavy metal |
| Members | John Paul Patton (vocals/bass), Rey Marshall (guitar/BV), I Gusti Vikranta (drums/BV) |

**Discography:**
- *Teriakan Bocah* (2015) — debut EP
- *HAAI* (2015) — EP
- *Galaksi Palapa* (2018) — full-length
- *Aksioma* (2023) — full-length
- *KOMA* (2024) — full-length

---

## License

Private repository. All rights reserved.  
© 2024–2025 Kelompok Penerbang Roket
