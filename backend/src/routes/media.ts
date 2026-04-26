import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { authGuard } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';
import { cloudinary } from '../config/cloudinary';

const router = Router();

const mediaSchema = z.object({
  type: z.enum(['photo', 'video']),
  title: z.string().max(200).optional().nullable(),
  url: z.string().url(),
  publicId: z.string().optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  width: z.coerce.number().int().positive().optional().nullable(),
  height: z.coerce.number().int().positive().optional().nullable(),
  takenAt: z.coerce.date().optional().nullable(),
  albumId: z.string().uuid().optional().nullable(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

// GET /v1/media
router.get('/', async (req, res) => {
  const type = req.query['type'] as 'photo' | 'video' | undefined;
  const albumId = req.query['albumId'] as string | undefined;

  const media = await prisma.media.findMany({
    where: {
      isPublished: true,
      ...(type ? { type } : {}),
      ...(albumId ? { albumId } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  res.json({ data: media });
});

// GET /v1/media/:id
router.get('/:id', async (req, res) => {
  const item = await prisma.media.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError('Media not found', 404);
  res.json({ data: item });
});

// POST /v1/media (admin)
router.post('/', authGuard, async (req, res) => {
  const data = mediaSchema.parse(req.body);
  const media = await prisma.media.create({ data });
  res.status(201).json({ data: media });
});

// PUT /v1/media/:id (admin)
router.put('/:id', authGuard, async (req, res) => {
  const data = mediaSchema.partial().parse(req.body);
  const media = await prisma.media.update({ where: { id: req.params.id }, data });
  res.json({ data: media });
});

// DELETE /v1/media/:id (admin) — also removes from Cloudinary
router.delete('/:id', authGuard, async (req, res) => {
  const media = await prisma.media.findUnique({ where: { id: req.params.id } });
  if (!media) throw new AppError('Media not found', 404);

  // Delete from Cloudinary if publicId exists
  if (media.publicId) {
    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch (err) {
      console.error('Cloudinary delete failed (non-fatal):', err);
    }
  }

  await prisma.media.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// POST /v1/media/reorder (admin) — update sort order
router.post('/reorder', authGuard, async (req, res) => {
  const { items } = z.object({
    items: z.array(z.object({ id: z.string().uuid(), sortOrder: z.number().int() })),
  }).parse(req.body);

  await Promise.all(
    items.map((item) =>
      prisma.media.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );

  res.json({ message: 'Reordered successfully' });
});

export default router;
