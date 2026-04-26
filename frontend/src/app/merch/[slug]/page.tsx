'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, Minus, Plus } from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { productsApi } from '@/lib/api';
import { formatIDR, cn } from '@/lib/utils';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import type { ProductVariant } from '@/types';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading, error } = useSWR(
    `product-${params.slug}`,
    () => productsApi.get(params.slug)
  );

  if (error) notFound();

  const product = data?.data;

  const handleAddToCart = () => {
    if (!product) return;
    if (product.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a size/variant');
      return;
    }
    const price = product.price + (selectedVariant?.priceDelta ?? 0);
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantLabel: selectedVariant?.label,
      price,
      quantity,
      imageUrl: product.images[0]?.url ?? '',
      slug: product.slug,
    });
    window.dispatchEvent(new CustomEvent('kpr:cart:open'));
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images.sort((a, b) => a.sortOrder - b.sortOrder);
  const effectivePrice = product.price + (selectedVariant?.priceDelta ?? 0);
  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.stockTotal > 0;

  return (
    <div className="pt-[72px]">
      <div className="container-kpr section-pad">
        {/* Back link */}
        <Button
          href="/merch"
          variant="ghost"
          size="sm"
          leftIcon={<ChevronLeft size={14} />}
          className="mb-10"
        >
          All Merch
        </Button>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-14"
        >
          {/* Image gallery */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-card overflow-hidden border border-accent-dim/20 bg-bg-surface">
              {images[activeImageIdx] ? (
                <Image
                  src={images[activeImageIdx].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={48} className="text-text-faint" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIdx(i)}
                    className={cn(
                      'relative w-16 aspect-square rounded-sm overflow-hidden border-2 transition-all duration-200',
                      i === activeImageIdx
                        ? 'border-accent'
                        : 'border-accent-dim/20 opacity-60 hover:opacity-100'
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div variants={staggerContainer} className="flex flex-col gap-6">
            <motion.div variants={staggerItem}>
              <p className="eyebrow mb-2">{product.category}</p>
              <h1 className="font-display text-display text-text-primary leading-tight">
                {product.name}
              </h1>
              <p className="font-mono text-2xl text-accent-bright mt-3">
                {formatIDR(effectivePrice)}
              </p>
            </motion.div>

            {product.description && (
              <motion.p variants={staggerItem} className="text-text-secondary leading-relaxed">
                {product.description}
              </motion.p>
            )}

            {/* Variants */}
            {product.variants.length > 0 && (
              <motion.div variants={staggerItem}>
                <p className="font-heading font-semibold text-sm uppercase tracking-wider text-text-muted mb-3">
                  Size {selectedVariant && `— ${selectedVariant.label}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={cn(
                        'w-12 h-12 font-mono text-sm rounded-sm border-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed',
                        selectedVariant?.id === v.id
                          ? 'border-accent bg-accent/20 text-accent-bright'
                          : 'border-accent-dim/30 text-text-muted hover:border-accent/60 hover:text-text-primary'
                      )}
                      aria-pressed={selectedVariant?.id === v.id}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div variants={staggerItem}>
              <p className="font-heading font-semibold text-sm uppercase tracking-wider text-text-muted mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-0 border border-accent-dim/30 rounded-sm w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-mono text-sm text-text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </motion.div>

            {/* Add to cart */}
            <motion.div variants={staggerItem}>
              <Button
                onClick={handleAddToCart}
                size="lg"
                disabled={!inStock}
                leftIcon={<ShoppingBag size={16} />}
                className="w-full sm:w-auto"
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              {!inStock && (
                <p className="text-xs text-error-bright mt-2 font-mono">
                  This item is currently out of stock.
                </p>
              )}
            </motion.div>

            {/* Shipping note */}
            <motion.div
              variants={staggerItem}
              className="border-t border-accent-dim/20 pt-5 text-xs text-text-faint font-mono space-y-1"
            >
              <p>📦 Pengiriman ke seluruh Indonesia via JNE / TIKI / SiCepat</p>
              <p>🔄 Return dalam 7 hari untuk produk cacat produksi</p>
              <p>💳 Pembayaran via Midtrans: GoPay, QRIS, Transfer Bank, Kartu Kredit</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
