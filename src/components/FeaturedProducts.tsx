import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductItem } from "./ProductCard";

export default function FeaturedProducts({
  products,
}: {
  products?: ProductItem[];
}) {
  // 🌟 Real HD Images matching Figma Screenshot
  const demoProducts: ProductItem[] = [
    {
      id: "f-1",
      slug: "fresh-strawberry",
      name: "Fresh Strawberry",
      categoryName: "Fruits",
      weight: "500 g",
      price: 480,
      oldPrice: 600,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "f-2",
      slug: "fresh-cauliflower",
      name: "Fresh Cauliflower",
      categoryName: "Vegetables",
      weight: "250 g",
      price: 60,
      oldPrice: 75,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "f-3",
      slug: "fresh-yellow-lemon",
      name: "Fresh Yellow Lemon",
      categoryName: "Fruits",
      weight: "1 Kg",
      price: 280,
      oldPrice: 350,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534531141161-e4ece2362b16?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "f-4",
      slug: "fresh-papaya",
      name: "Fresh Papaya",
      categoryName: "Fruits",
      weight: "500 g",
      price: 150,
      oldPrice: 190,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const displayProducts =
    products && products.length > 0 ? products.slice(0, 4) : demoProducts;

  return (
    <section className="bg-[#F9F9F9] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header matching Figma Screenshot */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#6b6b6b]">Products</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              Featured <span className="text-[#1E7F57]">Products</span>
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#1E7F57] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#166b48]"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}