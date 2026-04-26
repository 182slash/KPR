'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { ordersApi } from '@/lib/api';
import { formatIDR, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { fadeInUp } from '@/lib/motion';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email'),
  customerPhone: z.string().min(8, 'Please enter a valid phone number'),
  shippingAddress: z.string().min(10, 'Please enter your full address'),
  shippingCity: z.string().min(2, 'Please enter your city'),
  shippingPostal: z.string().min(5, 'Please enter a valid postal code'),
  shippingProvince: z.string().min(2, 'Please select a province'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah',
  'Kalimantan Timur', 'Kalimantan Utara', 'Kepulauan Bangka Belitung',
  'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat',
  'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat',
  'Sumatera Selatan', 'Sumatera Utara',
];

type Step = 'shipping' | 'review' | 'payment' | 'success';

const inputClass = `w-full bg-bg-elevated border border-accent-dim/30 rounded-sm px-4 py-3 text-sm text-text-primary placeholder-text-faint focus:outline-none focus:border-accent transition-colors duration-200 font-body`;
const labelClass = 'block font-heading font-medium text-xs uppercase tracking-wider text-text-muted mb-2';
const errorClass = 'font-mono text-xs text-error-bright mt-1';

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmitShipping = () => setStep('review');

  const onConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const values = getValues();
      const payload = {
        ...values,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      };

      const res = await ordersApi.create(payload);
      setOrderNumber(res.data.orderNumber);

      // If Midtrans snap token returned, open Snap
      if ((res.data as any).snapToken && typeof window !== 'undefined') {
        const win = window as any;
        if (win.snap) {
          win.snap.pay((res.data as any).snapToken, {
            onSuccess: () => { clearCart(); setStep('success'); },
            onPending: () => { setStep('success'); },
            onError: () => { toast.error('Payment failed. Please try again.'); setIsSubmitting(false); },
            onClose: () => { setIsSubmitting(false); },
          });
        } else {
          // Snap.js not loaded — redirect
          clearCart();
          setStep('success');
        }
      } else {
        clearCart();
        setStep('success');
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-4xl text-text-faint mb-4">CART IS EMPTY</p>
          <Button href="/merch" size="lg">Browse Merch</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px]">
      {/* Midtrans Snap.js */}
      <script
        src={`${process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ?? 'https://app.sandbox.midtrans.com/snap/snap.js'}`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        async
      />

      <div className="container-kpr section-pad max-w-5xl">
        <div className="mb-10">
          <p className="eyebrow mb-2">Purchase</p>
          <h1 className="font-display text-display text-text-primary">CHECKOUT</h1>
        </div>

        {/* Steps indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-2 mb-12">
            {(['shipping', 'review', 'payment'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs border transition-all duration-300',
                  step === s || (s === 'shipping' && (step === 'review' || step === 'payment')) || (s === 'review' && step === 'payment')
                    ? 'bg-accent border-accent text-white'
                    : 'border-accent-dim/30 text-text-faint'
                )}>
                  {i + 1}
                </div>
                <span className={cn(
                  'font-heading text-xs uppercase tracking-wider hidden sm:block',
                  step === s ? 'text-text-primary' : 'text-text-faint'
                )}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-accent-dim/30 mx-1" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 1: Shipping */}
              {step === 'shipping' && (
                <motion.form
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit(onSubmitShipping)}
                  className="space-y-6"
                >
                  <h2 className="font-heading font-semibold text-xl uppercase tracking-wider text-text-primary">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Full Name *</label>
                      <input {...register('customerName')} className={inputClass} placeholder="John Doe" autoComplete="name" />
                      {errors.customerName && <p className={errorClass}>{errors.customerName.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input {...register('customerEmail')} type="email" className={inputClass} placeholder="john@email.com" autoComplete="email" />
                      {errors.customerEmail && <p className={errorClass}>{errors.customerEmail.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone *</label>
                      <input {...register('customerPhone')} type="tel" className={inputClass} placeholder="08xxxxxxxxxx" autoComplete="tel" />
                      {errors.customerPhone && <p className={errorClass}>{errors.customerPhone.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Street Address *</label>
                      <textarea {...register('shippingAddress')} rows={3} className={`${inputClass} resize-none`} placeholder="Jl. Example No. 123, RT 01/02" autoComplete="street-address" />
                      {errors.shippingAddress && <p className={errorClass}>{errors.shippingAddress.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>City *</label>
                      <input {...register('shippingCity')} className={inputClass} placeholder="Jakarta Selatan" autoComplete="address-level2" />
                      {errors.shippingCity && <p className={errorClass}>{errors.shippingCity.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Postal Code *</label>
                      <input {...register('shippingPostal')} className={inputClass} placeholder="12345" autoComplete="postal-code" />
                      {errors.shippingPostal && <p className={errorClass}>{errors.shippingPostal.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Province *</label>
                      <select {...register('shippingProvince')} className={inputClass}>
                        <option value="">Select province...</option>
                        {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {errors.shippingProvince && <p className={errorClass}>{errors.shippingProvince.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Order Notes (optional)</label>
                      <textarea {...register('notes')} rows={2} className={`${inputClass} resize-none`} placeholder="Catatan untuk order ini..." />
                    </div>
                  </div>

                  <Button type="submit" size="lg" rightIcon={<ArrowRight size={16} />}>
                    Review Order
                  </Button>
                </motion.form>
              )}

              {/* STEP 2: Review */}
              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h2 className="font-heading font-semibold text-xl uppercase tracking-wider text-text-primary">
                    Review Your Order
                  </h2>

                  {/* Shipping summary */}
                  <div className="border border-accent-dim/20 rounded-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="eyebrow">Shipping To</p>
                      <button onClick={() => setStep('shipping')} className="font-mono text-xs text-accent-bright hover:text-accent-glow transition-colors">Edit</button>
                    </div>
                    <p className="text-text-primary text-sm font-medium">{getValues('customerName')}</p>
                    <p className="text-text-secondary text-sm">{getValues('shippingAddress')}</p>
                    <p className="text-text-secondary text-sm">{getValues('shippingCity')}, {getValues('shippingProvince')} {getValues('shippingPostal')}</p>
                    <p className="text-text-muted text-sm mt-1">{getValues('customerEmail')} · {getValues('customerPhone')}</p>
                  </div>

                  {/* Items summary */}
                  <div className="border border-accent-dim/20 rounded-card divide-y divide-accent-dim/20">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm text-text-primary">{item.name}</p>
                          <p className="font-mono text-xs text-text-muted">
                            {item.variantLabel && `${item.variantLabel} · `}Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-mono text-sm text-text-secondary">{formatIDR(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="md" leftIcon={<ArrowLeft size={14} />} onClick={() => setStep('shipping')}>
                      Back
                    </Button>
                    <Button size="md" rightIcon={<ArrowRight size={16} />} onClick={onConfirmOrder} isLoading={isSubmitting}>
                      {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP SUCCESS */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center text-center py-16 gap-6"
                >
                  <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                    <CheckCircle size={36} className="text-accent-bright" />
                  </div>
                  <div>
                    <p className="font-display text-4xl text-text-primary mb-2">ORDER PLACED!</p>
                    <p className="text-text-secondary">
                      Order <span className="font-mono text-accent-bright">{orderNumber}</span> berhasil dibuat.
                    </p>
                    <p className="text-text-muted text-sm mt-2">
                      Konfirmasi dikirim ke email kamu. Cek spam jika tidak terlihat.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button href="/" variant="outline" size="md">Back to Home</Button>
                    <Button href="/merch" size="md" leftIcon={<Package size={14} />}>Continue Shopping</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          {step !== 'success' && (
            <div className="lg:col-span-1">
              <div className="border border-accent-dim/20 rounded-card p-5 sticky top-24">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-text-primary mb-5">
                  Order ({items.length} item{items.length !== 1 ? 's' : ''})
                </h3>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-2">
                      <p className="text-xs text-text-muted leading-snug flex-1">
                        {item.name} {item.variantLabel && `(${item.variantLabel})`} ×{item.quantity}
                      </p>
                      <p className="font-mono text-xs text-text-secondary shrink-0">{formatIDR(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-accent-dim/20 pt-4">
                  <div className="flex justify-between">
                    <span className="font-heading text-sm uppercase tracking-wider text-text-muted">Total</span>
                    <span className="font-mono text-lg text-text-primary">{formatIDR(total)}</span>
                  </div>
                  <p className="font-mono text-xs text-text-faint mt-1">+ ongkos kirim</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
