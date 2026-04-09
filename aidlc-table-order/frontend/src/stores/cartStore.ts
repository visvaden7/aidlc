import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItemType, Menu } from '@/types';

const MAX_QUANTITY = 10;

interface CartState {
  items: CartItemType[];

  addItem: (menu: Menu) => boolean;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menu: Menu) => {
        const existing = get().items.find((i) => i.menuId === menu.menuId);
        if (existing && existing.quantity >= MAX_QUANTITY) {
          return false;
        }
        set((state) => {
          const found = state.items.find((i) => i.menuId === menu.menuId);
          if (found) {
            return {
              items: state.items.map((i) =>
                i.menuId === menu.menuId
                  ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                menuId: menu.menuId,
                menuName: menu.menuName,
                price: menu.price,
                imageUrl: menu.imageUrl,
                quantity: 1,
              },
            ],
          };
        });
        return true;
      },

      removeItem: (menuId: number) =>
        set((state) => ({
          items: state.items.filter((i) => i.menuId !== menuId),
        })),

      updateQuantity: (menuId: number, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(menuId);
          return;
        }
        const clamped = Math.min(quantity, MAX_QUANTITY);
        set((state) => ({
          items: state.items.map((i) =>
            i.menuId === menuId ? { ...i, quantity: clamped } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'table-order-cart' },
  ),
);
