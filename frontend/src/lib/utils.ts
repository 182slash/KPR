import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { id as idLocale } from 'date-fns/locale/id';

// Class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format IDR currency
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format event date
export function formatEventDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'd MMMM yyyy', { locale: idLocale });
  } catch {
    return dateString;
  }
}

// Format event date short
export function formatEventDateShort(dateString: string): {
  day: string;
  month: string;
  year: string;
} {
  try {
    const date = parseISO(dateString);
    return {
      day: format(date, 'dd'),
      month: format(date, 'MMM', { locale: idLocale }).toUpperCase(),
      year: format(date, 'yyyy'),
    };
  } catch {
    return { day: '--', month: '---', year: '----' };
  }
}

// Check if event is upcoming
export function isEventUpcoming(dateString: string): boolean {
  try {
    return isFuture(parseISO(dateString));
  } catch {
    return false;
  }
}

// Check if event is past
export function isEventPast(dateString: string): boolean {
  try {
    return isPast(parseISO(dateString));
  } catch {
    return false;
  }
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `KPR-${timestamp}-${random}`;
}

// Cloudinary URL transformer
export function cloudinaryUrl(
  publicId: string,
  transforms?: string
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return '';
  const t = transforms ? `${transforms}/` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}${publicId}`;
}

// Get status color
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    upcoming: 'text-accent-bright border-accent/40 bg-accent-dim/30',
    sold_out: 'text-warning border-warning/40 bg-warning/10',
    cancelled: 'text-error-bright border-error/40 bg-error/10',
    past: 'text-text-muted border-text-faint/40 bg-text-faint/10',
    pending: 'text-warning border-warning/40 bg-warning/10',
    paid: 'text-success border-success/40 bg-success/10',
    shipped: 'text-accent-bright border-accent/40 bg-accent-dim/30',
  };
  return map[status] ?? 'text-text-muted border-text-faint/40 bg-text-faint/10';
}

// Sleep util for dev
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));