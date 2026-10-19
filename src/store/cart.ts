import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  unit?: string;
  quantity: number;

  // TypeScript compatibility across all components
  slug?: string;
  emoji?: string;
  weight?: string;
  qty?: number;
}

export interface AddItemInput {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  unit?: string;
  weight?: string;
  quantity?: number;
  qty?: number;
  slug?: string;
  emoji?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (input) => {
        const itemId = String(input._id || input.id || '');
        if (!itemId) return;

        const qty = Number(input.quantity || input.qty || 1);
        const unit = input.unit || input.weight || '';
        const price = Number(input.price) || 0;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => String(i._id) === itemId
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            const existingItem = newItems[existingIndex];
            const updatedQty = (Number(existingItem.quantity) || 0) + qty;
            newItems[existingIndex] = {
              ...existingItem,
              quantity: updatedQty,
              qty: updatedQty,
            };
            return { items: newItems };
          }

          const newItem: CartItem = {
            _id: itemId,
            name: input.name || '',
            price: price,
            oldPrice: input.oldPrice,
            image: input.image || '',
            unit: unit,
            weight: unit,
            quantity: qty,
            qty: qty,
            slug: input.slug,
            emoji: input.emoji,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id) => {
        const targetId = String(id);
        set((state) => ({
          items: state.items.filter((i) => String(i._id) !== targetId),
        }));
      },

      updateQuantity: (id, delta) => {
        const targetId = String(id);
        set((state) => ({
          items: state.items
            .map((i) => {
              if (String(i._id) === targetId) {
                const newQty = (Number(i.quantity) || 0) + delta;
                return newQty > 0
                  ? { ...i, quantity: newQty, qty: newQty }
                  : null;
              }
              return i;
            })
            .filter((i): i is CartItem => i !== null),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce(
          (sum, i) => sum + (Number(i.quantity) || Number(i.qty) || 0),
          0
        );
      },

      totalPrice: () => {
        return get().items.reduce(
          (sum, i) =>
            sum +
            (Number(i.price) || 0) *
              (Number(i.quantity) || Number(i.qty) || 0),
          0
        );
      },
    }),
    {
      name: 'gulshan-cart-storage',
    }
  )
);