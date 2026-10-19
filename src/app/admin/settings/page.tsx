"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Save,
  CheckCircle2,
  Store,
  Truck,
  Globe,
  CreditCard,
  ShieldAlert,
  Layers,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Compass,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavStore } from "@/store/navStore";

type Slide = {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  image: string;
};

type PromoBanner = {
  badge: string;
  title: string;
  description: string;
  link: string;
  image: string;
};

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [fetching, setFetching] = useState(true);

  // ================= 1. HERO SLIDER SETTINGS =================
  const [slides, setSlides] = useState<Slide[]>([]);

  // ================= HEADER NAVIGATION SETTINGS =================
  const navMounted = useHydrated();
  const {
    items: navItems,
    addItem: addNavItem,
    updateItem: updateNavItem,
    deleteItem: deleteNavItem,
  } = useNavStore();
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [newBadge, setNewBadge] = useState("");

  // ================= 2. PROMO BANNERS SETTINGS =================
  const [promoShow, setPromoShow] = useState(true);
  const [promo1, setPromo1] = useState<PromoBanner>({
    badge: "Flat 20% Discount",
    title: "Purely Fresh Vegetables",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    link: "/shop?category=vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  });
  const [promo2, setPromo2] = useState<PromoBanner>({
    badge: "Flat 25% Discount",
    title: "Fresh Fruits, Pure Quality",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    link: "/shop?category=fresh-fruits",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
  });

  // ================= 3. FAQ SECTION SETTINGS =================
  const [faqShow, setFaqShow] = useState(true);
  const [faqSubtitle, setFaqSubtitle] = useState("News & Blogs");
  const [faqTitle, setFaqTitle] = useState("Our Latest News & Blogs");
  const [faqItems, setFaqItems] = useState([{ q: "", a: "" }]);

  // ================= 4. PHOTO GALLERY SETTINGS =================
  const [galleryShow, setGalleryShow] = useState(true);
  const [galleryPhotos, setGalleryPhotos] = useState([{ image: "" }]);

  // ================= 5. STORE GENERAL SETTINGS =================
  const [storeName, setStoreName] = useState("Gulshan Grocery");
  const [contactEmail, setContactEmail] = useState("support@gulshangrocery.com");
  const [contactPhone, setContactPhone] = useState("+880 1700-000000");
  const [storeAddress, setStoreAddress] = useState(
    "Gulshan 1, Dhaka 1212, Bangladesh"
  );

  // ================= 6. SHIPPING & PAYMENT =================
  const [deliveryCharge, setDeliveryCharge] = useState("60");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("500");

  const [bkashNumber, setBkashNumber] = useState("017XXXXXXXX (Merchant)");
  const [nagadNumber, setNagadNumber] = useState("016XXXXXXXX (Merchant)");
  const [enableCod, setEnableCod] = useState(true);

  // ================= 7. SOCIAL MEDIA & POLICIES =================
  const [facebook, setFacebook] = useState("https://facebook.com/gulshangrocery");
  const [instagram, setInstagram] = useState(
    "https://instagram.com/gulshangrocery"
  );
  const [twitter, setTwitter] = useState("https://twitter.com/gulshangrocery");

  const [returnDays, setReturnDays] = useState("7");
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailUsers, setEmailUsers] = useState(true);

  const inputCls =
    "w-full rounded-xl border border-[#e5e5e5] px-4 py-3 text-sm outline-none transition focus:border-[#1E7F57] bg-white text-[#1a1a1a]";

  useEffect(() => {
    async function loadData() {
      try {
        const heroRes = await fetch("/api/admin/hero");
        const heroData = await heroRes.json();
        if (heroData.settings?.slides?.length > 0) {
          setSlides(heroData.settings.slides);
        } else {
          setSlides([
            {
              badge: "The Best Online Grocery Store",
              titlePart1: "Your One-Stop Shop for ",
              titlePart2: "Quality Groceries",
              description: "Get fresh groceries delivered in Gulshan, Dhaka.",
              image:
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
            },
          ]);
        }

        const secRes = await fetch("/api/admin/section-settings");
        const secData = await secRes.json();
        if (secData.settings) {
          if (secData.settings.faq) {
            setFaqShow(secData.settings.faq.show ?? true);
            setFaqSubtitle(secData.settings.faq.subtitle || "News & Blogs");
            setFaqTitle(
              secData.settings.faq.title || "Our Latest News & Blogs"
            );
            if (secData.settings.faq.items?.length > 0)
              setFaqItems(secData.settings.faq.items);
          }
          if (secData.settings.gallery) {
            setGalleryShow(secData.settings.gallery.show ?? true);
            if (secData.settings.gallery.photos?.length > 0)
              setGalleryPhotos(secData.settings.gallery.photos);
          }
          if (secData.settings.promoBanners) {
            setPromoShow(secData.settings.promoBanners.show ?? true);
            if (secData.settings.promoBanners.banner1)
              setPromo1(secData.settings.promoBanners.banner1);
            if (secData.settings.promoBanners.banner2)
              setPromo2(secData.settings.promoBanners.banner2);
          }
        }
      } catch (err) {
        console.error("Load Settings Error:", err);
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      await fetch("/api/admin/section-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faq: {
            show: faqShow,
            subtitle: faqSubtitle,
            title: faqTitle,
            items: faqItems,
          },
          gallery: { show: galleryShow, photos: galleryPhotos },
          promoBanners: { show: promoShow, banner1: promo1, banner2: promo2 },
        }),
      });

      setLoading(false);
      setToast("All settings saved and published successfully!");
      setTimeout(() => setToast(""), 3000);
    } catch {
      alert("Failed to save settings");
      setLoading(false);
    }
  };

  const handleSlideChange = (
    index: number,
    field: keyof Slide,
    value: string
  ) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };
  const handleAddSlide = () =>
    setSlides([
      ...slides,
      {
        badge: "",
        titlePart1: "",
        titlePart2: "",
        description: "",
        image: "",
      },
    ]);
  const handleRemoveSlide = (index: number) => {
    if (slides.length === 1) return alert("You must have at least 1 slide.");
    setSlides(slides.filter((_, i) => i !== index));
  };
  const handleHeroFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Max size 5MB");
      const reader = new FileReader();
      reader.onloadend = () =>
        handleSlideChange(index, "image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePromoFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    bannerNum: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Max size 5MB");
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (bannerNum === 1) setPromo1((prev) => ({ ...prev, image: result }));
        else setPromo2((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Max size 5MB");
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...galleryPhotos];
        newPhotos[index].image = reader.result as string;
        setGalleryPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  if (fetching)
    return (
      <div className="p-10 text-center text-[#6b6b6b]">
        Loading store settings...
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1E7F57] px-6 py-4 text-white shadow-2xl animate-in slide-in-from-top-5 duration-300">
          <CheckCircle2 size={24} className="text-[#FBC617]" />
          <p className="text-sm font-bold">{toast}</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Store Settings</h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Full control over homepage hero, promo banners, sections, shipping,
          and store details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ================= 1. HERO SLIDER SETTINGS ================= */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                1. Homepage Hero Slider
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="flex items-center gap-1.5 rounded-full bg-[#E8F3EE] px-4 py-2 text-xs font-bold text-[#1E7F57] transition hover:bg-[#1E7F57] hover:text-white"
            >
              <Plus size={14} /> Add Slide
            </button>
          </div>

          <div className="space-y-8">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-[#1E7F57]">Slide {i + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                      Badge Text
                    </label>
                    <input
                      required
                      value={slide.badge}
                      onChange={(e) =>
                        handleSlideChange(i, "badge", e.target.value)
                      }
                      placeholder="Ex. Farm Fresh Everyday"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                      Slide Image
                    </label>
                    <div className="flex gap-2">
                      <label className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-3 transition hover:bg-[#E8F3EE]">
                        <Upload size={18} className="text-[#1E7F57]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleHeroFileUpload(e, i)}
                          className="hidden"
                        />
                      </label>
                      <input
                        required
                        value={slide.image}
                        onChange={(e) =>
                          handleSlideChange(i, "image", e.target.value)
                        }
                        placeholder="Or paste image URL"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                      Title Part 1 (Black)
                    </label>
                    <input
                      required
                      value={slide.titlePart1}
                      onChange={(e) =>
                        handleSlideChange(i, "titlePart1", e.target.value)
                      }
                      placeholder="Organic & Healthy "
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                      Title Part 2 (Green)
                    </label>
                    <input
                      required
                      value={slide.titlePart2}
                      onChange={(e) =>
                        handleSlideChange(i, "titlePart2", e.target.value)
                      }
                      placeholder="Fresh Produce"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                      Description
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={slide.description}
                      onChange={(e) =>
                        handleSlideChange(i, "description", e.target.value)
                      }
                      placeholder="Short description..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= HEADER NAVIGATION SETTINGS ================= */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="flex items-center gap-3">
              <Compass className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Header Navigation Links
              </h2>
            </div>
          </div>

          {navMounted && (
            <div className="space-y-6">
              <div className="space-y-4">
                {navItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="relative rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold text-[#1E7F57]">
                        Menu Item {i + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => deleteNavItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                          Menu Title
                        </label>
                        <input
                          value={item.label}
                          onChange={(e) =>
                            updateNavItem(item.id, { label: e.target.value })
                          }
                          className={inputCls}
                          placeholder="e.g. Fresh Meat"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                          Link URL
                        </label>
                        <input
                          value={item.href}
                          onChange={(e) =>
                            updateNavItem(item.id, { href: e.target.value })
                          }
                          className={inputCls}
                          placeholder="/category/meat"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-[#1a1a1a]">
                          Badge (Optional)
                        </label>
                        <input
                          value={item.badge || ""}
                          onChange={(e) =>
                            updateNavItem(item.id, { badge: e.target.value })
                          }
                          className={inputCls}
                          placeholder="e.g. Hot, New"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#1E7F57]/20 bg-[#E8F3EE] p-5">
                <h3 className="mb-4 font-bold text-[#1E7F57]">
                  + Add New Menu Link
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Title (e.g. Organic)"
                    className={inputCls}
                  />
                  <input
                    value={newHref}
                    onChange={(e) => setNewHref(e.target.value)}
                    placeholder="URL (e.g. /shop)"
                    className={inputCls}
                  />
                  <input
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="Badge (e.g. New)"
                    className={inputCls}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newLabel && newHref) {
                      addNavItem({
                        label: newLabel,
                        href: newHref,
                        badge: newBadge || undefined,
                      });
                      setNewLabel("");
                      setNewHref("");
                      setNewBadge("");
                    }
                  }}
                  className="mt-4 flex items-center gap-1.5 rounded-full bg-[#1E7F57] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#166b48]"
                >
                  <Plus size={16} /> Add to Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= 2. PROMO BANNERS ================= */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                2. Promo Banners (2 Offer Cards)
              </h2>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <span className="text-xs font-bold text-[#6b6b6b]">
                Show Section:
              </span>
              <input
                type="checkbox"
                checked={promoShow}
                onChange={(e) => setPromoShow(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
              />
            </label>
          </div>

          {promoShow && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] p-5">
                <h3 className="font-bold text-[#1E7F57]">
                  Banner 1 (Left Gray Card)
                </h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Badge Text
                  </label>
                  <input
                    required
                    value={promo1.badge}
                    onChange={(e) =>
                      setPromo1({ ...promo1, badge: e.target.value })
                    }
                    placeholder="Flat 20% Discount"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Title
                  </label>
                  <input
                    required
                    value={promo1.title}
                    onChange={(e) =>
                      setPromo1({ ...promo1, title: e.target.value })
                    }
                    placeholder="Purely Fresh Vegetables"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Description
                  </label>
                  <input
                    required
                    value={promo1.description}
                    onChange={(e) =>
                      setPromo1({ ...promo1, description: e.target.value })
                    }
                    placeholder="Description"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Button Link
                  </label>
                  <input
                    required
                    value={promo1.link}
                    onChange={(e) =>
                      setPromo1({ ...promo1, link: e.target.value })
                    }
                    placeholder="/shop?category=vegetables"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Image File or URL
                  </label>
                  <div className="flex gap-2">
                    <label className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-3 transition hover:bg-[#E8F3EE]">
                      <Upload size={18} className="text-[#1E7F57]" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePromoFileUpload(e, 1)}
                        className="hidden"
                      />
                    </label>
                    <input
                      required
                      value={promo1.image}
                      onChange={(e) =>
                        setPromo1({ ...promo1, image: e.target.value })
                      }
                      placeholder="Image URL"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] p-5">
                <h3 className="font-bold text-[#1E7F57]">
                  Banner 2 (Right Yellow Card)
                </h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Badge Text
                  </label>
                  <input
                    required
                    value={promo2.badge}
                    onChange={(e) =>
                      setPromo2({ ...promo2, badge: e.target.value })
                    }
                    placeholder="Flat 25% Discount"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Title
                  </label>
                  <input
                    required
                    value={promo2.title}
                    onChange={(e) =>
                      setPromo2({ ...promo2, title: e.target.value })
                    }
                    placeholder="Fresh Fruits, Pure Quality"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Description
                  </label>
                  <input
                    required
                    value={promo2.description}
                    onChange={(e) =>
                      setPromo2({ ...promo2, description: e.target.value })
                    }
                    placeholder="Description"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Button Link
                  </label>
                  <input
                    required
                    value={promo2.link}
                    onChange={(e) =>
                      setPromo2({ ...promo2, link: e.target.value })
                    }
                    placeholder="/shop?category=fresh-fruits"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Image File or URL
                  </label>
                  <div className="flex gap-2">
                    <label className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-3 transition hover:bg-[#E8F3EE]">
                      <Upload size={18} className="text-[#1E7F57]" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePromoFileUpload(e, 2)}
                        className="hidden"
                      />
                    </label>
                    <input
                      required
                      value={promo2.image}
                      onChange={(e) =>
                        setPromo2({ ...promo2, image: e.target.value })
                      }
                      placeholder="Image URL"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= 3. FAQ ================= */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="flex items-center gap-3">
              <Layers className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                3. FAQ Section Manager
              </h2>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <span className="text-xs font-bold text-[#6b6b6b]">
                Show Section:
              </span>
              <input
                type="checkbox"
                checked={faqShow}
                onChange={(e) => setFaqShow(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
              />
            </label>
          </div>

          {faqShow && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Subtitle
                  </label>
                  <input
                    value={faqSubtitle}
                    onChange={(e) => setFaqSubtitle(e.target.value)}
                    placeholder="News & Blogs"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]">
                    Main Title
                  </label>
                  <input
                    value={faqTitle}
                    onChange={(e) => setFaqTitle(e.target.value)}
                    placeholder="Our Latest News & Blogs"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-[#1a1a1a]">
                  Questions &amp; Answers List
                </label>
                {faqItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] p-3"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        required
                        value={item.q}
                        onChange={(e) => {
                          const n = [...faqItems];
                          n[i].q = e.target.value;
                          setFaqItems(n);
                        }}
                        placeholder="Question"
                        className={inputCls}
                      />
                      <textarea
                        required
                        value={item.a}
                        onChange={(e) => {
                          const n = [...faqItems];
                          n[i].a = e.target.value;
                          setFaqItems(n);
                        }}
                        placeholder="Answer"
                        rows={2}
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFaqItems(faqItems.filter((_, idx) => idx !== i))
                      }
                      className="mt-2 text-red-500 transition hover:text-red-700"
                      title="Delete Question"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFaqItems([...faqItems, { q: "", a: "" }])}
                  className="text-sm font-bold text-[#1E7F57] transition hover:underline"
                >
                  + Add Question
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= 4. GALLERY ================= */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                4. Photo Gallery Strip
              </h2>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <span className="text-xs font-bold text-[#6b6b6b]">
                Show Section:
              </span>
              <input
                type="checkbox"
                checked={galleryShow}
                onChange={(e) => setGalleryShow(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
              />
            </label>
          </div>

          {galleryShow && (
            <div className="space-y-4">
              {galleryPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] p-3"
                >
                  {photo.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photo.image}
                      alt="Preview"
                      className="h-12 w-12 rounded-lg border border-[#e5e5e5] object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#e5e5e5] bg-gray-100 text-xs text-gray-400">
                      No Img
                    </div>
                  )}
                  <input
                    required
                    value={photo.image}
                    onChange={(e) => {
                      const n = [...galleryPhotos];
                      n[i].image = e.target.value;
                      setGalleryPhotos(n);
                    }}
                    placeholder="Paste Image URL"
                    className={`${inputCls} flex-1`}
                  />
                  <label
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#E8F3EE] text-[#1E7F57] transition hover:bg-[#1E7F57] hover:text-white"
                    title="Upload File"
                  >
                    <Upload size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleGalleryUpload(e, i)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryPhotos(
                        galleryPhotos.filter((_, idx) => idx !== i)
                      )
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Delete Photo"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setGalleryPhotos([...galleryPhotos, { image: "" }])
                }
                className="text-sm font-bold text-[#1E7F57] transition hover:underline"
              >
                + Add Photo
              </button>
            </div>
          )}
        </div>

        {/* ================= 5. STORE INFO ================= */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
            <Store className="text-[#1E7F57]" size={20} />
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              5. Store General Information
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Store Name
              </label>
              <input
                required
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Contact Email
              </label>
              <input
                required
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Phone Number
              </label>
              <input
                required
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Full Address
              </label>
              <input
                required
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ================= 6–7. SHIPPING & PAYMENT ================= */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
              <Truck className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                6. Shipping &amp; Delivery
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Delivery Charge (৳)
                </label>
                <input
                  required
                  type="number"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Free Delivery Above (৳)
                </label>
                <input
                  required
                  type="number"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
              <CreditCard className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                7. Payment Gateways
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  bKash Merchant
                </label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Nagad Merchant
                </label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className={inputCls}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={enableCod}
                  onChange={(e) => setEnableCod(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]"
                />
                <span className="text-sm font-medium text-[#1a1a1a]">
                  Enable Cash on Delivery
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= 8–9. SOCIAL & POLICIES ================= */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
              <Globe className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                8. Social Media Links
              </h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white">
                  <FaFacebookF size={16} />
                </div>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook URL"
                  className={inputCls}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white">
                  <FaInstagram size={16} />
                </div>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram URL"
                  className={inputCls}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1DA1F2] text-white">
                  <FaTwitter size={16} />
                </div>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter URL"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
              <ShieldAlert className="text-[#1E7F57]" size={20} />
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                9. Policies &amp; Notifications
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Return Policy (Days)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={returnDays}
                    onChange={(e) => setReturnDays(e.target.value)}
                    className={inputCls}
                  />
                  <span className="text-sm font-medium text-[#6b6b6b]">
                    Days
                  </span>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={emailOrders}
                    onChange={(e) => setEmailOrders(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]"
                  />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Email me for new orders
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={emailUsers}
                    onChange={(e) => setEmailUsers(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]"
                  />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Email me for new users
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 flex justify-end rounded-2xl border border-[#e5e5e5] bg-white/80 p-4 shadow-lg backdrop-blur-md">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-[#1E7F57] px-12 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48] disabled:opacity-70"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}