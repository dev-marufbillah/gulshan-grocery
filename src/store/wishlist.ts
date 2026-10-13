import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  emoji: string;
  weight: string;
  stock?: number;
  dateAdded: string;
};

type WishlistState = {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "dateAdded">) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  totalItems: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) return state;
          return {
            items: [
              ...state.items,
              {
                ...item,
                dateAdded: new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      totalItems: () => get().items.length,
    }),
    { name: "gulshan-grocery-wishlist" }
  )
);