import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince?: string | null;
  shippingPostal?: string | null;
  subtotal: number;
  total: number;
  items: Array<{
    productName: string;
    variantLabel?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  eventType?: string;
  eventDate?: string;
  city?: string;
  venue?: string;
  budgetRange?: string;
  message: string;
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export const emailService = {
  async sendOrderConfirmation(order: OrderData): Promise<void> {
    const itemRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e2640;color:#a0b4c0;font-size:14px;">
            ${item.productName}${item.variantLabel ? ` <span style="color:#7090a8">(${item.variantLabel})</span>` : ''}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #1e2640;color:#a0b4c0;font-size:14px;text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #1e2640;color:#e0e0e0;font-size:14px;text-align:right;font-family:monospace;">
            ${formatIDR(item.totalPrice)}
          </td>
        </tr>`
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0e;font-family:'DM Sans',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;border:1px solid #2060a0;padding:12px 24px;margin-bottom:16px;">
        <span style="font-family:Impact,sans-serif;font-size:20px;color:#60a0e0;letter-spacing:4px;">KPR</span>
      </div>
      <h1 style="font-family:Impact,sans-serif;font-size:36px;color:#e0e0e0;margin:0;letter-spacing:2px;">ORDER CONFIRMED</h1>
    </div>

    <!-- Message -->
    <div style="background:#101420;border:1px solid rgba(32,96,160,0.2);padding:24px;margin-bottom:24px;">
      <p style="color:#a0b4c0;font-size:15px;line-height:1.6;margin:0 0 12px;">
        Hei ${order.customerName}, terima kasih untuk ordermu!
      </p>
      <p style="color:#7090a8;font-size:13px;margin:0;">
        Order number: <span style="color:#60a0e0;font-family:monospace;">${order.orderNumber}</span>
      </p>
    </div>

    <!-- Items -->
    <div style="background:#101420;border:1px solid rgba(32,96,160,0.2);padding:24px;margin-bottom:24px;">
      <h2 style="font-family:Impact,sans-serif;font-size:18px;color:#e0e0e0;margin:0 0 16px;letter-spacing:1px;">ORDER ITEMS</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="font-size:11px;color:#7090a8;font-family:monospace;text-align:left;padding-bottom:8px;border-bottom:1px solid #1e2640;text-transform:uppercase;letter-spacing:0.1em;">Product</th>
            <th style="font-size:11px;color:#7090a8;font-family:monospace;text-align:center;padding-bottom:8px;border-bottom:1px solid #1e2640;text-transform:uppercase;letter-spacing:0.1em;">Qty</th>
            <th style="font-size:11px;color:#7090a8;font-family:monospace;text-align:right;padding-bottom:8px;border-bottom:1px solid #1e2640;text-transform:uppercase;letter-spacing:0.1em;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #1e2640;display:flex;justify-content:space-between;">
        <span style="font-family:Impact,sans-serif;font-size:16px;color:#e0e0e0;letter-spacing:1px;">TOTAL</span>
        <span style="font-family:monospace;font-size:18px;color:#60a0e0;">${formatIDR(order.total)}</span>
      </div>
    </div>

    <!-- Shipping -->
    <div style="background:#101420;border:1px solid rgba(32,96,160,0.2);padding:24px;margin-bottom:40px;">
      <h2 style="font-family:Impact,sans-serif;font-size:18px;color:#e0e0e0;margin:0 0 12px;letter-spacing:1px;">SHIPPING TO</h2>
      <p style="color:#a0b4c0;font-size:14px;margin:0;line-height:1.8;">
        ${order.shippingAddress}<br>
        ${order.shippingCity}${order.shippingProvince ? `, ${order.shippingProvince}` : ''} ${order.shippingPostal ?? ''}<br>
        Indonesia
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid rgba(32,96,160,0.2);padding-top:32px;">
      <p style="color:#405060;font-size:12px;font-family:monospace;margin:0 0 8px;">KELOMPOK PENERBANG ROKET</p>
      <p style="color:#405060;font-size:12px;margin:0;">
        Pertanyaan? <a href="mailto:merch@kpr.band" style="color:#4080c0;">merch@kpr.band</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNumber} | KPR`,
      html,
    });
  },

  async sendBookingNotification(data: ContactData): Promise<void> {
    const fields = [
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone ?? '—' },
      { label: 'Organization', value: data.organization ?? '—' },
      { label: 'Event Type', value: data.eventType ?? '—' },
      { label: 'Event Date', value: data.eventDate ?? '—' },
      { label: 'City', value: data.city ?? '—' },
      { label: 'Venue', value: data.venue ?? '—' },
      { label: 'Budget Range', value: data.budgetRange ?? '—' },
    ];

    const rows = fields
      .map(
        (f) => `
      <tr>
        <td style="padding:8px 12px;font-size:12px;color:#7090a8;font-family:monospace;text-transform:uppercase;letter-spacing:0.08em;width:140px;vertical-align:top;border-bottom:1px solid #1e2640;">${f.label}</td>
        <td style="padding:8px 12px;font-size:14px;color:#a0b4c0;vertical-align:top;border-bottom:1px solid #1e2640;">${f.value}</td>
      </tr>`
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0e;font-family:system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <h1 style="font-family:Impact,sans-serif;font-size:28px;color:#60a0e0;letter-spacing:2px;margin:0 0 24px;">NEW BOOKING INQUIRY</h1>
    <div style="background:#101420;border:1px solid rgba(32,96,160,0.2);overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>
    <div style="background:#161c2e;border:1px solid rgba(32,96,160,0.15);padding:20px;margin-top:16px;">
      <p style="font-size:12px;color:#7090a8;font-family:monospace;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Message</p>
      <p style="font-size:14px;color:#a0b4c0;line-height:1.7;margin:0;white-space:pre-wrap;">${data.message}</p>
    </div>
    <p style="color:#405060;font-size:12px;font-family:monospace;margin-top:24px;">Sent via kpr.band contact form</p>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_BOOKING_TO,
      replyTo: data.email,
      subject: `[KPR Booking] ${data.eventType ?? 'Inquiry'} — ${data.name}`,
      html,
    });
  },

  async sendContactAutoReply(name: string, email: string): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0e;font-family:system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;text-align:center;">
    <div style="border:1px solid #2060a0;display:inline-block;padding:12px 24px;margin-bottom:24px;">
      <span style="font-family:Impact,sans-serif;font-size:20px;color:#60a0e0;letter-spacing:4px;">KPR</span>
    </div>
    <h1 style="font-family:Impact,sans-serif;font-size:32px;color:#e0e0e0;letter-spacing:2px;margin:0 0 24px;">MESSAGE RECEIVED</h1>
    <div style="background:#101420;border:1px solid rgba(32,96,160,0.2);padding:28px;text-align:left;">
      <p style="color:#a0b4c0;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Hei ${name},
      </p>
      <p style="color:#a0b4c0;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Terima kasih sudah menghubungi kami. Pesan kamu sudah kami terima dan tim kami akan merespons dalam <strong style="color:#e0e0e0;">2–3 hari kerja</strong>.
      </p>
      <p style="color:#a0b4c0;font-size:15px;line-height:1.7;margin:0;">
        Untuk urusan urgent, email langsung ke <a href="mailto:booking@kpr.band" style="color:#60a0e0;">booking@kpr.band</a>.
      </p>
    </div>
    <div style="margin-top:40px;border-top:1px solid rgba(32,96,160,0.2);padding-top:24px;">
      <p style="color:#405060;font-size:12px;font-family:monospace;margin:0;">KELOMPOK PENERBANG ROKET · Jakarta</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: 'Message Received — Kelompok Penerbang Roket',
      html,
    });
  },
};
