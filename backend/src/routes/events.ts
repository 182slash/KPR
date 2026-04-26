import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { authGuard } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const eventSchema = z.object({
  title: z.string().min(1).max(300),
  venue: z.string().min(1).max(300),
  city: z.string().min(1).max(100),
  country: z.string().default('Indonesia'),
  eventDate: z.coerce.date(),
  doorsOpen: z.string().optional().nullable(),
  posterUrl: z.string().url().optional().nullable(),
  posterPublicId: z.string().optional().nullable(),
  ticketUrl: z.string().url().optional().nullable(),
  ticketPriceMin: z.coerce.number().int().positive().optional().nullable(),
  ticketPriceMax: z.coerce.number().int().positive().optional().nullable(),
  status: z.enum(['upcoming', 'sold_out', 'cancelled', 'past']).default('upcoming'),
  notes: z.string().optional().nullable(),
});

// GET /v1/events
router.get('/', async (req, res) => {
  const upcoming = req.query['upcoming'] === 'true';
  const city = req.query['city'] as string | undefined;
  const limit = req.query['limit'] ? Number(req.query['limit']) : undefined;

  const where: Record<string, unknown> = {};
  if (upcoming) {
    where['status'] = { in: ['upcoming', 'sold_out'] };
    where['eventDate'] = { gte: new Date() };
  }
  if (city) {
    where['city'] = { equals: city, mode: 'insensitive' };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { eventDate: upcoming ? 'asc' : 'desc' },
    ...(limit ? { take: limit } : {}),
  });

  res.json({ data: events });
});

// GET /v1/events/:id
router.get('/:id', async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) throw new AppError('Event not found', 404);
  res.json({ data: event });
});

// POST /v1/events (admin)
router.post('/', authGuard, async (req, res) => {
  const data = eventSchema.parse(req.body);
  const event = await prisma.event.create({ data });
  res.status(201).json({ data: event });
});

// PUT /v1/events/:id (admin)
router.put('/:id', authGuard, async (req, res) => {
  const data = eventSchema.partial().parse(req.body);
  const event = await prisma.event.update({ where: { id: req.params.id }, data });
  res.json({ data: event });
});

// DELETE /v1/events/:id (admin)
router.delete('/:id', authGuard, async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
