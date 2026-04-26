import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, CartItem } from '@/types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          );

          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + newItem.quantity,
            };
            return { items: updated };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (
        productId: string,
        variantId: string | undefined,
        quantity: number
      ) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'kpr-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
