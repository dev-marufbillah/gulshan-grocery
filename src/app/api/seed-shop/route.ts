import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

const p = (
  name: string,
  slug: string,
  category: string,
  categoryName: string,
  weight: string,
  price: number,
  oldPrice: number,
  rating: number,
  emoji: string,
  brand: string,
  productType: string,
  stock = 100
) => ({
  name, slug, category, categoryName, weight, price, oldPrice, rating, emoji, brand, productType, stock,
});

const data = [
  p("Fresh Oranges", "fresh-oranges", "fresh-fruits", "Fruits", "500 g", 90, 120, 5.0, "🍊", "FreshHarvest", "Fresh Produce"),
  p("Desi Tomato", "desi-tomato", "vegetables", "Vegetables", "500 g", 45, 60, 5.0, "🍅", "FarmFresh", "Fresh Produce"),
  p("Pomegranate", "pomegranate", "fresh-fruits", "Fruits", "500 g", 220, 275, 4.9, "🍒", "FreshHarvest", "Fresh Produce"),
  p("Banana", "banana", "fresh-fruits", "Fruits", "500 g", 60, 80, 5.0, "🍌", "FarmFresh", "Fresh Produce"),
  p("Box of Chocolate", "box-of-chocolate", "snacks", "Snacks & Sweets", "750 g", 1200, 1500, 5.0, "🍫", "Nature's Best", "Packaged Goods"),
  p("Fresh Cabbage", "fresh-cabbage", "vegetables", "Vegetables", "750 g", 50, 70, 4.8, "🥬", "FarmFresh", "Fresh Produce"),
  p("Pineapple", "pineapple", "fresh-fruits", "Fruits", "750 g", 150, 190, 4.9, "🍍", "FreshHarvest", "Fresh Produce"),
  p("Fruit Jam Jar", "fruit-jam-jar", "snacks", "Breakfast Essential", "250 g", 380, 475, 4.8, "🍓", "Nature's Best", "Packaged Goods"),
  p("Fresh Green Apple", "fresh-green-apple", "fresh-fruits", "Fruits", "500 g", 180, 225, 4.7, "🍏", "FreshHarvest", "Fresh Produce"),
  p("Fresh Cucumber", "fresh-cucumber", "vegetables", "Vegetables", "250 g", 40, 50, 4.6, "🥒", "GreenGrocer", "Fresh Produce"),
  p("Red Onion", "red-onion", "vegetables", "Vegetables", "500 g", 70, 90, 4.8, "🧅", "FarmFresh", "Fresh Produce"),
  p("Walnut Ice Cream", "walnut-ice-cream", "frozen-food", "Ice Cream", "500 g", 420, 465, 4.9, "🍨", "GreenGrocer", "Frozen Foods"),
  p("Potato", "potato", "vegetables", "Vegetables", "1 Kg", 55, 70, 4.5, "🥔", "FarmFresh", "Fresh Produce"),
  p("Fresh Spinach", "fresh-spinach", "vegetables", "Vegetables", "250 g", 30, 40, 4.6, "🥬", "GreenGrocer", "Fresh Produce"),
  p("Himsagar Mango", "himsagar-mango", "fresh-fruits", "Fruits", "1 Kg", 160, 200, 4.9, "🥭", "FreshHarvest", "Fresh Produce"),
  p("Watermelon", "watermelon", "fresh-fruits", "Fruits", "2 Kg", 140, 175, 4.4, "🍉", "FarmFresh", "Fresh Produce"),
  p("Grapes", "grapes", "fresh-fruits", "Fruits", "500 g", 260, 325, 4.5, "🍇", "FreshHarvest", "Fresh Produce"),
  p("Basmati Rice", "basmati-rice", "rice-grains", "Rice & Grains", "5 Kg", 780, 900, 4.8, "🍚", "GoodGrains", "Packaged Goods"),
  p("Red Lentils", "red-lentils", "rice-grains", "Rice & Grains", "1 Kg", 140, 165, 4.6, "🫘", "GoodGrains", "Packaged Goods"),
  p("Whole Wheat Flour", "whole-wheat-flour", "rice-grains", "Rice & Grains", "2 Kg", 150, 180, 4.7, "🌾", "GoodGrains", "Packaged Goods"),
  p("Fresh Milk", "fresh-milk", "milk-eggs", "Dairy Products", "1 L", 110, 130, 4.9, "🥛", "FarmFresh", "Fresh Produce"),
  p("Farm Eggs", "farm-eggs", "milk-eggs", "Dairy Products", "12 pcs", 150, 180, 4.8, "🥚", "FarmFresh", "Fresh Produce"),
  p("Cheddar Cheese", "cheddar-cheese", "milk-eggs", "Dairy Products", "200 g", 360, 450, 4.7, "🧀", "Nature's Best", "Packaged Goods"),
  p("Orange Juice", "orange-juice", "drinks", "Beverages", "1 L", 180, 225, 4.6, "🧃", "GreenGrocer", "Packaged Goods"),
  p("Mineral Water", "mineral-water", "drinks", "Beverages", "2 L", 40, 50, 4.5, "💧", "GreenGrocer", "Packaged Goods"),
  p("Chicken Nuggets", "chicken-nuggets", "frozen-food", "Frozen Foods", "500 g", 380, 450, 4.6, "🍗", "FreshHarvest", "Frozen Foods"),
  p("Frozen Green Peas", "frozen-green-peas", "frozen-food", "Frozen Foods", "500 g", 120, 150, 4.4, "🥦", "GreenGrocer", "Frozen Foods", 0),
  p("Potato Chips", "potato-chips", "snacks", "Snacks & Sweets", "150 g", 90, 110, 4.5, "🍟", "Nature's Best", "Packaged Goods", 0),
  p("Red Chili Powder", "red-chili-powder", "spices", "Spices", "200 g", 130, 160, 4.7, "🌶️", "GoodGrains", "Packaged Goods"),
  p("Turmeric Powder", "turmeric-powder", "spices", "Spices", "200 g", 110, 135, 4.6, "🌿", "GoodGrains", "Packaged Goods"),
  p("Whole Wheat Bread", "whole-wheat-bread", "bakery", "Bakery", "400 g", 85, 105, 4.7, "🍞", "Nature's Best", "Packaged Goods"),
  p("Butter Croissant", "butter-croissant", "bakery", "Bakery", "4 pcs", 160, 200, 4.8, "🥐", "Nature's Best", "Packaged Goods"),
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    await connectDB();

    await Product.deleteMany({ slug: { $in: data.map((d) => d.slug) } });

    const inserted = await Product.insertMany(
      data.map((d, i) => ({
        ...d,
        order: 100 + i,
        featured: false,
        isDeal: false,
        isBestSeller: false,
      }))
    );

    const totalProducts = await Product.countDocuments({});

    return NextResponse.json({
      ok: true,
      inserted: inserted.length,
      totalProductsInDatabase: totalProducts,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}