'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { fadeInUp } from '@/lib/motion';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  organization: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  city: z.string().optional(),
  venue: z.string().optional(),
  budgetRange: z.string().optional(),
  message: z.string().min(20, 'Please write at least 20 characters'),
  honeypot: z.string().max(0, 'Bot detected'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass = `w-full bg-bg-elevated border border-accent-dim/30 rounded-sm px-4 py-3 text-sm text-text-primary placeholder-text-faint focus:outline-none focus:border-accent transition-colors duration-200 font-body`;
const labelClass = 'block font-heading font-medium text-xs uppercase tracking-wider text-text-muted mb-2';
const errorClass = 'font-mono text-xs text-error-bright mt-1';

const EVENT_TYPES = [
  'Festival', 'Private Event', 'Club / Bar Show', 'Concert / Gig',
  'Corporate Event', 'Campus Event', 'Online Stream', 'Other',
];

const BUDGET_RANGES = [
  '< Rp 5.000.000',
  'Rp 5.000.000 – 15.000.000',
  'Rp 15.000.000 – 30.000.000',
  'Rp 30.000.000 – 50.000.000',
  '> Rp 50.000.000',
  'To be discussed',
];

export function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check (double safety, server also checks)
    if (data.honeypot) return;

    try {
      await contactApi.submit(data);
      setSubmitted(true);
      reset();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to send message. Please try again or email us directly.');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center py-16 gap-6 border border-accent-dim/20 rounded-card"
        >
          <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
            <CheckCircle size={28} className="text-accent-bright" />
          </div>
          <div>
            <p className="font-display text-3xl text-text-primary mb-2">MESSAGE SENT!</p>
            <p className="text-text-secondary text-sm">
              Terima kasih! Kami akan menghubungi kamu dalam 2–3 hari kerja.
            </p>
          </div>
          <Button variant="outline" size="md" onClick={() => setSubmitted(false)}>
            Send Another
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Honeypot — hidden from users */}
          <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
            <input {...register('honeypot')} type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="name">Name *</label>
              <input id="name" {...register('name')} className={inputClass} placeholder="Your full name" autoComplete="name" />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email *</label>
              <input id="email" {...register('email')} type="email" className={inputClass} placeholder="your@email.com" autoComplete="email" />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
          </div>

          {/* Row 2: Phone + Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="phone">Phone</label>
              <input id="phone" {...register('phone')} type="tel" className={inputClass} placeholder="08xxxxxxxxxx" autoComplete="tel" />
            </div>
            <div>
              <label className={labelClass} htmlFor="organization">Organization / Promotor</label>
              <input id="organization" {...register('organization')} className={inputClass} placeholder="Event organizer name" />
            </div>
          </div>

          {/* Row 3: Event type + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="eventType">Event Type</label>
              <select id="eventType" {...register('eventType')} className={inputClass}>
                <option value="">Select event type...</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="eventDate">Event Date</label>
              <input id="eventDate" {...register('eventDate')} type="date" className={inputClass} />
            </div>
          </div>

          {/* Row 4: City + Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="city">City</label>
              <input id="city" {...register('city')} className={inputClass} placeholder="Jakarta" />
            </div>
            <div>
              <label className={labelClass} htmlFor="venue">Venue</label>
              <input id="venue" {...register('venue')} className={inputClass} placeholder="Venue name" />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className={labelClass} htmlFor="budgetRange">Budget Range</label>
            <select id="budgetRange" {...register('budgetRange')} className={inputClass}>
              <option value="">Select budget range...</option>
              {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className={labelClass} htmlFor="message">Message *</label>
            <textarea
              id="message"
              {...register('message')}
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Tell us about your event, lineup, expected audience, and anything else relevant..."
            />
            {errors.message && <p className={errorClass}>{errors.message.message}</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Send size={14} />}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>

          <p className="font-mono text-xs text-text-faint">
            * Required fields. We typically respond within 2–3 business days.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
