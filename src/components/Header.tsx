"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  Heart,
  Menu,
  MapPin,
  Search,
  ShoppingBasket,
  ShoppingBag,
  User,
  Check,
  ShieldCheck,
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

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Fruits", href: "/shop?category=fresh-fruits" },
  { label: "Vegetable", href: "/shop?category=vegetables" },
  { label: "Beverages", href: "/shop?category=drinks" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
];

const socials = [
  { Icon: FaFacebookF, href: "#", label: "Facebook" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaPinterestP, href: "#", label: "Pinterest" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
];

const LOCATIONS = [
  "Gulshan 1, Dhaka",
  "Gulshan 2, Dhaka",
  "Banani, Dhaka",
  "Baridhara, Dhaka",
  "Niketan, Dhaka",
  "Badda, Dhaka",
];

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeLocal(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getLocalLocation() {
  if (typeof window === "undefined") return "Gulshan 1, Dhaka";
  return localStorage.getItem("gulshan-user-location") || "Gulshan 1, Dhaka";
}

function getServerLocation() {
  return "Gulshan 1, Dhaka";
}

function CartBadge() {
  const hydrated = useHydrated();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <Link href="/cart" aria-label="Cart" className="relative text-white hover:text-[#FBC617]">
      <ShoppingBag size={22} />
      {hydrated && totalItems > 0 && (
        <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FBC617] px-1 text-[11px] font-bold text-[#1a1a1a]">
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
      <Heart size={22} />
      {hydrated && total > 0 && (
        <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FBC617] px-1 text-[11px] font-bold text-[#1a1a1a]">
          {total}
        </span>
      )}
    </Link>
  );
}

function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLocation = useSyncExternalStore(
    subscribeLocal,
    getLocalLocation,
    getServerLocation
  );

  const handleSelect = (loc: string) => {
    localStorage.setItem("gulshan-user-location", loc);
    window.dispatchEvent(new Event("storage"));
    setIsOpen(false);
  };

  return (
    <div className="relative hidden shrink-0 flex-col items-start text-left lg:flex">
      <span className="text-[10px] uppercase tracking-wider text-white/80">
        Location
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-semibold text-white outline-none transition hover:text-[#FBC617]"
      >
        <MapPin size={16} className="text-[#FBC617]" fill="#FBC617" />
        <span>{selectedLocation}</span>
        <ChevronDown
          size={14}
          className={`text-[#FBC617] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-[#e5e5e5] bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
          <p className="border-b border-[#e5e5e5] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#6b6b6b]">
            Select Delivery Area
          </p>
          <div className="mt-1 space-y-0.5">
            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-[#E8F3EE] text-[#1E7F57]"
                      : "text-[#1a1a1a] hover:bg-[#F9F9F9]"
                  }`}
                >
                  <span>{loc}</span>
                  {isSelected && <Check size={14} className="text-[#1E7F57]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const [category, setCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "admin" || userRole === "superadmin";

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

  return (
    <header className="relative z-50 w-full">
      {/* Top Bar (Hidden on Mobile) */}
      <div className="hidden bg-[#FBC617] text-[#1a1a1a] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 text-sm md:px-6">
          <p>Call Us : +880 1700-000000</p>
          <p className="flex-1 text-center">
            Sign up and <span className="font-bold">GET 25% OFF</span> for your
            first order.{" "}
            <Link
              href="/register"
              className="font-medium text-[#1E7F57] underline underline-offset-4"
            >
              Sign up now
            </Link>
          </p>
          <div className="flex items-center gap-2">
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

      {/* Main Green Header */}
      <div className="bg-[#1E7F57] text-white transition-all">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:py-5">
          {/* Row 1: Logo & Icons */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <span className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-[#FBC617] text-[#1E7F57]">
                <ShoppingBasket size={22} className="lg:w-6 lg:h-6" />
              </span>
              <span className="text-xl lg:text-2xl font-semibold">
                Gulshan Grocery<span className="text-[#FBC617]">.</span>
              </span>
            </Link>

            <LocationSelector />

            {/* Search Bar (Desktop only) */}
            <div className="relative hidden order-last lg:order-0 lg:flex h-12 w-full min-w-0 flex-1 items-center">
              <form
                onSubmit={handleSearchSubmit}
                className="flex h-full w-full items-center rounded-xl bg-white/15 px-4"
              >
                <div className="flex items-center gap-3 border-r border-white/30 pr-3 text-sm sm:gap-6 sm:pr-4">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="cursor-pointer bg-transparent text-white outline-none [&>option]:text-black"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="drinks">Beverages</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                  placeholder="Search for products..."
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/70 focus:outline-none"
                />
                <button type="submit" aria-label="Search" className="shrink-0 pl-2">
                  <Search size={18} />
                </button>
              </form>

              {/* Desktop Search Dropdown */}
              {showDropdown && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white p-3 shadow-2xl animate-in fade-in zoom-in-95">
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

            {/* Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Mobile Search Toggle Button */}
              <button
                type="button"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="text-white hover:text-[#FBC617] lg:hidden"
              >
                <Search size={22} />
              </button>

              <WishlistBadge />
              <CartBadge />
              
              {/* Desktop Profile Icon */}
              <Link
                href="/account"
                aria-label="Account"
                className="hidden text-white hover:text-[#FBC617] lg:block"
              >
                <User size={22} />
              </Link>

              {/* Admin Icon */}
              {isAdmin && (
                <Link
                  href="/admin"
                  aria-label="Admin Dashboard"
                  title="Admin Dashboard"
                  className="text-white hover:text-[#FBC617] transition"
                >
                  <ShieldCheck size={22} />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar Expansion */}
          {showMobileSearch && (
            <div className="mt-3 pb-2 lg:hidden animate-in fade-in slide-in-from-top-2">
              <form
                onSubmit={handleSearchSubmit}
                className="flex h-12 w-full items-center rounded-xl bg-white/15 px-4"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search products..."
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-white placeholder:text-white/70 focus:outline-none"
                />
                <button type="submit" aria-label="Search" className="shrink-0 pl-2">
                  <Search size={18} />
                </button>
              </form>
            </div>
          )}

          {/* Row 2: Browse Categories, Nav Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-8 pt-4 pb-1 border-t border-white/10 mt-2">
            <Link
              href="/shop"
              className="flex shrink-0 items-center gap-3 rounded-lg bg-[#FBC617] px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-yellow-400"
            >
              <Menu size={20} />
              Browse All Categories
            </Link>

            <nav className="flex flex-1 items-center gap-6 text-sm font-medium">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="whitespace-nowrap transition hover:text-[#FBC617]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}