'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { productsApi } from '@/lib/api';
import { formatIDR } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { MerchCardSkeleton } from '@/components/ui/index';
import { useCartStore } from '@/store/cartStore';
import type { Product, ProductCategory } from '@/types';

const STATIC_PRODUCTS: Product[] = [
  {
    id: '1', slug: 'koma-tshirt-black', name: 'KOMA Tour Tee — Black',
    description: 'Heavy cotton, screen printed.', category: 'apparel',
    price: 185000, isFeatured: true, isPublished: true, stockTotal: 50,
    images: [{ id: '1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', isPrimary: true, sortOrder: 0 }],
    variants: [
      { id: 'v1', label: 'S', stock: 10, priceDelta: 0 },
      { id: 'v2', label: 'M', stock: 15, priceDelta: 0 },
      { id: 'v3', label: 'L', stock: 15, priceDelta: 0 },
      { id: 'v4', label: 'XL', stock: 10, priceDelta: 0 },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: '2', slug: 'galaksi-palapa-poster', name: 'Galaksi Palapa — Poster A2',
    description: 'High-gloss art print, 420×594mm.', category: 'poster',
    price: 125000, isFeatured: true, isPublished: true, stockTotal: 30,
    images: [{ id: '2', url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80', isPrimary: true, sortOrder: 0 }],
    variants: [],
    createdAt: '2024-01-01',
  },
  {
    id: '3', slug: 'kpr-enamel-pin', name: 'KPR Logo — Enamel Pin',
    description: 'Hard enamel, gold plating, butterfly clutch.', category: 'accessory',
    price: 75000, isFeatured: false, isPublished: true, stockTotal: 100,
    images: [{ id: '3', url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80', isPrimary: true, sortOrder: 0 }],
    variants: [],
    createdAt: '2024-01-01',
  },
  {
    id: '4', slug: 'aksioma-tshirt-white', name: 'Aksioma Tee — White',
    description: 'Premium cotton ringspun.', category: 'apparel',
    price: 175000, isFeatured: false, isPublished: true, stockTotal: 40,
    images: [{ id: '4', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', isPrimary: true, sortOrder: 0 }],
    variants: [
      { id: 'v5', label: 'S', stock: 10, priceDelta: 0 },
      { id: 'v6', label: 'M', stock: 10, priceDelta: 0 },
      { id: 'v7', label: 'L', stock: 10, priceDelta: 0 },
      { id: 'v8', label: 'XL', stock: 10, priceDelta: 0 },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: '5', slug: 'kpr-patch-woven', name: 'KPR Woven Patch',
    description: 'Iron-on/sew-on embroidered patch, 8cm.', category: 'accessory',
    price: 55000, isFeatured: false, isPublished: true, stockTotal: 200,
    images: [{ id: '5', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', isPrimary: true, sortOrder: 0 }],
    variants: [],
    createdAt: '2024-01-01',
  },
  {
    id: '6', slug: 'koma-poster-a2', name: 'KOMA — Poster A2',
    description: 'Offset print, matte finish.', category: 'poster',
    price: 135000, isFeatured: false, isPublished: true, stockTotal: 25,
    images: [{ id: '6', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80', isPrimary: true, sortOrder: 0 }],
    variants: [],
    createdAt: '2024-01-01',
  },
];

type CategoryFilter = 'all' | ProductCategory;

export function MerchClient() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = useSWR('products-all', () => productsApi.list(), {
    fallbackData: { data: STATIC_PRODUCTS },
  });

  const products = data?.data ?? STATIC_PRODUCTS;
  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'apparel', label: 'Apparel' },
    { key: 'poster', label: 'Posters' },
    { key: 'accessory', label: 'Accessories' },
  ];

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 0) {
      // Redirect to product page for size selection
      window.location.href = `/merch/${product.slug}`;
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0]?.url ?? '',
      slug: product.slug,
    });
    window.dispatchEvent(new CustomEvent('kpr:cart:open'));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`font-heading font-semibold text-sm uppercase tracking-wider px-5 py-2 rounded-sm border transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-accent border-accent text-white'
                : 'bg-transparent border-accent-dim/30 text-text-muted hover:border-accent/50 hover:text-text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => <MerchCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-3xl text-text-faint">NO PRODUCTS</p>
          <p className="text-text-muted text-sm mt-2">Check back soon.</p>
        </div>
      ) : (
        <motion.div
          key={activeCategory}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filtered.map((product) => {
            const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
            return (
              <motion.div key={product.id} variants={staggerItem}>
                <Link href={`/merch/${product.slug}`} className="group flex flex-col gap-3">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden rounded-card border border-accent-dim/20 group-hover:border-accent/40 transition-colors duration-300 bg-bg-surface">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag size={32} className="text-text-faint" />
                      </div>
                    )}
                    {product.stockTotal === 0 && (
                      <div className="absolute inset-0 bg-bg-base/60 flex items-center justify-center">
                        <span className="font-mono text-xs text-text-muted uppercase tracking-widest">
                          Sold Out
                        </span>
                      </div>
                    )}
                    {/* Quick add button */}
                    {product.stockTotal > 0 && (
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-accent rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-accent-mid shadow-glow-sm"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag size={14} className="text-white" />
                      </button>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-wider bg-accent text-white px-2 py-0.5 rounded-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-heading font-medium text-text-primary group-hover:text-accent-bright transition-colors duration-200 text-sm leading-snug">
                      {product.name}
                    </h3>
                    <p className="font-mono text-sm text-text-muted mt-1">
                      {formatIDR(product.price)}
                    </p>
                    {product.variants.length > 0 && (
                      <p className="font-mono text-xs text-text-faint mt-0.5">
                        {product.variants.map((v) => v.label).join(' · ')}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </>
  );
}
