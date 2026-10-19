import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

interface NavState {
  items: NavItem[];
  addItem: (item: Omit<NavItem, "id">) => void;
  updateItem: (id: string, updated: Partial<NavItem>) => void;
  deleteItem: (id: string) => void;
  resetDefault: () => void;
}

// ডিফল্ট লিস্টে Beverages এর জায়গায় Groceries বসানো হয়েছে
const DEFAULT_ITEMS: NavItem[] = [
  { id: "1", label: "Home", href: "/" },
  { id: "2", label: "Shop", href: "/shop" },
  { id: "3", label: "Offers", href: "/offers", badge: "HOT" },
  { id: "4", label: "Fruits", href: "/shop?category=fresh-fruits" },
  { id: "5", label: "Vegetable", href: "/shop?category=vegetables" },
  { id: "6", label: "Groceries", href: "/shop?category=groceries" }, 
  { id: "7", label: "About Us", href: "/about" },
  { id: "8", label: "Contact Us", href: "/contact" },
  { id: "9", label: "Blogs", href: "/blogs" },
];

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      items: DEFAULT_ITEMS,
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now().toString() }],
        })),
      updateItem: (id, updated) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updated } : i)),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      resetDefault: () => set({ items: DEFAULT_ITEMS }),
    }),
    { name: "gulshan-nav-storage" }
  )
);