'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Ticket } from 'lucide-react';
import useSWR from 'swr';
import { eventsApi } from '@/lib/api';
import { formatEventDate, formatEventDateShort, formatIDR } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/index';
import { EventCardSkeleton } from '@/components/ui/index';
import type { Event, EventStatus } from '@/types';

const STATIC_EVENTS: Event[] = [
  {
    id: '1',
    title: 'KOMA TOUR — Jakarta',
    venue: 'Hammersonic Stage',
    city: 'Jakarta',
    country: 'Indonesia',
    eventDate: '2025-03-15T20:00:00Z',
    ticketUrl: 'https://loket.com',
    ticketPriceMin: 150000,
    ticketPriceMax: 350000,
    status: 'upcoming',
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    title: 'KOMA TOUR — Bandung',
    venue: 'Sabuga Convention Center',
    city: 'Bandung',
    country: 'Indonesia',
    eventDate: '2025-04-05T20:00:00Z',
    ticketUrl: 'https://loket.com',
    ticketPriceMin: 120000,
    ticketPriceMax: 300000,
    status: 'upcoming',
    createdAt: '2024-12-01',
  },
  {
    id: '3',
    title: 'Hammersonic 2024',
    venue: 'Bintaro Xchange',
    city: 'Tangerang',
    country: 'Indonesia',
    eventDate: '2024-05-11T14:00:00Z',
    ticketUrl: null,
    ticketPriceMin: null,
    ticketPriceMax: null,
    status: 'past',
    createdAt: '2024-01-01',
  },
];

type FilterTab = 'all' | 'upcoming' | 'past';

export function EventsClient() {
  const [filter, setFilter] = useState<FilterTab>('all');

  const { data, isLoading } = useSWR('events-all', () => eventsApi.list(), {
    fallbackData: { data: STATIC_EVENTS },
  });

  const allEvents = data?.data ?? STATIC_EVENTS;

  const filtered = allEvents.filter((e) => {
    if (filter === 'upcoming') return e.status === 'upcoming' || e.status === 'sold_out';
    if (filter === 'past') return e.status === 'past' || e.status === 'cancelled';
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All Shows' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-10 border-b border-accent-dim/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`font-heading font-semibold text-sm uppercase tracking-wider px-4 py-3 border-b-2 transition-all duration-200 -mb-px ${
              filter === tab.key
                ? 'border-accent-bright text-accent-bright'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-3xl text-text-faint mb-2">NO SHOWS</p>
          <p className="text-text-muted text-sm">Check back soon.</p>
        </div>
      ) : (
        <motion.div
          key={filter}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-0 divide-y divide-accent-dim/20"
        >
          {filtered.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </motion.div>
      )}
    </>
  );
}

function EventRow({ event }: { event: Event }) {
  const d = formatEventDateShort(event.eventDate);
  const isPast = event.status === 'past' || event.status === 'cancelled';

  return (
    <motion.article
      variants={staggerItem}
      className={`group flex flex-col sm:flex-row items-start sm:items-center gap-6 py-8 transition-colors duration-200 ${
        isPast ? 'opacity-50' : 'hover:bg-bg-surface/50'
      } -mx-4 px-4 rounded-sm`}
    >
      {/* Date block */}
      <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-center gap-2 sm:gap-0 sm:w-16">
        <p className={`font-display text-4xl sm:text-5xl leading-none ${isPast ? 'text-text-faint' : 'text-accent-bright'}`}>
          {d.day}
        </p>
        <div className="sm:text-center">
          <p className="font-mono text-xs uppercase text-text-muted">
            {d.month}
          </p>
          <p className="font-mono text-xs text-text-faint">{d.year}</p>
        </div>
      </div>

      <div className="w-px h-12 bg-accent-dim/30 shrink-0 hidden sm:block" />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="font-display text-xl sm:text-2xl text-text-primary group-hover:text-accent-bright transition-colors duration-200">
            {event.title}
          </h2>
          <Badge
            label={event.status.replace('_', ' ')}
            status={event.status}
            variant="status"
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            {event.venue}, {event.city}
          </span>
          {event.ticketPriceMin && (
            <span className="flex items-center gap-1.5">
              <Ticket size={12} />
              {formatIDR(event.ticketPriceMin)}
              {event.ticketPriceMax && event.ticketPriceMax !== event.ticketPriceMin && (
                <> — {formatIDR(event.ticketPriceMax)}</>
              )}
            </span>
          )}
        </div>
        {event.notes && (
          <p className="text-xs text-text-faint mt-2 italic">{event.notes}</p>
        )}
      </div>

      {/* CTA */}
      <div className="shrink-0">
        {event.ticketUrl && event.status === 'upcoming' ? (
          <Button href={event.ticketUrl} external size="md">
            Get Tickets
          </Button>
        ) : event.status === 'sold_out' ? (
          <Button variant="outline" size="md" disabled>
            Sold Out
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
}
