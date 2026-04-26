import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { authGuard } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const productSchema = z.object({
  slug: z.string().min(2).max(150).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  category: z.enum(['apparel', 'poster', 'accessory', 'vinyl', 'bundle']),
  price: z.coerce.number().int().positive(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  stockTotal: z.coerce.number().int().min(0).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    sortOrder: z.number().int().optional(),
    isPrimary: z.boolean().optional(),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().optional(),
    label: z.string().min(1),
    stock: z.number().int().min(0),
    priceDelta: z.number().int().optional(),
  })).optional(),
});

// GET /v1/products
router.get('/', async (req, res) => {
  const category = req.query['category'] as string | undefined;
  const featured = req.query['featured'] === 'true';

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category ? { category: category as any } : {}),
      ...(featured ? { isFeatured: true } : {}),
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  res.json({ data: products });
});

// GET /v1/products/:slug
router.get('/:slug', async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isPublished: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });
  if (!product) throw new AppError('Product not found', 404);
  res.json({ data: product });
});

// POST /v1/products (admin)
router.post('/', authGuard, async (req, res) => {
  const { images, variants, ...productData } = productSchema.parse(req.body);

  const product = await prisma.product.create({
    data: {
      ...productData,
      ...(images ? {
        images: { create: images },
      } : {}),
      ...(variants ? {
        variants: { create: variants },
      } : {}),
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });

  res.status(201).json({ data: product });
});

// PUT /v1/products/:id (admin)
router.put('/:id', authGuard, async (req, res) => {
  const { images: _images, variants: _variants, ...data } = productSchema.partial().parse(req.body);

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });

  res.json({ data: product });
});

// PATCH /v1/products/:id/stock (admin - quick stock update)
router.patch('/:id/stock', authGuard, async (req, res) => {
  const { stockTotal } = z.object({ stockTotal: z.coerce.number().int().min(0) }).parse(req.body);
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { stockTotal },
  });
  res.json({ data: product });
});

// DELETE /v1/products/:id (admin)
router.delete('/:id', authGuard, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
