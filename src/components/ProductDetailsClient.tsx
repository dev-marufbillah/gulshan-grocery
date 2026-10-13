"use client";

import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useCartStore } from "@/store/cart";

const WEIGHT_OPTIONS = ["500 g", "1 Kg", "2 Kg", "5 Kg"];

export type ProductDetailsData = {
  _id: string;
  name: string;
  slug: string;
  categoryName: string;
  category: string;
  weight?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  description?: string;
  emoji?: string;
  image?: string;
  stock?: number;
  brand?: string;
  productType?: string;
};

// Fake review data
const REVIEWS = [
  {
    id: 1,
    name: "Kristin Watson",
    verified: true,
    date: "1 month ago",
    title: "Always Fresh and Delicious",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5,
  },
  {
    id: 2,
    name: "Bessie Cooper",
    verified: true,
    date: "2 month ago",
    title: "Super Fresh Products",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    rating: 5.0,
  },
  {
    id: 3,
    name: "Darlene Robertson",
    verified: true,
    date: "2 month ago",
    title: "Top Quality Every Time",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    rating: 5.0,
  },
];

export default function ProductDetailsClient({
  product,
}: {
  product: ProductDetailsData;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeWeight, setActiveWeight] = useState(product.weight || "500 g");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      emoji: product.emoji || "🛒",
      weight: activeWeight,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {/* ================= TOP SECTION ================= */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white p-6">
              {product.image && product.image.length > 5 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-[150px]">{product.emoji || "🛒"}</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 bg-white transition ${
                    activeImage === index ? "border-[#1E7F57]" : "border-[#e5e5e5]"
                  }`}
                >
                  {product.image && product.image.length > 5 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-4xl">{product.emoji || "🛒"}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm font-medium text-[#6b6b6b]">{product.categoryName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-bold text-[#1a1a1a]">{product.name}</h1>
              {(product.stock ?? 0) > 0 && (
                <span className="rounded-full bg-[#E8F3EE] px-3 py-1 text-xs font-semibold text-[#1E7F57]">
                  In Stock
                </span>
              )}
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-bold text-[#1a1a1a]">৳{product.price}</span>
              {(product.oldPrice ?? 0) > 0 && (
                <span className="text-xl text-[#999] line-through">৳{product.oldPrice}</span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-[#1a1a1a]">Weight</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setActiveWeight(w)}
                    className={`rounded-full px-5 py-2 text-sm transition ${
                      activeWeight === w
                        ? "bg-[#1E7F57] text-white"
                        : "border border-[#e5e5e5] bg-white text-[#1a1a1a] hover:border-[#1E7F57]"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-b border-[#e5e5e5] pb-8">
              <div className="flex h-12 w-32 items-center justify-between rounded-full border border-[#e5e5e5] px-2">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-[#1a1a1a]">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#1E7F57] px-8 font-semibold text-white transition hover:bg-[#166b48]"
              >
                {added ? "Added!" : "Add To Cart"}
              </button>
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#FBC617] px-8 font-semibold text-[#1a1a1a] transition hover:bg-yellow-500"
              >
                Buy Now
              </button>
            </div>
            
            <div className="mt-6 space-y-3 text-sm text-[#1a1a1a]">
              <p><span className="font-semibold">SKU :</span> GRFR85648HGJ</p>
              <p><span className="font-semibold">Tags :</span> Organic, Fresh, Bangladesh</p>
              <div className="flex items-center gap-4">
                <span className="font-semibold">Share :</span>
                <div className="flex gap-2">
                  <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1E7F57] text-white hover:bg-opacity-80"><FaFacebookF size={14} /></span>
                  <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1E7F57] text-white hover:bg-opacity-80"><FaTwitter size={14} /></span>
                  <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1E7F57] text-white hover:bg-opacity-80"><FaInstagram size={14} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS SECTION ================= */}
      <div className="mx-auto mt-10 max-w-5xl px-4 py-10 md:px-6">
        <div className="flex justify-center gap-10 border-b border-[#e5e5e5]">
          {["Description", "Additional Information", "Review"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-base font-semibold transition-colors md:text-lg ${
                activeTab === tab.toLowerCase()
                  ? "border-b-2 border-[#1E7F57] text-[#1E7F57]"
                  : "text-[#6b6b6b] hover:text-[#1a1a1a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-10">
          {activeTab === "description" && (
            <div className="text-sm leading-relaxed text-[#6b6b6b] space-y-4">
              <p>{product.description || "Fresh and healthy produce delivered directly to your home."}</p>
            </div>
          )}

          {activeTab === "additional information" && (
            <div className="overflow-hidden rounded-xl border border-[#e5e5e5]">
              <table className="w-full text-left text-sm text-[#1a1a1a]">
                <thead className="bg-[#FBC617]">
                  <tr>
                    <th className="w-1/3 px-6 py-4 font-bold">Attribute</th>
                    <th className="px-6 py-4 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-[#6b6b6b]">Product Type</td>
                    <td className="px-6 py-4 font-medium">{product.productType || "Fresh Produce"}</td>
                  </tr>
                  <tr className="bg-[#F9F9F9]">
                    <td className="px-6 py-4 text-[#6b6b6b]">Origin</td>
                    <td className="px-6 py-4 font-medium">Bangladesh</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-[#6b6b6b]">Brand</td>
                    <td className="px-6 py-4 font-medium">{product.brand || "Gulshan Grocery"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "review" && (
            <div>
              <div className="flex flex-col items-center gap-10 border-b border-[#e5e5e5] pb-12 md:flex-row md:gap-20">
                <div className="flex flex-col items-center justify-center md:w-1/3 md:border-r md:border-[#e5e5e5] md:pr-10">
                  <div className="flex items-end gap-2 text-[#1a1a1a]">
                    <span className="text-6xl font-bold">5.0</span>
                    <span className="mb-2 text-lg font-medium text-[#6b6b6b]">out of 5</span>
                  </div>
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={22} fill="#FBC617" className="text-[#FBC617]" />
                    ))}
                  </div>
                  <span className="mt-2 text-sm text-[#6b6b6b]">(245 Review)</span>
                </div>
              </div>

              <div className="mt-10 space-y-8">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="border-b border-[#e5e5e5] pb-8 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E7F57] text-lg font-bold text-white uppercase">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a1a1a]">{review.name}</h4>
                        <span className="text-xs text-[#6b6b6b]">{review.date}</span>
                      </div>
                    </div>
                    <h5 className="mt-3 font-bold text-[#1a1a1a]">{review.title}</h5>
                    <p className="mt-1 text-sm text-[#6b6b6b]">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}