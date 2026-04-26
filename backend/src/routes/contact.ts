import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import prisma from '../config/db';
import { emailService } from '../services/emailService';
import { env } from '../config/env';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_CONTACT,
  message: { message: 'Too many messages sent from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  organization: z.string().max(200).optional(),
  eventType: z.string().max(100).optional(),
  eventDate: z.string().optional(),
  city: z.string().max(100).optional(),
  venue: z.string().max(200).optional(),
  budgetRange: z.string().max(80).optional(),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional(), // Must be empty
});

// POST /v1/contact
router.post('/', contactLimiter, async (req, res) => {
  const data = contactSchema.parse(req.body);

  // Bot trap
  if (data.honeypot && data.honeypot.length > 0) {
    // Silently succeed to not tip off bots
    res.json({ message: 'Message received. We will get back to you shortly.' });
    return;
  }

  // Save to DB
  const message = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      organization: data.organization,
      eventType: data.eventType,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      city: data.city,
      venue: data.venue,
      budgetRange: data.budgetRange,
      message: data.message,
    },
  });

  // Send notification email to booking team
  try {
    await emailService.sendBookingNotification(data);
  } catch (err) {
    console.error('Email notification failed (non-fatal):', err);
  }

  // Send auto-reply to sender
  try {
    await emailService.sendContactAutoReply(data.name, data.email);
  } catch (err) {
    console.error('Auto-reply failed (non-fatal):', err);
  }

  res.status(201).json({
    message: 'Message received. We will get back to you within 2–3 business days.',
    id: message.id,
  });
});

// GET /v1/contact (admin — list messages)
import { authGuard } from '../middleware/authGuard';

router.get('/', authGuard, async (req, res) => {
  const unreadOnly = req.query['unread'] === 'true';
  const messages = await prisma.contactMessage.findMany({
    where: unreadOnly ? { isRead: false } : {},
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ data: messages });
});

// PATCH /v1/contact/:id/read (admin)
router.patch('/:id/read', authGuard, async (req, res) => {
  const message = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });
  res.json({ data: message });
});

export default router;
