import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { authGuard } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const albumSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens'),
  title: z.string().min(1).max(200),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  coverUrl: z.string().url(),
  coverPublicId: z.string().optional(),
  bandcampUrl: z.string().url().optional().nullable(),
  spotifyUrl: z.string().url().optional().nullable(),
  appleMusicUrl: z.string().url().optional().nullable(),
  youtubeMusicUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

// GET /v1/albums — list all published albums
router.get('/', async (_req, res) => {
  const albums = await prisma.album.findMany({
    where: { isPublished: true },
    orderBy: { releaseYear: 'desc' },
  });
  res.json({ data: albums });
});

// GET /v1/albums/:slug — get single album
router.get('/:slug', async (req, res) => {
  const album = await prisma.album.findFirst({
    where: { slug: req.params.slug, isPublished: true },
    include: { media: { where: { isPublished: true }, take: 12, orderBy: { sortOrder: 'asc' } } },
  });
  if (!album) throw new AppError('Album not found', 404);
  res.json({ data: album });
});

// POST /v1/albums — create (admin only)
router.post('/', authGuard, async (req, res) => {
  const data = albumSchema.parse(req.body);
  const album = await prisma.album.create({ data });
  res.status(201).json({ data: album });
});

// PUT /v1/albums/:id — update (admin only)
router.put('/:id', authGuard, async (req, res) => {
  const data = albumSchema.partial().parse(req.body);
  const album = await prisma.album.update({ where: { id: req.params.id }, data });
  res.json({ data: album });
});

// DELETE /v1/albums/:id — delete (admin only)
router.delete('/:id', authGuard, async (req, res) => {
  await prisma.album.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
