import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductItem } from "./ProductCard";

export default function BestSellers({
  products,
}: {
  products?: ProductItem[];
}) {
  // 🌟 Real HD Images for Best Sellers
  const demoProducts: ProductItem[] = [
    {
      id: "bs-1",
      slug: "box-of-chocolate",
      name: "Box of Chocolate",
      categoryName: "Snacks & Sweets",
      weight: "750 g",
      price: 1200,
      oldPrice: 1500,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bs-2",
      slug: "brown-bread",
      name: "Whole Wheat Bread",
      categoryName: "Bakery",
      weight: "400 g",
      price: 85,
      oldPrice: 105,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bs-3",
      slug: "fresh-milk",
      name: "Fresh Farm Milk",
      categoryName: "Dairy Products",
      weight: "1 L",
      price: 110,
      oldPrice: 130,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bs-4",
      slug: "desi-tomato",
      name: "Desi Red Tomato",
      categoryName: "Vegetables",
      weight: "500 g",
      price: 45,
      oldPrice: 60,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
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
            <p className="text-sm font-semibold text-[#6b6b6b]">Best Seller</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              <span className="text-[#1E7F57]">Best Seller</span> Products
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