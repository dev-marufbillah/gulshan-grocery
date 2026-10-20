"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBasket,
  ShoppingBag,
  User,
  ShieldCheck,
  Home,
  Tag,
  Store,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useNavStore } from "@/store/navStore";

type SearchResultItem = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  emoji?: string;
  categoryName?: string;
  weight?: string;
};

const socials = [
  { Icon: FaFacebookF, href: "#", label: "Facebook" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaPinterestP, href: "#", label: "Pinterest" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
];

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function CartBadge() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" aria-label="Cart" className="relative text-white hover:text-[#FBC617]">
      <ShoppingBag size={20} className="sm:w-5.5 sm:h-5.5" />
      {hydrated && totalItems > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-[#FBC617] px-1 text-[9px] sm:text-[11px] font-bold text-[#1a1a1a]">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

function WishlistBadge() {
  const hydrated = useHydrated();
  const total = useWishlistStore((s) => s.totalItems());

  return (
    <Link href="/wishlist" aria-label="Wishlist" className="relative text-white hover:text-[#FBC617]">
      <Heart size={20} className="sm:w-5.5 sm:h-5.5" />
      {hydrated && total > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-[#FBC617] px-1 text-[9px] sm:text-[11px] font-bold text-[#1a1a1a]">
          {total}
        </span>
      )}
    </Link>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e5e5e5] bg-white px-2 py-2 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
            pathname === "/" ? "text-[#1E7F57] font-bold" : "text-[#6b6b6b]"
          }`}
        >
          <Home size={22} />
          <span>Home</span>
        </Link>

        <Link
          href="/offers"
          className={`relative flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
            pathname === "/offers" ? "text-[#1E7F57] font-bold" : "text-[#6b6b6b]"
          }`}
        >
          <span className="absolute -top-2 rounded-full bg-red-500 px-1 py-0.5 text-[8px] font-bold text-white uppercase leading-none">
            HOT
          </span>
          <Tag size={22} />
          <span>Offers</span>
        </Link>

        <Link
          href="/cart"
          className="relative -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-lg ring-[5px] ring-white active:scale-95 transition-transform"
          aria-label="Cart"
        >
          <ShoppingBag size={24} />
          {hydrated && totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FBC617] px-1 text-[11px] font-bold text-[#1a1a1a] shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
            pathname?.startsWith("/shop") ? "text-[#1E7F57] font-bold" : "text-[#6b6b6b]"
          }`}
        >
          <Store size={22} />
          <span>Shop</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
            pathname === "/profile" || pathname === "/account"
              ? "text-[#1E7F57] font-bold"
              : "text-[#6b6b6b]"
          }`}
        >
          <User size={22} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { data: session } = useSession();
  const navItems = useNavStore((s) => s.items);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;

    let isCurrent = true;

    const timer = setTimeout(async () => {
      if (isCurrent) setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (isCurrent && res.ok) {
          setSearchResults(data.products || []);
          setShowDropdown(true);
        }
      } catch {
        // ignore
      } finally {
        if (isCurrent) setIsSearching(false);
      }
    }, 300);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setShowMobileSearch(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-md">
        <div className="bg-[#FBC617] text-[#1a1a1a]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-3 py-1.5 text-[11px] md:flex-row md:px-6 md:py-2.5 md:text-sm">
            <p className="font-medium text-[#1a1a1a]/80 md:block hidden">
              Call Us : +880 1700-000000
            </p>
            <p className="text-center font-medium">
              Sign up and <span className="font-bold">GET 25% OFF</span> for your first order.{" "}
              <Link
                href="/register"
                className="font-bold text-[#1E7F57] underline underline-offset-4 hover:text-[#166b48]"
              >
                Sign up now
              </Link>
            </p>
            <div className="hidden items-center gap-2 md:flex">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E7F57] text-[#FBC617] transition hover:scale-110"
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1E7F57] text-white transition-all">
          <div className="mx-auto max-w-7xl px-2.5 sm:px-4 py-3 md:px-6 lg:py-5">
            <div className="flex items-center justify-between gap-1.5 sm:gap-4">
              <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
                <span className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-[#FBC617] text-[#1E7F57]">
                  <ShoppingBasket size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </span>
                <span className="text-base sm:text-xl lg:text-2xl font-bold sm:font-semibold tracking-tight">
                  Gulshan Grocery<span className="text-[#FBC617]">.</span>
                </span>
              </Link>

              {/* Desktop Search (Category + Location removed) */}
              <div className="relative hidden lg:flex h-12 w-full min-w-0 max-w-2xl flex-1 items-center mx-auto">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex h-full w-full items-center rounded-full bg-white pl-5 pr-1.5 shadow-sm ring-2 ring-transparent transition focus-within:ring-[#FBC617]"
                >
                  <Search size={18} className="shrink-0 text-[#6b6b6b]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                    placeholder="Search for fruits, vegetables, groceries..."
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#1a1a1a] placeholder:text-[#9a9a9a] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="flex h-9 shrink-0 items-center justify-center rounded-full bg-[#FBC617] px-6 text-sm font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95"
                  >
                    Search
                  </button>
                </form>

                {showDropdown && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white p-3 text-[#1a1a1a] shadow-2xl animate-in fade-in zoom-in-95">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs font-semibold text-[#6b6b6b]">Searching products...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-[#e5e5e5]">
                        {searchResults.map((p) => (
                          <Link
                            key={p._id}
                            href={`/shop/${p.slug}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center justify-between p-2.5 transition hover:bg-[#F9F9F9] rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4F4F4]">
                                {p.image ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xl">{p.emoji}</span>
                                )}
                              </div>
                              <div>
                                <p className="line-clamp-1 text-sm font-bold text-[#1a1a1a]">{p.name}</p>
                                <p className="text-xs text-[#6b6b6b]">{p.categoryName} • {p.weight}</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#1E7F57] text-sm">৳{p.price}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs font-semibold text-[#6b6b6b]">No products found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="text-white hover:text-[#FBC617] lg:hidden p-0.5"
                  aria-label="Toggle search"
                >
                  <Search size={20} className="sm:w-5.5 sm:h-5.5" />
                </button>

                <WishlistBadge />

                <div className="hidden lg:block">
                  <CartBadge />
                </div>

                {/* Mobile-e hidden (bottom nav-e Profile ache), PC-te dekha jabe */}
                <Link
                  href={hydrated && session ? "/account" : "/login"}
                  aria-label="Account"
                  className="hidden lg:block text-white hover:text-[#FBC617] p-0.5"
                  title="Account"
                >
                  <User size={20} className="sm:w-5.5 sm:h-5.5" />
                </Link>

                <Link
                  href="/admin"
                  aria-label="Admin Panel"
                  title="Admin Dashboard"
                  className="flex items-center justify-center rounded-full bg-[#FBC617] p-1 sm:p-1.5 text-[#1a1a1a] transition hover:bg-yellow-400 shrink-0"
                >
                  <ShieldCheck size={18} className="sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>

            {/* Mobile Search */}
            {showMobileSearch && (
              <div className="mt-3 pb-2 lg:hidden animate-in fade-in slide-in-from-top-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex h-11 sm:h-12 w-full items-center rounded-full bg-white pl-4 pr-1.5 shadow-sm ring-2 ring-transparent transition focus-within:ring-[#FBC617]"
                >
                  <Search size={17} className="shrink-0 text-[#6b6b6b]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search products..."
                    className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-xs sm:text-sm text-[#1a1a1a] placeholder:text-[#9a9a9a] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="flex h-8 sm:h-9 shrink-0 items-center justify-center rounded-full bg-[#FBC617] px-4 text-xs sm:text-sm font-bold text-[#1a1a1a] transition hover:bg-yellow-400 active:scale-95"
                  >
                    Search
                  </button>
                </form>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-8 pt-4 pb-1 border-t border-white/10 mt-2">
              <Link
                href="/shop"
                className="flex shrink-0 items-center gap-3 rounded-lg bg-[#FBC617] px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-yellow-400"
              >
                <Menu size={20} />
                Browse All Categories
              </Link>

              <nav className="flex flex-1 items-center gap-6 text-sm font-medium">
                {hydrated &&
                  navItems.map((l) => (
                    <Link
                      key={l.id}
                      href={l.href}
                      className={`flex items-center transition hover:text-[#FBC617] ${
                        l.badge ? "text-[#FBC617] font-bold" : ""
                      }`}
                    >
                      {l.label}
                      {l.badge && (
                        <span className="ml-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
                          {l.badge}
                        </span>
                      )}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <MobileBottomNav />
    </>
  );
}