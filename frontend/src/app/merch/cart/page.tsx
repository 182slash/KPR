'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatIDR } from '@/lib/utils';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/motion';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const SHIPPING_THRESHOLD = 500000;
  const freeShipping = total >= SHIPPING_THRESHOLD;

  return (
    <div className="pt-[72px]">
      <div className="container-kpr section-pad">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow mb-2">Order Summary</p>
          <h1 className="font-display text-display text-text-primary">YOUR CART</h1>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-6 text-center border border-accent-dim/20 rounded-card"
          >
            <ShoppingBag size={56} className="text-text-faint" />
            <div>
              <p className="font-display text-4xl text-text-faint mb-2">CART IS EMPTY</p>
              <p className="text-text-muted">Belum ada item di cart kamu.</p>
            </div>
            <Button href="/merch" size="lg" rightIcon={<ArrowRight size={16} />}>
              Browse Merch
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Cart items */}
            <div className="lg:col-span-2">
              <motion.div
                variants={staggerContainer}
                className="flex flex-col divide-y divide-accent-dim/20 border border-accent-dim/20 rounded-card overflow-hidden"
              >
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-elevated/50">
                  <span className="col-span-6 font-mono text-xs uppercase tracking-wider text-text-faint">Product</span>
                  <span className="col-span-2 font-mono text-xs uppercase tracking-wider text-text-faint text-center">Price</span>
                  <span className="col-span-2 font-mono text-xs uppercase tracking-wider text-text-faint text-center">Qty</span>
                  <span className="col-span-2 font-mono text-xs uppercase tracking-wider text-text-faint text-right">Total</span>
                </div>

                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.variantId}`}
                    variants={staggerItem}
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center"
                  >
                    {/* Product */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0 rounded-sm overflow-hidden border border-accent-dim/20 bg-bg-elevated">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag size={20} className="text-text-faint" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/merch/${item.slug}`}
                          className="font-heading font-medium text-sm text-text-primary hover:text-accent-bright transition-colors duration-200 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="font-mono text-xs text-text-muted">{item.variantLabel}</p>
                        )}
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="flex items-center gap-1 mt-1 text-xs text-text-faint hover:text-error-bright transition-colors duration-200 sm:hidden"
                        >
                          <Trash2 size={10} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <p className="font-mono text-sm text-text-secondary">{formatIDR(item.price)}</p>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-5 sm:col-span-2 flex justify-center">
                      <div className="flex items-center border border-accent-dim/30 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-mono text-sm text-text-primary">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Line total + remove */}
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-3">
                      <p className="font-mono text-sm text-text-primary">{formatIDR(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="hidden sm:flex text-text-faint hover:text-error-bright transition-colors duration-200"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex justify-between mt-4">
                <Button href="/merch" variant="ghost" size="sm">
                  Continue Shopping
                </Button>
                <button
                  onClick={clearCart}
                  className="font-mono text-xs text-text-faint hover:text-error-bright transition-colors duration-200 uppercase tracking-wider"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order summary */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <div className="border border-accent-dim/20 rounded-card p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-base uppercase tracking-wider text-text-primary mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-mono text-text-primary">{formatIDR(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Ongkos Kirim</span>
                    <span className="font-mono text-text-muted">Dihitung saat checkout</span>
                  </div>
                  {!freeShipping && (
                    <div className="text-xs text-text-faint font-mono bg-bg-elevated rounded-sm px-3 py-2">
                      Belanja {formatIDR(SHIPPING_THRESHOLD - total)} lagi untuk free shipping!
                    </div>
                  )}
                  {freeShipping && (
                    <div className="text-xs text-success font-mono bg-success/10 border border-success/20 rounded-sm px-3 py-2">
                      ✓ Eligible for free shipping!
                    </div>
                  )}
                </div>

                <div className="border-t border-accent-dim/20 pt-5 mb-6">
                  <div className="flex justify-between">
                    <span className="font-heading font-semibold text-sm uppercase tracking-wider">Total</span>
                    <span className="font-mono text-xl text-text-primary">{formatIDR(total)}</span>
                  </div>
                </div>

                <Button href="/merch/checkout" size="lg" className="w-full" rightIcon={<ArrowRight size={16} />}>
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-text-faint font-mono text-center mt-4">
                  Secure checkout via Midtrans
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
