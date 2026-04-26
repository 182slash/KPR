import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KPR database...');

  // ─── Admin user ─────────────────────────────────────────────────────────────
  const adminEmail = process.env['ADMIN_SEED_EMAIL'] ?? 'admin@kpr.band';
  const adminPassword = process.env['ADMIN_SEED_PASSWORD'] ?? 'KPR_Admin_2024!';

  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash, name: 'KPR Admin', role: 'superadmin' },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ─── Albums ─────────────────────────────────────────────────────────────────
  const albums = [
    {
      slug: 'koma',
      title: 'KOMA',
      releaseYear: 2024,
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
      description: 'Album kelima KPR. Kembali ke akar — raw, berat, tanpa kompromi. Rekaman langsung di studio selama tiga minggu tanpa overdub berlebihan.',
      spotifyUrl: 'https://open.spotify.com/album/placeholder',
      bandcampUrl: 'https://kelompokpenerbangroket.bandcamp.com',
      isPublished: true,
    },
    {
      slug: 'aksioma',
      title: 'Aksioma',
      releaseYear: 2023,
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      description: 'Statement album dengan produksi lebih masif. Delapan lagu yang menjelajahi ruang antara kekerasan dan keheningan.',
      spotifyUrl: 'https://open.spotify.com/album/placeholder',
      bandcampUrl: 'https://kelompokpenerbangroket.bandcamp.com',
      isPublished: true,
    },
    {
      slug: 'galaksi-palapa',
      title: 'Galaksi Palapa',
      releaseYear: 2018,
      coverUrl: 'https://images.unsplash.com/photo-1446941303997-31a27d3f7f63?w=800&q=80',
      description: 'Album psikedelik penuh pertama KPR. Perjalanan enam belas menit dari intro ambient ke blastbeat yang menggilas.',
      bandcampUrl: 'https://kelompokpenerbangroket.bandcamp.com',
      isPublished: true,
    },
    {
      slug: 'haai',
      title: 'HAAI',
      releaseYear: 2015,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      description: 'EP kedua. Lima lagu energi liar yang dimainkan satu kali take di studio.',
      bandcampUrl: 'https://kelompokpenerbangroket.bandcamp.com',
      isPublished: true,
    },
    {
      slug: 'teriakan-bocah',
      title: 'Teriakan Bocah',
      releaseYear: 2015,
      coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80',
      description: 'Debut EP. Empat lagu yang menghentak scene rock Jakarta.',
      bandcampUrl: 'https://kelompokpenerbangroket.bandcamp.com',
      isPublished: true,
    },
  ];

  for (const album of albums) {
    await prisma.album.upsert({
      where: { slug: album.slug },
      update: album,
      create: album,
    });
    console.log(`✅ Album: ${album.title}`);
  }

  // ─── Events ─────────────────────────────────────────────────────────────────
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: 'KOMA TOUR 2025 — Jakarta',
          venue: 'Hammersonic Main Stage',
          city: 'Jakarta',
          eventDate: new Date('2025-04-15T20:00:00+07:00'),
          doorsOpen: '18:00',
          ticketUrl: 'https://loket.com',
          ticketPriceMin: 150000,
          ticketPriceMax: 350000,
          status: 'upcoming',
        },
        {
          title: 'KOMA TOUR 2025 — Bandung',
          venue: 'Sabuga Convention Hall',
          city: 'Bandung',
          eventDate: new Date('2025-05-10T20:00:00+07:00'),
          doorsOpen: '18:30',
          ticketUrl: 'https://loket.com',
          ticketPriceMin: 120000,
          ticketPriceMax: 280000,
          status: 'upcoming',
        },
        {
          title: 'KOMA TOUR 2025 — Surabaya',
          venue: 'Dyandra Convention Center',
          city: 'Surabaya',
          eventDate: new Date('2025-06-07T20:00:00+07:00'),
          doorsOpen: '18:00',
          ticketUrl: 'https://loket.com',
          ticketPriceMin: 130000,
          ticketPriceMax: 300000,
          status: 'upcoming',
        },
        {
          title: 'Hammersonic 2024',
          venue: 'Bintaro Xchange Ampitheater',
          city: 'Tangerang',
          eventDate: new Date('2024-05-11T14:00:00+07:00'),
          status: 'past',
        },
      ],
    });
    console.log('✅ Events seeded');
  }

  // ─── Products ───────────────────────────────────────────────────────────────
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    const shirt = await prisma.product.create({
      data: {
        slug: 'koma-tshirt-black',
        name: 'KOMA Tour Tee — Black',
        description: 'Premium heavy cotton 180gsm, screen printed with distressed KPR logo. Pre-washed for better feel.',
        category: 'apparel',
        price: 185000,
        isFeatured: true,
        stockTotal: 120,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        variants: {
          create: [
            { label: 'S', stock: 30, priceDelta: 0 },
            { label: 'M', stock: 40, priceDelta: 0 },
            { label: 'L', stock: 30, priceDelta: 0 },
            { label: 'XL', stock: 20, priceDelta: 0 },
          ],
        },
      },
    });

    await prisma.product.create({
      data: {
        slug: 'galaksi-palapa-poster-a2',
        name: 'Galaksi Palapa — Poster A2',
        description: 'High-gloss art print 420×594mm. Printed on 200gsm coated paper. Suitable for framing.',
        category: 'poster',
        price: 125000,
        isFeatured: true,
        stockTotal: 50,
        images: {
          create: [{
            url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
            isPrimary: true,
            sortOrder: 0,
          }],
        },
      },
    });

    await prisma.product.create({
      data: {
        slug: 'kpr-enamel-pin-set',
        name: 'KPR Logo — Enamel Pin',
        description: 'Hard enamel pin with gold plating. 25mm diameter. Butterfly clutch backing.',
        category: 'accessory',
        price: 75000,
        stockTotal: 200,
        images: {
          create: [{
            url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
            isPrimary: true,
            sortOrder: 0,
          }],
        },
      },
    });

    await prisma.product.create({
      data: {
        slug: 'aksioma-tshirt-white',
        name: 'Aksioma Tee — White',
        description: 'Ringspun cotton, ultra-soft 160gsm. Minimalist AKSIOMA print on chest.',
        category: 'apparel',
        price: 175000,
        stockTotal: 80,
        images: {
          create: [{
            url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
            isPrimary: true,
            sortOrder: 0,
          }],
        },
        variants: {
          create: [
            { label: 'S', stock: 20, priceDelta: 0 },
            { label: 'M', stock: 25, priceDelta: 0 },
            { label: 'L', stock: 20, priceDelta: 0 },
            { label: 'XL', stock: 15, priceDelta: 0 },
          ],
        },
      },
    });

    await prisma.product.create({
      data: {
        slug: 'kpr-woven-patch',
        name: 'KPR Woven Patch',
        description: 'Iron-on / sew-on embroidered woven patch. 80mm wide. Works on jackets, bags, denim.',
        category: 'accessory',
        price: 55000,
        stockTotal: 300,
        images: {
          create: [{
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            isPrimary: true,
            sortOrder: 0,
          }],
        },
      },
    });

    await prisma.product.create({
      data: {
        slug: 'koma-poster-a2',
        name: 'KOMA — Poster A2',
        description: 'Offset-printed matte finish. 420×594mm. Bold industrial typography.',
        category: 'poster',
        price: 135000,
        stockTotal: 40,
        images: {
          create: [{
            url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
            isPrimary: true,
            sortOrder: 0,
          }],
        },
      },
    });

    console.log('✅ Products seeded');
  }

  // ─── Sample media ────────────────────────────────────────────────────────────
  const existingMedia = await prisma.media.count();
  if (existingMedia === 0) {
    const photoUrls = [
      { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80', title: 'Live at Hammersonic 2024' },
      { url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80', title: 'Studio Session — KOMA' },
      { url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=80', title: 'Backstage Bandung' },
      { url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200&q=80', title: 'Rehearsal Space' },
      { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=80', title: 'Crowd — Jakarta Show' },
      { url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200&q=80', title: 'Gear Setup' },
      { url: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=1200&q=80', title: 'Stage Lights' },
      { url: 'https://images.unsplash.com/photo-1446941303997-31a27d3f7f63?w=1200&q=80', title: 'Band Portrait 2024' },
    ];

    await prisma.media.createMany({
      data: photoUrls.map((p, i) => ({
        type: 'photo',
        title: p.title,
        url: p.url,
        isPublished: true,
        sortOrder: i,
      })),
    });
    console.log('✅ Media seeded');
  }

  console.log('\n🎸 KPR database seeded successfully!\n');
  console.log(`Admin login: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
  console.log('\n⚠️  Change the admin password after first login!\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
