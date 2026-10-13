import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();

  const dbName = mongoose.connection.name;
  const collections = (await mongoose.connection.db!.listCollections().toArray()).map(
    (c) => c.name
  );

  return NextResponse.json({
    dbName,
    collections,
    products: await Product.countDocuments({}),
    categories: await Category.countDocuments({}),
  });
}