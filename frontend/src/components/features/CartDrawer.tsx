'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatIDR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { drawerSlideIn, overlayFade } from '@/lib/motion';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('kpr:cart:open', handleOpen);
    return () => window.removeEventListener('kpr:cart:open', handleOpen);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const total = getTotalPrice();
  const itemCount = getTotalItems();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-bg-base/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            variants={drawerSlideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-bg-surface border-l border-accent-dim/20 flex flex-col shadow-[−20px_0_60px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-accent-dim/20">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-accent-bright" />
                <h2 className="font-heading font-semibold text-base uppercase tracking-wider text-text-primary">
                  Cart
                </h2>
                {itemCount > 0 && (
                  <span className="font-mono text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary rounded-sm hover:bg-bg-elevated transition-colors duration-200"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={40} className="text-text-faint" />
                  <div>
                    <p className="font-display text-2xl text-text-faint mb-1">CART EMPTY</p>
                    <p className="text-text-muted text-sm">Add some KPR merch to get started.</p>
                  </div>
                  <Button
                    href="/merch"
                    variant="outline"
                    size="md"
                    onClick={() => setOpen(false)}
                  >
                    Browse Merch
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-accent-dim/20">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="py-4 flex gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 shrink-0 rounded-sm overflow-hidden border border-accent-dim/20 bg-bg-elevated">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag size={20} className="text-text-faint" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/merch/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="font-heading font-medium text-sm text-text-primary hover:text-accent-bright transition-colors duration-200 line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>
                          {item.variantLabel && (
                            <p className="font-mono text-xs text-text-muted mt-0.5">
                              {item.variantLabel}
                            </p>
                          )}
                          <p className="font-mono text-sm text-accent-bright mt-1">
                            {formatIDR(item.price)}
                          </p>

                          {/* Qty + Remove */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-accent-dim/30 rounded-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.variantId, item.quantity - 1)
                                }
                                className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200"
                                aria-label="Decrease"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-7 text-center font-mono text-xs text-text-primary">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.variantId, item.quantity + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200"
                                aria-label="Increase"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-text-faint hover:text-error-bright transition-colors duration-200"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <div className="shrink-0 text-right">
                          <p className="font-mono text-sm text-text-secondary">
                            {formatIDR(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-accent-dim/20 bg-bg-elevated/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-medium text-sm uppercase tracking-wider text-text-muted">
                    Subtotal
                  </span>
                  <span className="font-mono text-xl text-text-primary font-medium">
                    {formatIDR(total)}
                  </span>
                </div>
                <p className="text-xs text-text-faint font-mono">
                  Ongkos kirim dihitung saat checkout
                </p>
                <Button
                  href="/merch/checkout"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Checkout
                </Button>
                <Button
                  href="/merch/cart"
                  variant="ghost"
                  size="md"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  View Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
