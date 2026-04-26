import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../config/db';
import { authGuard } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';
import { emailService } from '../services/emailService';

const router = Router();

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `KPR-${y}${m}${d}-${rand}`;
}

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  productName: z.string(),
  variantLabel: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().positive(),
  totalPrice: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(1),
  shippingPostal: z.string().optional(),
  shippingProvince: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

// POST /v1/orders — create order + initiate Midtrans
router.post('/', async (req, res) => {
  const body = createOrderSchema.parse(req.body);

  // Validate & calculate totals from DB (prevent price tampering)
  let subtotal = 0;
  const validatedItems = await Promise.all(
    body.items.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
      if (product.stockTotal < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);

      let price = product.price;
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
        if (!variant) throw new AppError(`Variant not found`, 404);
        if (variant.stock < item.quantity) throw new AppError(`Insufficient stock for variant ${variant.label}`, 400);
        price += variant.priceDelta;
      }

      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      return { ...item, unitPrice: price, totalPrice: lineTotal };
    })
  );

  const orderNumber = generateOrderNumber();
  const total = subtotal; // shipping calculated separately or fixed

  // Create order in DB
  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      shippingCity: body.shippingCity,
      shippingPostal: body.shippingPostal,
      shippingProvince: body.shippingProvince,
      notes: body.notes,
      subtotal,
      total,
      midtransOrderId: orderNumber,
      items: {
        create: validatedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
    },
    include: { items: true },
  });

  // Attempt Midtrans Snap token
  let snapToken: string | null = null;
  try {
    const midtransCore = require('midtrans-client');
    const snap = new midtransCore.Snap({
      isProduction: env.MIDTRANS_IS_PRODUCTION,
      serverKey: env.MIDTRANS_SERVER_KEY,
      clientKey: env.MIDTRANS_CLIENT_KEY,
    });

    const snapResponse = await snap.createTransaction({
      transaction_details: {
        order_id: orderNumber,
        gross_amount: total,
      },
      customer_details: {
        first_name: body.customerName,
        email: body.customerEmail,
        phone: body.customerPhone,
        shipping_address: {
          first_name: body.customerName,
          address: body.shippingAddress,
          city: body.shippingCity,
          postal_code: body.shippingPostal,
        },
      },
      item_details: validatedItems.map((item) => ({
        id: item.productId,
        price: item.unitPrice,
        quantity: item.quantity,
        name: `${item.productName}${item.variantLabel ? ` (${item.variantLabel})` : ''}`.slice(0, 50),
      })),
    });
    snapToken = snapResponse.token;
  } catch (midtransErr) {
    console.error('Midtrans error (non-fatal):', midtransErr);
  }

  // Send confirmation email (non-fatal)
  try {
    await emailService.sendOrderConfirmation(order);
  } catch (emailErr) {
    console.error('Email send error (non-fatal):', emailErr);
  }

  res.status(201).json({
    data: {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      ...(snapToken ? { snapToken } : {}),
    },
  });
});

// GET /v1/orders (admin)
router.get('/', authGuard, async (req, res) => {
  const status = req.query['status'] as string | undefined;
  const page = Number(req.query['page'] ?? 1);
  const limit = 20;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { items: { take: 2 } },
    }),
    prisma.order.count({ where: status ? { status: status as any } : {} }),
  ]);

  res.json({ data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// GET /v1/orders/:id (admin)
router.get('/:id', authGuard, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ data: order });
});

// PUT /v1/orders/:id/status (admin)
router.put('/:id/status', authGuard, async (req, res) => {
  const { status } = z.object({
    status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  }).parse(req.body);

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json({ data: order });
});

// POST /v1/orders/midtrans-webhook — payment notification
router.post('/midtrans-webhook', async (req, res) => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    payment_type,
    transaction_id,
  } = req.body;

  // Verify Midtrans signature
  const hash = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${env.MIDTRANS_SERVER_KEY}`)
    .digest('hex');

  if (hash !== signature_key) {
    res.status(403).json({ message: 'Invalid signature' });
    return;
  }

  const order = await prisma.order.findFirst({
    where: { midtransOrderId: order_id },
  });

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  let newStatus: string = order.status;
  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    newStatus = 'paid';
  } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
    newStatus = 'cancelled';
  } else if (transaction_status === 'pending') {
    newStatus = 'pending';
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: newStatus as any,
      paymentMethod: payment_type,
      midtransTransactionId: transaction_id,
      ...(newStatus === 'paid' ? { paidAt: new Date() } : {}),
    },
  });

  res.json({ message: 'Webhook processed' });
});

export default router;
