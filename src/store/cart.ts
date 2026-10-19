import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  unit: string;
  quantity: number;
}

interface AddItemInput {
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
}

interface CartStore {
  items: CartItem[];
  addItem: (product: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const targetId = String(product._id || product.id || "").trim();
        if (!targetId) return;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => String(item._id || item.id) === targetId
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existingItem = updatedItems[existingIndex];
          const currentQty = Number(existingItem.quantity) || 1;
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: currentQty + 1,
          };
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            _id: targetId,
            id: targetId,
            name: product.name || "Product",
            price: Number(product.price) || 0,
            oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
            image: product.image || "",
            unit: product.unit || product.weight || "1 pc",
            quantity: Number(product.quantity || product.qty) || 1,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (id) => {
        const targetId = String(id).trim();
        set({
          items: get().items.filter(
            (item) => String(item._id || item.id) !== targetId
          ),
        });
      },

      updateQuantity: (id, delta) => {
        const targetId = String(id).trim();
        set({
          items: get()
            .items.map((item) => {
              const itemId = String(item._id || item.id);
              if (itemId === targetId) {
                const currentQty = Number(item.quantity) || 1;
                const newQty = currentQty + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce(
          (sum, item) => sum + (Number(item.quantity) || 1),
          0
        ),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) =>
            sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
          0
        ),
    }),
    {
      name: "gulshan-cart-storage",
    }
  )
);